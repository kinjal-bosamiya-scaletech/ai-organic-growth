import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_ICON, STATUS_LABEL, scoreStatus, SCORE_SCALES } from "@/lib/score";
import type { ScoreScale, ScoreStatus } from "@/lib/score";
import { cn } from "@/lib/utils";

const VARIANT_BY_STATUS = {
  good: "positive",
  warn: "warning",
  bad: "destructive",
} as const satisfies Record<ScoreStatus, "positive" | "warning" | "destructive">;

interface StatusBadgeProps {
  /** Either pass a resolved status… */
  status?: ScoreStatus;
  /** …or a raw score plus the scale it should be judged against. */
  score?: number;
  scale?: ScoreScale;
  /** Overrides the default "Good / Needs work / Poor" wording. */
  label?: string;
  icon?: LucideIcon;
  className?: string;
}

/**
 * The one status chip.
 *
 * Status is never carried by colour alone — the chip always pairs its tone with
 * the icon from `lib/score` and a text label, which is also what makes it
 * readable in forced-colors mode and to anyone who can't separate the greens
 * from the reds.
 */
export function StatusBadge({
  status,
  score,
  scale = SCORE_SCALES.audit,
  label,
  icon,
  className,
}: Readonly<StatusBadgeProps>) {
  const resolved = status ?? (score === undefined ? "good" : scoreStatus(score, scale));
  const Icon = icon ?? STATUS_ICON[resolved];

  return (
    <Badge variant={VARIANT_BY_STATUS[resolved]} className={cn("gap-1", className)}>
      <Icon aria-hidden="true" />
      {label ?? STATUS_LABEL[resolved]}
    </Badge>
  );
}
