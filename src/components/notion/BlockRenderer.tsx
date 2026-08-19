import type { NotionBlock } from "@/types/post";
import { RichText, asRichText } from "./RichText";

export function BlockRenderer({ blocks }: { blocks: NotionBlock[] }) {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const listType = block.type;
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === listType) {
        items.push(blocks[i]);
        i++;
      }
      const ListTag = listType === "bulleted_list_item" ? "ul" : "ol";
      nodes.push(
        <ListTag
          key={items[0].id}
          className={listType === "bulleted_list_item" ? "list-disc space-y-1 pl-6" : "list-decimal space-y-1 pl-6"}
        >
          {items.map((item) => {
            const content = item[listType] as { rich_text?: unknown };
            return (
              <li key={item.id}>
                <RichText richText={asRichText(content?.rich_text)} />
                {item.children && <BlockRenderer blocks={item.children} />}
              </li>
            );
          })}
        </ListTag>
      );
      continue;
    }

    nodes.push(<Block key={block.id} block={block} />);
    i++;
  }

  return <>{nodes}</>;
}

function Block({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "paragraph": {
      const content = block.paragraph as { rich_text?: unknown };
      return (
        <p className="leading-relaxed">
          <RichText richText={asRichText(content?.rich_text)} />
        </p>
      );
    }
    case "heading_1": {
      const content = block.heading_1 as { rich_text?: unknown };
      return (
        <h2 className="mt-10 text-2xl font-bold tracking-tight">
          <RichText richText={asRichText(content?.rich_text)} />
        </h2>
      );
    }
    case "heading_2": {
      const content = block.heading_2 as { rich_text?: unknown };
      return (
        <h3 className="mt-8 text-xl font-semibold tracking-tight">
          <RichText richText={asRichText(content?.rich_text)} />
        </h3>
      );
    }
    case "heading_3": {
      const content = block.heading_3 as { rich_text?: unknown };
      return (
        <h4 className="mt-6 text-lg font-semibold tracking-tight">
          <RichText richText={asRichText(content?.rich_text)} />
        </h4>
      );
    }
    case "quote": {
      const content = block.quote as { rich_text?: unknown };
      return (
        <blockquote className="border-l-2 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          <RichText richText={asRichText(content?.rich_text)} />
        </blockquote>
      );
    }
    case "callout": {
      const content = block.callout as {
        rich_text?: unknown;
        icon?: { type: string; emoji?: string };
      };
      return (
        <div className="flex gap-3 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
          {content?.icon?.emoji && <span aria-hidden>{content.icon.emoji}</span>}
          <div className="leading-relaxed">
            <RichText richText={asRichText(content?.rich_text)} />
          </div>
        </div>
      );
    }
    case "to_do": {
      const content = block.to_do as { rich_text?: unknown; checked?: boolean };
      return (
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={!!content?.checked} disabled className="mt-1.5" />
          <RichText richText={asRichText(content?.rich_text)} />
        </label>
      );
    }
    case "code": {
      const content = block.code as { rich_text?: unknown; language?: string };
      const text = asRichText(content?.rich_text)
        .map((t) => t.plain_text)
        .join("");
      return (
        <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
          <code>{text}</code>
        </pre>
      );
    }
    case "divider":
      return <hr className="border-zinc-200 dark:border-zinc-800" />;
    case "image": {
      const content = block.image as { url?: string; caption?: unknown };
      if (!content?.url) return null;
      const caption = asRichText(content.caption);
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.url}
            alt={caption.map((c) => c.plain_text).join("") || ""}
            className="w-full rounded-lg"
          />
          {caption.length > 0 && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
              <RichText richText={caption} />
            </figcaption>
          )}
        </figure>
      );
    }
    case "table": {
      const rows = block.children ?? [];
      const tableContent = block.table as { has_column_header?: boolean };
      const hasHeader = !!tableContent?.has_column_header;
      const [headerRow, ...bodyRows] = rows;
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {hasHeader && headerRow && (
              <thead>
                <TableRow block={headerRow} isHeader />
              </thead>
            )}
            <tbody>
              {(hasHeader ? bodyRows : rows).map((row) => (
                <TableRow key={row.id} block={row} />
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "table_row":
      return null;
    default:
      if (block.has_children && block.children) {
        return <BlockRenderer blocks={block.children} />;
      }
      return null;
  }
}

function TableRow({ block, isHeader }: { block: NotionBlock; isHeader?: boolean }) {
  const content = block.table_row as { cells?: unknown[][] };
  const cells = content?.cells ?? [];
  const CellTag = isHeader ? "th" : "td";
  return (
    <tr className="border-b border-zinc-200 dark:border-zinc-800">
      {cells.map((cell, index) => (
        <CellTag key={index} className="p-2 text-left align-top">
          <RichText richText={asRichText(cell)} />
        </CellTag>
      ))}
    </tr>
  );
}
