import { SCORE_SCALES, STATUS_ICON, STATUS_LABEL, STATUS_TEXT, scoreStatus, statusNotches } from "@/lib/score";
import type { ScoreScale } from "@/lib/score";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  label?: string;
  scale?: ScoreScale;
  className?: string;
}

/**
 * Radial score readout. Consolidates two near-identical implementations that
 * lived in OverviewTab and CompetitorTab with different thresholds.
 *
 * The arc encodes magnitude, so it is monochrome — sweep length already carries
 * the value. Status is stated beneath as tone + icon + word, never by arc
 * colour alone. Ring is 12px rather than the old 32px: thin marks read as
 * deliberate.
 */
export function ScoreRing({ score, label = "Overall", scale = SCORE_SCALES.audit, className }: Readonly<ScoreRingProps>) {
  const status = scoreStatus(score, scale);
  const StatusIcon = STATUS_ICON[status];
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div className={cn("flex flex-col items-center gap-2.5", className)}>
      <div
        className="relative flex size-36 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(var(--chart-1) ${clamped * 3.6}deg, var(--chart-grid) 0deg)`,
        }}
        role="img"
        aria-label={`${label}: ${score} out of 100 — ${STATUS_LABEL[status]}`}
      >
        {/* Threshold notches, derived from the scale so they can't drift. */}
        {statusNotches(scale).map((n) => (
          <span
            key={n}
            className="pointer-events-none absolute inset-0 flex justify-center"
            style={{ transform: `rotate(${n * 3.6}deg)` }}
            aria-hidden="true"
          >
            <span className="h-3 w-px" style={{ background: "var(--chart-tick)" }} />
          </span>
        ))}
        <div className="flex size-[7.5rem] flex-col items-center justify-center rounded-full bg-card">
          <span className="tabular text-2xl font-semibold text-foreground">{score}%</span>
          <span className="text-2xs text-muted-foreground">{label}</span>
        </div>
      </div>
      <span
        className={`inline-flex items-center gap-1 text-2xs font-medium tracking-[0.08em] uppercase ${STATUS_TEXT[status]}`}
      >
        <StatusIcon className="size-3" aria-hidden="true" />
        {STATUS_LABEL[status]}
      </span>
    </div>
  );
}
