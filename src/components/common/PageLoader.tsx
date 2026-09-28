import { Loader2 } from "lucide-react";

/**
 * Whole-screen spinner.
 *
 * Reserved for the two places where nothing about the forthcoming layout is
 * known yet — resolving the workspace in `AppLayout`, and the lazy-route
 * Suspense boundary. Data pages use shape-matched skeletons from
 * `components/common/Skeletons` instead.
 */
export function PageLoader({ label = "Loading…" }: Readonly<{ label?: string }>) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground"
    >
      <Loader2 className="size-5 animate-spin text-brand-ink" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
