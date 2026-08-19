import Link from "next/link";
import type { Metadata } from "next";
import posts from "@/content/posts.json";

export const metadata: Metadata = {
  title: "Categories",
};

export default function CategoriesPage() {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  const categories = Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], "ko"));

  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Categories
      </h1>

      {categories.length > 0 ? (
        <ul className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800">
          {categories.map(([category, count]) => (
            <li key={category}>
              <Link
                href={`/?category=${encodeURIComponent(category)}`}
                className="flex items-center justify-between py-4 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                <span className="text-lg">{category}</span>
                <span className="text-sm text-zinc-400 dark:text-zinc-500">{count}개</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-zinc-500 dark:text-zinc-400">아직 카테고리가 없습니다.</p>
      )}
    </article>
  );
}
