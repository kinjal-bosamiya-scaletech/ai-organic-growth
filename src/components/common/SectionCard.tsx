import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  /** "none" when a child owns its own padding (tables, maps). */
  padding?: "default" | "sm" | "none";
  footer?: ReactNode;
  /** Lifts the card on hover — only for cards that are themselves clickable. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

const PADDING = {
  default: "p-5",
  sm: "p-4",
  none: "",
} as const;

/**
 * The card.
 *
 * One surface recipe for the whole product: white, 12px radius, a single
 * hairline border and no resting shadow. Depth is reserved for things that
 * float (dialogs, popovers, dropdowns) so that a page of cards reads as a flat
 * plane of content rather than a pile of tiles.
 */
export function SectionCard({
  title,
  description,
  action,
  padding = "default",
  footer,
  interactive = false,
  className,
  children,
}: Readonly<SectionCardProps>) {
  const hasHeader = Boolean(title || action);
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        interactive && "transition-all hover:border-border-strong hover:shadow-sm",
        PADDING[padding],
        className,
      )}
    >
      {hasHeader ? (
        <div
          className={cn(
            "flex items-start gap-3",
            description ? "mb-4" : "mb-3.5",
            padding === "none" && "mb-0 border-b border-border p-5",
          )}
        >
          <div className="min-w-0">
            {title ? <h2 className="text-lg font-semibold text-foreground">{title}</h2> : null}
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action ? <div className="ms-auto shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
      {footer ? (
        <div
          className={cn(
            "border-t border-border text-sm text-muted-foreground",
            padding === "none" ? "px-5 py-3.5" : "mt-4 pt-3.5",
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
