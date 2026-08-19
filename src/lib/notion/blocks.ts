import type { BlockObjectResponse } from "@notionhq/client";
import type { NotionBlock } from "@/types/post";
import { notion } from "./client";
import { downloadImage } from "./images";

export async function fetchBlocks(blockId: string, postId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const raw of response.results) {
      if (!("type" in raw)) continue;
      blocks.push(await normalizeBlock(raw, postId));
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

async function normalizeBlock(raw: BlockObjectResponse, postId: string): Promise<NotionBlock> {
  const { id, type, has_children } = raw;
  const rawContent = (raw as unknown as Record<string, unknown>)[type];
  const content =
    rawContent && typeof rawContent === "object" ? { ...(rawContent as Record<string, unknown>) } : rawContent;

  if (type === "image" && content && typeof content === "object") {
    const imageContent = content as {
      type: "file" | "external";
      file?: { url: string };
      external?: { url: string };
    };
    (content as Record<string, unknown>).url =
      imageContent.type === "file" && imageContent.file
        ? await downloadImage(imageContent.file.url, postId, id)
        : (imageContent.external?.url ?? "");
    delete (content as Record<string, unknown>).file;
    delete (content as Record<string, unknown>).external;
  }

  const block: NotionBlock = { id, type, has_children, [type]: content };

  if (has_children) {
    block.children = await fetchBlocks(id, postId);
  }

  return block;
}
