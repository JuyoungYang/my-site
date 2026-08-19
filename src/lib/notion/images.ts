import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public", "images", "posts");

function extensionFromUrl(url: string): string {
  const { pathname } = new URL(url);
  return path.extname(pathname) || ".jpg";
}

export async function downloadImage(
  url: string,
  postId: string,
  fileName: string
): Promise<string> {
  const targetDir = path.join(PUBLIC_IMAGES_DIR, postId);
  await mkdir(targetDir, { recursive: true });

  const finalName = `${fileName}${extensionFromUrl(url)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`이미지 다운로드 실패 (${response.status}): ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(targetDir, finalName), buffer);

  return `/images/posts/${postId}/${finalName}`;
}
