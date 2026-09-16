import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Primary action. Give people the one thing that fills this screen. */
  action?: ReactNode;
  /** Secondary link/button beside the action. */
  secondaryAction?: ReactNode;
  /** "card" sits inside an existing card; "standalone" is the page-level block. */
  variant?: "standalone" | "card";
  className?: string;
}

/**
 * The empty state.
 *
 * Never a bare "No data" line: it names what is missing, says what the user
 * gets once it exists, and offers the action that produces it. The icon sits in
 * a brand-tinted medallion so an empty screen still looks like the product.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "standalone",
  className,
}: Readonly<EmptyStateProps>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 text-center",
        variant === "standalone"
          ? "rounded-xl border border-dashed border-border bg-card py-14"
          : "py-12",
        className,
      )}
    >
      {Icon ? (
        <span className="flex size-12 items-center justify-center rounded-2xl border border-brand-soft-border bg-brand-soft text-brand-ink">
          <Icon className="size-5.5" aria-hidden="true" />
        </span>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action || secondaryAction ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
