import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Post } from "@/types/post";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

export async function getAllPostIds(): Promise<string[]> {
  const files = await readdir(POSTS_DIR).catch(() => [] as string[]);
  return files.filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, ""));
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const raw = await readFile(path.join(POSTS_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw) as Post;
  } catch {
    return null;
  }
}
