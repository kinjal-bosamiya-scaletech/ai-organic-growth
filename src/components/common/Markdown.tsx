import { Fragment } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const PROSE_CLASSNAME =
  "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold " +
  "[&_a]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-[3px] hover:[&_a]:decoration-foreground " +
  "[&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs " +
  "[&_h2]:mb-1 [&_h2]:text-md [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold " +
  "[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5";

// Appended to the in-progress text when `showCursor` is set, then swapped for
// the blinking cursor wherever it lands in the parsed markdown tree — keeps
// the cursor inline at the true end of the last word instead of on its own
// line after the block content.
const CURSOR_MARKER = "";
const Cursor = () => <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[3px] animate-pulse bg-current align-baseline" />;

function withCursor(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    const index = children.indexOf(CURSOR_MARKER);
    if (index === -1) return children;
    return (
      <>
        {children.slice(0, index)}
        <Cursor />
      </>
    );
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => <Fragment key={i}>{withCursor(child)}</Fragment>);
  }
  return children;
}

const markdownComponents: Components = {
  p: ({ children }) => <p>{withCursor(children)}</p>,
  strong: ({ children }) => <strong>{withCursor(children)}</strong>,
  em: ({ children }) => <em>{withCursor(children)}</em>,
  code: ({ children }) => <code>{withCursor(children)}</code>,
  li: ({ children }) => <li>{withCursor(children)}</li>,
  h2: ({ children }) => <h2>{withCursor(children)}</h2>,
  h3: ({ children }) => <h3>{withCursor(children)}</h3>,
  h4: ({ children }) => <h4>{withCursor(children)}</h4>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {withCursor(children)}
    </a>
  ),
};

interface MarkdownProps {
  text: string;
  showCursor?: boolean;
  className?: string;
}

export function Markdown({ text, showCursor = false, className }: MarkdownProps) {
  const source = showCursor ? `${text}${CURSOR_MARKER}` : text;

  return (
    <div className={cn(PROSE_CLASSNAME, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
