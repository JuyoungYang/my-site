import { PostListClient } from "@/components/blog/PostListClient";
import posts from "@/content/posts.json";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <PostListClient posts={posts} initialCategory={category} />;
}
