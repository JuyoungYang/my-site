"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/categories", label: "Categories" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:sticky md:top-10 md:h-fit md:w-48 md:shrink-0">
      <Link href="/" className="flex flex-col items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.png"
          alt="프로필 이미지"
          width={160}
          height={160}
          className="h-40 w-40 rounded-full object-cover"
        />
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">JUYOUNG&apos;S</span>
          <span className="text-lg font-semibold tracking-tight">Study Archive</span>
          <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            데이터 엔지니어링 · 피지컬 AI · LLM
          </span>
        </span>
      </Link>

      <nav className="mt-6 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
