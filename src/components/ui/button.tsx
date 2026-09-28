import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // One focus recipe everywhere: ring-2 in the green --ring token, which clears
  // 3:1 against the canvas (3.64), the card (3.75) AND the brand fill (3.05), so
  // no ring-offset plumbing is needed.
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // The brand fill carries dark ink, not white: white on #12D06A is
        // 2.05:1. --primary-foreground is 7.28:1 on it.
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-brand-hover",
        // Secondary brand action — a tinted green that still reads as "ours"
        // without competing with the one primary action on the page.
        soft: "border-brand-soft-border bg-brand-soft text-brand-ink hover:border-brand/40 hover:bg-[color-mix(in_srgb,var(--brand)_16%,var(--card))]",
        // The AI affordance. Deliberately quiet: a brand-tinted surface and
        // green ink, not a gradient pill. Used by "Ask RankyAI", "Explain this
        // issue", "Fix with RankyAI".
        ai: "surface-ai border-brand-soft-border text-brand-ink hover:border-brand/45 hover:bg-[color-mix(in_srgb,var(--brand)_12%,var(--card))]",
        outline:
          "border-border bg-card text-foreground hover:border-border-strong hover:bg-accent aria-expanded:border-border-strong aria-expanded:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)] aria-expanded:bg-secondary",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground",
        destructive:
          "bg-destructive text-negative-foreground shadow-xs hover:bg-destructive/90",
        link: "text-brand-ink underline decoration-brand-ink/30 decoration-1 underline-offset-[3px] hover:decoration-brand-ink",
      },
      size: {
        // 36px default. The old 32px was sized for a 13px type scale; against
        // 14px body it read cramped.
        default:
          "h-9 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-sm px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-4 text-base has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        icon: "size-9",
        "icon-xs":
          "size-7 rounded-sm in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
