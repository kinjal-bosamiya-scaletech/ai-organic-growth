import { SCORE_SCALES, STATUS_FILL, STATUS_ICON, STATUS_LABEL, scoreStatus } from "@/lib/score";
import type { ScoreScale } from "@/lib/score";
import { cn } from "@/lib/utils";

interface MeterBarProps {
  label: string;
  value: number;
  scale?: ScoreScale;
  /** Tint the fill and show a status word — only where this genuinely is a status readout. */
  showStatus?: boolean;
  suffix?: string;
  className?: string;
}

/**
 * Labelled horizontal meter. Consolidates OverviewTab's CategoryBar and
 * ContentTab's MetricBar, which used different thresholds and different colour
 * systems for the same job.
 *
 * The fill is monochrome by default because bar length already encodes
 * magnitude — colouring it would spend the status channel re-stating what
 * length shows. The value is always printed, which is also the relief channel
 * that keeps the bar readable without relying on fill contrast.
 */
export function MeterBar({
  label,
  value,
  scale = SCORE_SCALES.audit,
  showStatus = false,
  suffix = "",
  className,
}: Readonly<MeterBarProps>) {
  const status = scoreStatus(value, scale);
  const StatusIcon = STATUS_ICON[status];
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="w-24 shrink-0 text-sm text-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-chart-grid">
        <div
          className={cn("h-full rounded-full", showStatus ? STATUS_FILL[status] : "bg-chart-2")}
          style={{ width: `${width}%` }}
        />
      </div>
      {showStatus ? (
        <span className="inline-flex w-24 shrink-0 items-center justify-end gap-1 text-2xs text-muted-foreground">
          <StatusIcon className="size-3" aria-hidden="true" />
          {STATUS_LABEL[status]}
        </span>
      ) : null}
      <span className="tabular w-12 shrink-0 text-right text-sm font-medium text-foreground">
        {Math.round(value)}
        {suffix}
      </span>
    </div>
  );
}
