import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CHANGE_ICON, CHANGE_PILL, CHANGE_TEXT, changeDirection, changeMagnitude, changeTone } from "@/lib/score";
import type { ChangeTone } from "@/lib/score";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  change?: string;
  /** Omit to infer from `change`. */
  changeTone?: ChangeTone;
  /** True for metrics like average position, where a falling number is an improvement. */
  lowerIsBetter?: boolean;
  /** One line of context under the figure — "vs. previous 28 days". */
  caption?: string;
  /** Small mark beside the label; use the metric's own icon. */
  icon?: LucideIcon;
  footer?: ReactNode;
  className?: string;
}

/**
 * The KPI card.
 *
 * Reads top-to-bottom as label → figure → movement → context, so a row of them
 * can be scanned down the figures alone. The delta is a tinted pill rather than
 * bare coloured text: at 12px, coloured text next to a 26px figure was losing
 * against it, and the pill also gives the arrow somewhere to sit.
 */
export function StatCard({
  label,
  value,
  change,
  changeTone: toneOverride,
  lowerIsBetter = false,
  caption,
  icon: Icon,
  footer,
  className,
}: Readonly<StatCardProps>) {
  // Tone is whether the change is GOOD; the arrow is which way it MOVED. For
  // average position those differ — the number falling is an improvement.
  const tone = toneOverride ?? (change ? changeTone(change, lowerIsBetter) : "neutral");
  const direction = change ? changeDirection(change) : "neutral";
  const ChangeIcon = CHANGE_ICON[direction];

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {Icon ? (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand-ink">
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
        ) : null}
        <span className="truncate text-sm font-medium text-muted-foreground">{label}</span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-baseline gap-2">
        <span className="tabular text-2xl font-semibold text-foreground">{value}</span>
        {change ? (
          <span
            className={cn(
              "tabular inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-2xs font-semibold",
              CHANGE_PILL[tone],
            )}
          >
            <ChangeIcon className="size-3" aria-hidden="true" />
            {/* The glyph is stripped from the text so the icon doesn't double
                it up as "↑ ▲ 12.4%". */}
            {changeMagnitude(change)}
          </span>
        ) : null}
      </div>

      {caption ? <div className="mt-1.5 text-xs text-muted-foreground">{caption}</div> : null}
      {footer ? <div className="mt-3.5 border-t border-border pt-3.5">{footer}</div> : null}
    </div>
  );
}

/** Re-exported so callers can tint a bare delta consistently with the card. */
export { CHANGE_TEXT };
