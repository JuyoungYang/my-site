import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PageObjectResponse } from "@notionhq/client";
import { notion, NOTION_DATABASE_ID } from "../src/lib/notion/client";
import { fetchBlocks } from "../src/lib/notion/blocks";
import { getDate, getMultiSelect, getRichText, getSelect, getTitle } from "../src/lib/notion/properties";
import type { Post, PostSummary } from "../src/types/post";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "posts");

const PROPERTY = {
  title: "제목",
  summary: "요약",
  category: "카테고리",
  tags: "태그",
  publishedAt: "작성일",
  status: "상태",
} as const;

const STATUS_PUBLISHED = "완료";

async function getDataSourceId(): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID });
  if (!("data_sources" in database) || database.data_sources.length === 0) {
    throw new Error("데이터베이스에서 data source를 찾을 수 없습니다.");
  }
  return database.data_sources[0].id;
}

async function queryPublishedPages(dataSourceId: string): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: PROPERTY.status, status: { equals: STATUS_PUBLISHED } },
      sorts: [{ property: PROPERTY.publishedAt, direction: "descending" }],
      start_cursor: cursor,
      page_size: 100,
    });

    for (const result of response.results) {
      if (result.object === "page" && "properties" in result) {
        pages.push(result);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

async function buildPost(page: PageObjectResponse): Promise<Post> {
  const id = page.id;
  const title = getTitle(page, PROPERTY.title);
  const summary = getRichText(page, PROPERTY.summary);
  const category = getSelect(page, PROPERTY.category) ?? "미분류";
  const tags = getMultiSelect(page, PROPERTY.tags);
  const publishedAt = getDate(page, PROPERTY.publishedAt) ?? page.created_time.slice(0, 10);
  const blocks = await fetchBlocks(id, id);

  return { id, title, summary, category, tags, publishedAt, blocks };
}

async function removeStalePosts(currentIds: Set<string>): Promise<string[]> {
  const existingFiles = await readdir(POSTS_DIR).catch(() => [] as string[]);
  const removed: string[] = [];

  for (const file of existingFiles) {
    if (!file.endsWith(".json")) continue;
    const id = file.replace(/\.json$/, "");
    if (currentIds.has(id)) continue;

    await rm(path.join(POSTS_DIR, file));
    await rm(path.join(IMAGES_DIR, id), { recursive: true, force: true });
    removed.push(id);
  }

  return removed;
}

async function main() {
  console.log("Notion 동기화를 시작합니다...");

  const dataSourceId = await getDataSourceId();
  const pages = await queryPublishedPages(dataSourceId);
  console.log(`'${STATUS_PUBLISHED}' 상태의 글 ${pages.length}개를 찾았습니다.`);

  await mkdir(POSTS_DIR, { recursive: true });

  const posts: Post[] = [];
  for (const page of pages) {
    const post = await buildPost(page);
    posts.push(post);
    console.log(`  - 동기화: ${post.title}`);
  }

  const currentIds = new Set(posts.map((p) => p.id));
  const removed = await removeStalePosts(currentIds);
  for (const id of removed) {
    console.log(`  - 제거: ${id}`);
  }

  for (const post of posts) {
    await writeFile(path.join(POSTS_DIR, `${post.id}.json`), JSON.stringify(post, null, 2));
  }

  const summaries: PostSummary[] = posts
    .map(({ blocks: _blocks, ...summary }) => summary)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  await writeFile(path.join(CONTENT_DIR, "posts.json"), JSON.stringify(summaries, null, 2));

  console.log(`동기화 완료: 게시글 ${posts.length}개, 제거 ${removed.length}개`);
}

main().catch((error) => {
  console.error("동기화 실패:", error);
  process.exit(1);
});
