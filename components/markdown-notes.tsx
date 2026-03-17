"use client";

import { Fragment, type ReactNode } from "react";

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${part}-${index}`}
          className="rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.92em] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const boldParts = part.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <Fragment key={`${part}-${index}`}>
        {boldParts.map((boldPart, boldIndex) => {
          if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
            return (
              <strong key={`${boldPart}-${boldIndex}`} className="font-semibold">
                {boldPart.slice(2, -2)}
              </strong>
            );
          }

          return <Fragment key={`${boldPart}-${boldIndex}`}>{boldPart}</Fragment>;
        })}
      </Fragment>
    );
  });
}

function renderMarkdown(notes: string) {
  const lines = notes.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      const headingClass =
        level === 1
          ? "text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50"
          : level === 2
            ? "border-b border-zinc-200 pb-2 text-xl font-semibold tracking-tight text-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
            : "text-lg font-semibold text-zinc-900 dark:text-zinc-100";

      blocks.push(
        <div key={`heading-${index}`} className={headingClass}>
          {renderInlineMarkdown(title)}
        </div>,
      );
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push(
        <hr
          key={`hr-${index}`}
          className="border-0 border-t border-zinc-200 dark:border-zinc-800"
        />,
      );
      index += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(rawLine)) {
      const items: ReactNode[] = [];

      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        const current = lines[index];
        const indent = current.match(/^\s*/)?.[0].length ?? 0;
        const itemText = current.replace(/^\s*[-*]\s+/, "");
        items.push(
          <li
            key={`li-${index}`}
            className="leading-7 marker:text-zinc-500"
            style={{ marginLeft: `${Math.max(0, indent / 2) * 1.25}rem` }}
          >
            {renderInlineMarkdown(itemText)}
          </li>,
        );
        index += 1;
      }

      blocks.push(
        <ul
          key={`ul-${index}`}
          className="list-disc space-y-1.5 pl-6 text-[15px] text-zinc-700 dark:text-zinc-300"
        >
          {items}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(rawLine)) {
      const items: ReactNode[] = [];

      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        const current = lines[index];
        const indent = current.match(/^\s*/)?.[0].length ?? 0;
        const itemText = current.replace(/^\s*\d+\.\s+/, "");
        items.push(
          <li
            key={`ol-li-${index}`}
            className="leading-7 marker:font-medium marker:text-zinc-500"
            style={{ marginLeft: `${Math.max(0, indent / 2) * 1.25}rem` }}
          >
            {renderInlineMarkdown(itemText)}
          </li>,
        );
        index += 1;
      }

      blocks.push(
        <ol
          key={`ol-${index}`}
          className="list-decimal space-y-1.5 pl-6 text-[15px] text-zinc-700 dark:text-zinc-300"
        >
          {items}
        </ol>,
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index].trim()) &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !/^---+$/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p
        key={`p-${index}`}
        className="text-[15px] leading-7 text-zinc-700 dark:text-zinc-300"
      >
        {renderInlineMarkdown(paragraphLines.join(" "))}
      </p>,
    );
  }

  return blocks;
}

export function MarkdownNotes({ notes }: { notes: string }) {
  return <div className="flex flex-col gap-5">{renderMarkdown(notes)}</div>;
}
