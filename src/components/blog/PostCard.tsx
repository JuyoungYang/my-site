import Link from "next/link";
import type { PostSummary } from "@/types/post";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block border-b border-zinc-200 py-8 first:pt-0 dark:border-zinc-800"
    >
      <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{post.category}</span>
        <span aria-hidden>·</span>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </div>

      <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 group-hover:underline dark:text-zinc-50">
        {post.title}
      </h2>

      {post.summary && (
        <p className="mt-2 line-clamp-2 text-zinc-600 dark:text-zinc-400">{post.summary}</p>
      )}

      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
