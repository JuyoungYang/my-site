"use client";

import { useMemo, useState } from "react";
import type { PostSummary } from "@/types/post";
import { PostCard } from "./PostCard";

export function PostListClient({
  posts,
  initialCategory,
}: {
  posts: PostSummary[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState<string | null>(initialCategory ?? null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((post) => post.category))).sort(),
    [posts]
  );

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (category && post.category !== category) return false;
      if (selectedTags.length > 0 && !selectedTags.every((tag) => post.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  }, [posts, category, selectedTags]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            category === null
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          전체
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === category ? null : c)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                selectedTags.includes(tag)
                  ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="py-16 text-center text-zinc-500 dark:text-zinc-400">
            조건에 맞는 글이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
