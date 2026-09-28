import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Minus, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * One status vocabulary for every score, meter, ring and gauge in the product.
 *
 * Before this, threshold logic was duplicated across five files with five
 * different breakpoint sets (90/75, 85/65, 70/40, 90/50, 80/60) and two
 * different colour systems (raw Tailwind palette classes in the PageAudit tabs,
 * semantic tokens in CoreWebVitalsCard).
 *
 * What is unified here is the *mechanism* — one type, one colour mapping, one
 * icon/label set. The *thresholds* stay per-scale on purpose: collapsing them
 * onto a single set would silently change what the product tells users. Under a
 * global 90/50, nearly every ContentTab readability bar turns red and a health
 * score of 80 stops being "Good". Those are product decisions, not refactors.
 */
export type ScoreStatus = "good" | "warn" | "bad";

export interface ScoreScale {
  /** Score at or above this is "good". */
  good: number;
  /** Score at or above this is "warn"; below it is "bad". */
  warn: number;
}

export const SCORE_SCALES = {
  /** Lighthouse-derived. Page/audit scores and Core Web Vitals. */
  audit: { good: 90, warn: 50 },
  /** Readability and content sub-metrics, which sit lower by nature. */
  readability: { good: 70, warn: 40 },
  /** Composite site-health and content-rating scores. */
  health: { good: 80, warn: 60 },
} as const satisfies Record<string, ScoreScale>;

export function scoreStatus(value: number, scale: ScoreScale = SCORE_SCALES.audit): ScoreStatus {
  if (value >= scale.good) return "good";
  if (value >= scale.warn) return "warn";
  return "bad";
}

/**
 * Threshold positions for a scale, so gauge and ring notches are derived rather
 * than hardcoded and cannot drift when a scale changes.
 */
export function statusNotches(scale: ScoreScale = SCORE_SCALES.audit): number[] {
  return [scale.warn, scale.good];
}

/** Text-only tone. */
export const STATUS_TEXT: Record<ScoreStatus, string> = {
  good: "text-positive",
  warn: "text-warning",
  bad: "text-negative",
};

/** Tinted pill: subtle fill plus matching ink. */
export const STATUS_PILL: Record<ScoreStatus, string> = {
  good: "bg-positive/10 text-positive",
  warn: "bg-warning/10 text-warning",
  bad: "bg-negative/10 text-negative",
};

/** Solid fill, for meter indicators and bars. */
export const STATUS_FILL: Record<ScoreStatus, string> = {
  good: "bg-positive",
  warn: "bg-warning",
  bad: "bg-negative",
};

/**
 * Status is never carried by colour alone — every status surface pairs the tone
 * with this icon and its label.
 */
export const STATUS_ICON: Record<ScoreStatus, LucideIcon> = {
  good: CheckCircle2,
  warn: AlertTriangle,
  bad: XCircle,
};

export const STATUS_LABEL: Record<ScoreStatus, string> = {
  good: "Good",
  warn: "Needs work",
  bad: "Poor",
};

/* ------------------------------------------------------------------ *
 * Direction of change (deltas), which is a separate axis from score.
 * ------------------------------------------------------------------ */

export type ChangeTone = "positive" | "negative" | "neutral";

export const CHANGE_TEXT: Record<ChangeTone, string> = {
  positive: "text-positive",
  negative: "text-negative",
  neutral: "text-muted-foreground",
};

export const CHANGE_PILL: Record<ChangeTone, string> = {
  positive: "bg-positive/10 text-positive",
  negative: "bg-negative/10 text-negative",
  neutral: "bg-muted text-muted-foreground",
};

/** Direction glyphs the API/mock data uses in delta strings. */
const UP_GLYPHS = /[▲↑+]/;
const DOWN_GLYPHS = /[▼↓−-]/;

/**
 * Strips the direction glyph from a delta string so the arrow icon isn't
 * rendered twice ("↑ ▲ 12.4%").
 */
export function changeMagnitude(delta: string): string {
  return delta.replace(/^\s*[▲▼↑↓+\-−]\s*/, "").trim();
}

/**
 * Infers direction from a delta such as "▲ 12.4%", "-3.1%" or 0.
 *
 * Two traps this closes. Callers used to default to "positive", so an
 * unlabelled negative delta rendered as a gain. And the data uses ▲/▼ rather
 * than +/-, so parsing only the numeric sign would have read every delta as an
 * increase.
 *
 * `lowerIsBetter` separates *direction* from *goodness*: average search
 * position improving means the number goes DOWN, so an increase there is bad.
 */
export function changeTone(delta: string | number, lowerIsBetter = false): ChangeTone {
  let rose: boolean | null = null;

  if (typeof delta === "number") {
    if (delta === 0) return "neutral";
    rose = delta > 0;
  } else {
    if (UP_GLYPHS.test(delta)) rose = true;
    else if (DOWN_GLYPHS.test(delta)) rose = false;
    else {
      const value = Number.parseFloat(delta.replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(value) || value === 0) return "neutral";
      rose = true;
    }
  }

  if (rose === null) return "neutral";
  const good = lowerIsBetter ? !rose : rose;
  return good ? "positive" : "negative";
}

/** Direction the value moved, independent of whether that is good. */
export function changeDirection(delta: string | number): ChangeTone {
  if (typeof delta === "number") return delta === 0 ? "neutral" : delta > 0 ? "positive" : "negative";
  if (UP_GLYPHS.test(delta)) return "positive";
  if (DOWN_GLYPHS.test(delta)) return "negative";
  return "neutral";
}

/** Arrow that carries direction without relying on colour. */
export const CHANGE_ICON: Record<ChangeTone, LucideIcon> = {
  positive: ArrowUp,
  negative: ArrowDown,
  neutral: Minus,
};
