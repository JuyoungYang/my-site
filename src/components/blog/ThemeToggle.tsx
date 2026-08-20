"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label="다크 모드 전환"
      className={`relative mt-6 flex h-7 w-14 shrink-0 items-center rounded-full transition-colors ${
        isDark ? "bg-zinc-800" : "bg-zinc-200"
      }`}
    >
      <span
        className={`absolute left-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm shadow transition-transform ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {mounted ? (isDark ? "🌙" : "☀️") : null}
      </span>
    </button>
  );
}
