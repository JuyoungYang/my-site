import { PostListClient } from "@/components/blog/PostListClient";
import posts from "@/content/posts.json";

export default function HomePage() {
  return <PostListClient posts={posts} />;
}
