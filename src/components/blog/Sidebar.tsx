const INTERESTS = ["데이터 엔지니어링", "피지컬 AI", "Vision AI", "LLM", "RAG"];

export function Sidebar() {
  return (
    <aside className="md:sticky md:top-10 md:h-fit md:w-56 md:shrink-0">
      <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
        안녕하세요, 양주영입니다. 이 공간은 제가 공부한 내용을 기록하고 정리하기 위해 만든
        블로그입니다.
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {INTERESTS.map((interest) => (
          <li
            key={interest}
            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {interest}
          </li>
        ))}
      </ul>

      <ul className="mt-6 space-y-1.5 text-sm">
        <li>
          <a
            href="mailto:juyoung.yang11@gmail.com"
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            juyoung.yang11@gmail.com
          </a>
        </li>
        <li>
          <a
            href="https://github.com/JuyoungYang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            github.com/JuyoungYang
          </a>
        </li>
      </ul>
    </aside>
  );
}
