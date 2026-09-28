import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeChoice } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

/**
 * A three-state segmented control rather than a cycling icon button: cycling
 * hides which state you're in and makes "system" undiscoverable.
 */
export function ThemeToggle({ className }: Readonly<{ className?: string }>) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={cn("inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5", className)}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={cn(
              "flex size-6 cursor-pointer items-center justify-center rounded-sm transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring",
              active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
