/** Parses a "YYYY-MM-DD" label into a Date, or null if it isn't a real date. */
export function parseIsoDate(label: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) return null;
  const date = new Date(`${label}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * "Jan 5". Upgraded from "M/D/YY": on a 28-day window the year is redundant,
 * and a slashed numeric date is the most generic axis label there is.
 */
export function formatShortDate(label: string): string {
  const date = parseIsoDate(label);
  if (!date) return label;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** "Monday, Jan 5" — tooltip title. */
export function formatTooltipTitle(label: string): string {
  const date = parseIsoDate(label);
  if (!date) return label;
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

/**
 * "45K", "1.2M", "840" — axis ticks.
 *
 * This is load-bearing, not cosmetic: two stacked panels only stay aligned if
 * their y-axis labels render at comparable widths. `toLocaleString()` would
 * give "1,284,002" against "612", and the wider label pushes that panel's plot
 * area further right.
 */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${trim(value / 1_000_000)}M`;
  if (abs >= 1_000) return `${trim(value / 1_000)}K`;
  return String(Math.round(value));
}

function trim(n: number): string {
  // One decimal only when it adds information: 1.2M, but 45K not 45.0K.
  return n >= 10 || Number.isInteger(n) ? String(Math.round(n)) : n.toFixed(1);
}

/** "45,132" — tooltips and direct labels, where precision matters. */
export function formatFull(value: number): string {
  return value.toLocaleString("en-US");
}

/** Rounds up to a clean axis maximum, leaving headroom for a peak label. */
export function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / mag) * mag;
}
