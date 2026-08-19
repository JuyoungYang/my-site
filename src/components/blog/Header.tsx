import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center px-6 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Study Archive
        </Link>
      </div>
    </header>
  );
}
