/**
 * Bridge between the CSS token layer and Chart.js / canvas, which need literal
 * colour strings and cannot consume `var(--x)`.
 *
 * Before this, every chart hardcoded hex — which is why none of them could
 * follow the theme, and why `--chart-1..5` sat defined-but-unreferenced in
 * index.css. Values are read from computed style so there is exactly one source
 * of truth, and the fallbacks mean a typo'd variable name degrades to a visible
 * colour instead of a silently transparent mark.
 */
export interface ChartTokens {
  /** Ordinal magnitude ramp, darkest → lightest in light mode. */
  ink: [string, string, string, string, string];
  grid: string;
  tick: string;
  band: string;
  hairline: string;
  surface: string;
  brand: string;
  brandInk: string;
  positive: string;
  negative: string;
  warning: string;
  foreground: string;
  mutedForeground: string;
  fontSans: string;
  fontMono: string;
}

export type ThemeMode = "light" | "dark";

const FALLBACK: Record<ThemeMode, ChartTokens> = {
  light: {
    ink: ["#0B8F4C", "#64748B", "#0E9F55", "#94A3B8", "#CBD5E1"],
    grid: "#E2E8F0",
    tick: "#64748B",
    band: "#F1F5F9",
    hairline: "#94A3B8",
    surface: "#FFFFFF",
    brand: "#12D06A",
    brandInk: "#078043",
    positive: "#078043",
    negative: "#DC2626",
    warning: "#B45309",
    foreground: "#0F172A",
    mutedForeground: "#64748B",
    fontSans: "'Inter Variable', system-ui, sans-serif",
    fontMono: "'IBM Plex Mono', ui-monospace, monospace",
  },
  dark: {
    ink: ["#34E084", "#94A3B8", "#12D06A", "#64748B", "#334155"],
    grid: "#1E293B",
    tick: "#94A3B8",
    band: "#1B2436",
    hairline: "#64748B",
    surface: "#131C2E",
    brand: "#12D06A",
    brandInk: "#34E084",
    positive: "#34E084",
    negative: "#F87171",
    warning: "#FBBF24",
    foreground: "#F1F5F9",
    mutedForeground: "#94A3B8",
    fontSans: "'Inter Variable', system-ui, sans-serif",
    fontMono: "'IBM Plex Mono', ui-monospace, monospace",
  },
};

const cache = new Map<ThemeMode, ChartTokens>();

function readVar(style: CSSStyleDeclaration, name: string, fallback: string, mode: ThemeMode): string {
  const value = style.getPropertyValue(name).trim();
  if (value) return value;
  if (import.meta.env.DEV) {
    console.warn(`[chartTokens] --${name.replace(/^--/, "")} resolved empty in ${mode} mode; using fallback.`);
  }
  return fallback;
}

export function readChartTokens(mode: ThemeMode): ChartTokens {
  const cached = cache.get(mode);
  if (cached) return cached;

  const fb = FALLBACK[mode];
  if (typeof window === "undefined") return fb;

  const s = getComputedStyle(document.documentElement);
  const tokens: ChartTokens = {
    ink: [
      readVar(s, "--chart-1", fb.ink[0], mode),
      readVar(s, "--chart-2", fb.ink[1], mode),
      readVar(s, "--chart-3", fb.ink[2], mode),
      readVar(s, "--chart-4", fb.ink[3], mode),
      readVar(s, "--chart-5", fb.ink[4], mode),
    ],
    grid: readVar(s, "--chart-grid", fb.grid, mode),
    tick: readVar(s, "--chart-tick", fb.tick, mode),
    band: readVar(s, "--chart-band", fb.band, mode),
    hairline: readVar(s, "--chart-hairline", fb.hairline, mode),
    surface: readVar(s, "--card", fb.surface, mode),
    brand: readVar(s, "--brand", fb.brand, mode),
    brandInk: readVar(s, "--brand-ink", fb.brandInk, mode),
    positive: readVar(s, "--positive", fb.positive, mode),
    negative: readVar(s, "--negative", fb.negative, mode),
    warning: readVar(s, "--warning", fb.warning, mode),
    foreground: readVar(s, "--foreground", fb.foreground, mode),
    mutedForeground: readVar(s, "--muted-foreground", fb.mutedForeground, mode),
    // Read rather than hardcoded, so a typeface change propagates to charts for
    // free and they can never drift from the surrounding UI.
    fontSans: readVar(s, "--font-sans", fb.fontSans, mode),
    fontMono: readVar(s, "--font-mono", fb.fontMono, mode),
  };

  cache.set(mode, tokens);
  return tokens;
}

/** Clears the memo — called when the theme class changes. */
export function invalidateChartTokens(): void {
  cache.clear();
}

/** Applies an alpha to a hex colour for area fills. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n) || full.length !== 6) return hex;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}
