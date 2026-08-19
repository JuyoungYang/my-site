import Link from "next/link";

export interface RichTextItem {
  type: string;
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
}

export function asRichText(value: unknown): RichTextItem[] {
  return Array.isArray(value) ? (value as RichTextItem[]) : [];
}

export function RichText({ richText }: { richText: RichTextItem[] }) {
  return (
    <>
      {richText.map((item, index) => {
        let node: React.ReactNode = item.plain_text;

        if (item.annotations.code) {
          node = (
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.9em] dark:bg-zinc-800">
              {node}
            </code>
          );
        }
        if (item.annotations.bold) node = <strong>{node}</strong>;
        if (item.annotations.italic) node = <em>{node}</em>;
        if (item.annotations.strikethrough) node = <s>{node}</s>;
        if (item.annotations.underline) node = <u>{node}</u>;

        if (item.href) {
          const isExternal = /^https?:\/\//.test(item.href);
          node = (
            <Link
              href={item.href}
              className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              {node}
            </Link>
          );
        }

        return <span key={index}>{node}</span>;
      })}
    </>
  );
}
