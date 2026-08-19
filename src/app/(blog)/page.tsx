const INTERESTS = ["데이터 엔지니어링", "피지컬 AI", "Vision AI", "LLM", "RAG"];

export default function HomePage() {
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">About</h1>

      <p className="mt-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
        안녕하세요, 양주영입니다. 이 공간은 제가 공부한 내용을 기록하고 정리하기 위해 만든
        블로그입니다.
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        관심분야
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {INTERESTS.map((interest) => (
          <li
            key={interest}
            className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {interest}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Contact
      </h2>
      <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
        <li>
          Email:{" "}
          <a
            href="mailto:juyoung.yang11@gmail.com"
            className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            juyoung.yang11@gmail.com
          </a>
        </li>
        <li>
          GitHub:{" "}
          <a
            href="https://github.com/JuyoungYang"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            github.com/JuyoungYang
          </a>
        </li>
      </ul>
    </article>
  );
}
