import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // 36px to match the default button, so a field and its submit button
        // line up without per-call-site height overrides.
        "h-9 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-1 text-base text-foreground transition-[color,box-shadow,border-color] outline-none",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground/70",
        "hover:border-border-strong",
        // Green focus: the border takes the brand and a soft ring spreads it.
        "focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:hover:border-brand",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:bg-card/60 dark:disabled:bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Input }
