import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PageObjectResponse } from "@notionhq/client";
import { notion, NOTION_DATABASE_ID } from "../src/lib/notion/client";
import { fetchBlocks } from "../src/lib/notion/blocks";
import { getDate, getMultiSelect, getRichText, getSelect, getTitle } from "../src/lib/notion/properties";
import type { Post, PostSummary } from "../src/types/post";

type StoredPost = Post & { lastEditedTime: string };

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

function getTodayKST(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

async function queryPublishedPages(dataSourceId: string): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;
  const today = getTodayKST();

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          { property: PROPERTY.status, status: { equals: STATUS_PUBLISHED } },
          { property: PROPERTY.publishedAt, date: { on_or_before: today } },
        ],
      },
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

async function readExistingPost(id: string): Promise<StoredPost | null> {
  try {
    const raw = await readFile(path.join(POSTS_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw) as StoredPost;
  } catch {
    return null;
  }
}

async function buildPost(page: PageObjectResponse, existing: StoredPost | null): Promise<StoredPost> {
  const id = page.id;
  const lastEditedTime = page.last_edited_time;

  if (existing && existing.lastEditedTime === lastEditedTime) {
    return existing;
  }

  const title = getTitle(page, PROPERTY.title);
  const summary = getRichText(page, PROPERTY.summary);
  const category = getSelect(page, PROPERTY.category) ?? "미분류";
  const tags = getMultiSelect(page, PROPERTY.tags);
  const publishedAt = getDate(page, PROPERTY.publishedAt) ?? page.created_time.slice(0, 10);
  const blocks = await fetchBlocks(id, id);

  return { id, title, summary, category, tags, publishedAt, lastEditedTime, blocks };
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
  console.log(`'${STATUS_PUBLISHED}' 상태이면서 작성일이 지난 글 ${pages.length}개를 찾았습니다.`);

  await mkdir(POSTS_DIR, { recursive: true });

  const posts: StoredPost[] = [];
  for (const page of pages) {
    const existing = await readExistingPost(page.id);
    const post = await buildPost(page, existing);
    posts.push(post);

    const unchanged = existing !== null && existing.lastEditedTime === post.lastEditedTime;
    console.log(`  - ${unchanged ? "변경 없음" : "동기화"}: ${post.title}`);
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
    .map(({ blocks: _blocks, lastEditedTime: _lastEditedTime, ...summary }) => summary)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  await writeFile(path.join(CONTENT_DIR, "posts.json"), JSON.stringify(summaries, null, 2));

  console.log(`동기화 완료: 게시글 ${posts.length}개, 제거 ${removed.length}개`);
}

main().catch((error) => {
  console.error("동기화 실패:", error);
  process.exit(1);
});
