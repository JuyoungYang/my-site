import type { Metadata } from "next";
import { PostListClient } from "@/components/blog/PostListClient";
import posts from "@/content/posts.json";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <PostListClient posts={posts} initialCategory={category} />;
}
