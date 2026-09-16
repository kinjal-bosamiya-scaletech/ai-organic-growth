import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  /** One line explaining what the page is for. Shown under the title. */
  description?: string;
  /** Primary (and at most one secondary) action for the page. */
  actions?: ReactNode;
  /** Badges, sync status, counts — sits under the description. */
  meta?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

/**
 * The single page-title block.
 *
 * Before this, page titles were improvised per file — some pages had an inline
 * `<h1 className="text-2xl">`, the eight tool pages went through their own
 * `ToolPageHeader`, and the dashboard had no title at all (only a breadcrumb).
 * One component means the title/description/action rhythm is identical on every
 * route, and the h1 is guaranteed to exist for screen readers.
 */
export function PageHeader({
  title,
  description,
  actions,
  meta,
  icon: Icon,
  className,
}: Readonly<PageHeaderProps>) {
  return (
    <div className={cn("flex flex-wrap items-start gap-x-5 gap-y-3", className)}>
      {Icon ? (
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-soft-border bg-brand-soft text-brand-ink">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      ) : null}

      <div className="min-w-0">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-md text-muted-foreground">{description}</p>
        ) : null}
        {meta ? <div className="mt-2.5 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 md:ms-auto">{actions}</div>
      ) : null}
    </div>
  );
}
