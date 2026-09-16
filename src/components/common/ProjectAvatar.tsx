import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  letter: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "size-7 text-2xs",
  md: "size-8 text-xs",
  lg: "size-11 text-sm",
} as const;

/**
 * Neutral project mark.
 *
 * `project.color` arrives from the API as saturated hex (the data includes
 * #12A150, #7C3AED, #E0900B and friends) and was applied via inline style, so
 * CSS could not reach it — those would have been the only saturated colour left
 * in the product. The monogram already differentiates projects, so one neutral
 * tone is enough; `grayscale(1)` would have been the wrong tool, mapping those
 * hues to muddy mid-greys at uncontrolled lightness.
 *
 * `project.color` stays in the API contract; the web client just stops
 * rendering it.
 */
export function ProjectAvatar({ letter, size = "md", className }: Readonly<ProjectAvatarProps>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-brand-soft-border bg-brand-soft font-semibold text-brand-ink",
        SIZES[size],
        className,
      )}
    >
      {letter}
    </span>
  );
}
