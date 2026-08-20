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
    <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
      방문자수 {count.toLocaleString()}
    </p>
  );
}
