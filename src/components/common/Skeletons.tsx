import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Shape-matched loading placeholders.
 *
 * Every data page previously rendered `<PageLoader/>` — a centred spinner on an
 * otherwise blank screen — which throws away the layout the user is about to
 * get and makes each load feel like a navigation. These mirror the real
 * composition, so the page assembles in place instead of appearing.
 *
 * Each block is `aria-hidden` via Skeleton; the live region announcing "loading"
 * is the caller's job (see `PageSkeleton`).
 */

export function CardSkeleton({ lines = 3, className }: Readonly<{ lines?: number; className?: string }>) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 flex flex-col gap-2.5">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} className={cn("h-3.5", i === lines - 1 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-24" />
      <Skeleton className="mt-2.5 h-3 w-28" />
    </div>
  );
}

export function KpiRowSkeleton({ count = 4 }: Readonly<{ count?: number }>) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <KpiCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChartSkeleton({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-1.5 h-3 w-24" />
      {/* Staggered bar heights read as a chart rather than a grey slab. */}
      <div className="mt-6 flex h-40 items-end gap-1.5">
        {[45, 70, 55, 85, 60, 95, 72, 50, 80, 65, 90, 58, 75, 68].map((h, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
  title = true,
}: Readonly<{ rows?: number; columns?: number; title?: boolean }>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {title ? (
        <div className="border-b border-border px-5 py-4">
          <Skeleton className="h-4 w-36" />
        </div>
      ) : null}
      <div className="bg-muted/60 px-4 py-3">
        <Skeleton className="h-3 w-full max-w-md" />
      </div>
      <div className="flex flex-col">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex items-center gap-4 border-b border-border px-4 py-3.5 last:border-b-0">
            <Skeleton className="h-3.5 flex-[2]" />
            {Array.from({ length: columns - 1 }, (_, c) => (
              <Skeleton key={c} className="h-3.5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PageSkeletonProps {
  /** Announced to assistive tech while the skeleton is up. */
  label?: string;
  children: React.ReactNode;
}

/**
 * Wraps a page's skeleton composition and owns the single live-region
 * announcement, so individual blocks stay silent instead of each announcing.
 */
export function PageSkeleton({ label = "Loading…", children }: Readonly<PageSkeletonProps>) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="flex flex-col gap-5">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
