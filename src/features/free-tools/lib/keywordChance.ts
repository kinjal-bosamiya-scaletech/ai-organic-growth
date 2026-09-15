import type { BestKeywordCategory } from "@/types/bestKeywords";

/**
 * Ranking-chance bins.
 *
 * QUANTIZED rather than interpolated: each bin is a fixed, solid fill, so a
 * continuous gradient never has to be reasoned about for contrast.
 *
 * Colours are deliberately distinct hues (green/amber/slate), not a single
 * hue at different lightness steps — that's what makes the three bins tell
 * apart from across the room, not just up close. They're fixed rather than
 * theme-dependent because a solid, opaque fill reads the same regardless of
 * what's behind it. Pastel fills keep the badge list light-touch (a wall of
 * saturated chips reads as alert/error states, not a keyword list), so the
 * ink is a dark shade of the same hue rather than white — still 4.5:1+:
 *   High   #DCFCE7 bg / #166534 ink → 6.5:1
 *   Medium #FEF3C7 bg / #92400E ink → 6.4:1
 *   Low    #F1F5F9 bg / #334155 ink → 9.5:1
 *
 * The thresholds mirror `binOf()` below, so the colour can never contradict
 * the word shown alongside it.
 */
export type ChanceBin = "High" | "Medium" | "Low";

export const CHANCE_BINS: Record<ChanceBin, { bg: string; ink: string; border: string }> = {
  High: { bg: "#DCFCE7", ink: "#166534", border: "#BBF7D0" },
  Medium: { bg: "#FEF3C7", ink: "#92400E", border: "#FDE68A" },
  Low: { bg: "#F1F5F9", ink: "#334155", border: "#E2E8F0" },
};

// Maps a keyword's relative score (0-1) to a rough "chance to rank" percentage.
// This is a heuristic derived from AI-inferred relevance to the page's content —
// not a measured probability from real Google ranking or search-volume data.
export function chancePercent(t: number): number {
  return Math.round(35 + Math.min(1, Math.max(0, t)) * 60);
}

export function binOf(chancePct: number): ChanceBin {
  if (chancePct >= 80) return "High";
  if (chancePct >= 55) return "Medium";
  return "Low";
}

export function volumeRangeOf(categories: BestKeywordCategory[]): { minVolume: number; maxVolume: number } {
  const volumes = categories.flatMap((category) => category.items.map((item) => item.volume));
  return { minVolume: Math.min(...volumes), maxVolume: Math.max(...volumes) };
}
