import { cn } from "@/lib/utils"

/**
 * Loading placeholder.
 *
 * `bg-muted` rather than a shimmering gradient: a sweeping highlight across a
 * dashboard full of skeletons is more motion than information. The global
 * prefers-reduced-motion rule stills the pulse for users who ask for that.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
