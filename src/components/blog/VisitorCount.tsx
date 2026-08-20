"use client";

import { useEffect, useState } from "react";

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://abacus.jasoncameron.dev/hit/juyoungyang-study-archive/visits")
      .then((res) => res.json())
      .then((data: { value: number }) => setCount(data.value))
      .catch(() => {});
  }, []);

  if (count === null) return null;

  return (
    <span className="mt-6 inline-flex w-fit items-center rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
      방문자수 {count.toLocaleString()}
    </span>
  );
}
