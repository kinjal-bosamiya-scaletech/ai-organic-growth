/**
 * Issue / recommendation severity — High, Medium, Low.
 *
 * This is a **ranked tier**, not a state, so it takes ordinal steps from the
 * grey ramp rather than three status hues. Mapping it onto positive/warning/
 * negative would have put a red-amber-blue triad back into ~23 call sites,
 * which is close to the palette this redesign removes — the product would read
 * monochrome everywhere except its core SEO workflow.
 *
 * The tier name is always rendered beside the marker, so rank is never carried
 * by colour alone. Reserved status colours stay for genuine state: an error, a
 * failed crawl, a destructive action.
 *
 * The one escalation taken: **High alone** wears the reserved negative tone,
 * because a high-severity SEO issue is genuinely an alert and not merely the
 * top of a ranking. Medium and Low stay grey. That is one hue, not three — and
 * every tier still prints its name, so rank never rests on colour.
 *
 * Import these everywhere. Writing the classes inline is what previously let
 * the dashboard preview and the page it links to disagree about the same value.
 */
export type Severity = "High" | "Medium" | "Low";

/** Dot / marker fill. */
export const SEVERITY_MARKER: Record<Severity, string> = {
  High: "bg-negative",
  Medium: "bg-chart-3",
  Low: "bg-chart-4",
};

/** Tinted chip: fill plus matching ink. */
export const SEVERITY_CHIP: Record<Severity, string> = {
  High: "bg-negative/10 text-negative",
  Medium: "bg-secondary text-foreground",
  Low: "bg-muted text-muted-foreground",
};

/** Left-edge rule used by list rows and cards. */
export const SEVERITY_RULE: Record<Severity, string> = SEVERITY_MARKER;

/** Sort helper: High first. */
export const SEVERITY_ORDER: Record<Severity, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};
