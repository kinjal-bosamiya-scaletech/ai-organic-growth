import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import type { ChartTokens } from "@/components/charts/chartTokens";

// Registered once, only the pieces the app's charts actually use — avoids
// pulling in the full `chart.js/auto` bundle.
//
// Deliberately NOT registered: BarElement, Legend, RadialLinearScale.
// Every bar in this product is a CSS div and stays one; every visible legend is
// hand-rolled JSX (or replaced by direct labels and panel titles); there is no
// radar chart. Don't add BarElement just because a spec says "bars".
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, ArcElement, Title, Tooltip);

let fontsHooked = false;

/**
 * Global defaults, re-applied whenever the theme changes.
 *
 * Options objects always win over defaults, so every chart also receives its
 * tokens explicitly — this is belt and braces for anything not covered.
 */
export function applyChartDefaults(tokens: ChartTokens): void {
  ChartJS.defaults.font.family = tokens.fontSans;
  ChartJS.defaults.font.size = 11;
  ChartJS.defaults.font.weight = 500;
  ChartJS.defaults.color = tokens.tick;
  ChartJS.defaults.responsive = true;
  ChartJS.defaults.maintainAspectRatio = false;

  // Entrance animation stays off: it is noise on a data view. Hover still feels
  // immediate because the crosshair and tooltip are React/CSS, not Chart.js.
  ChartJS.defaults.animation = false;
  if (ChartJS.defaults.transitions?.active?.animation) {
    ChartJS.defaults.transitions.active.animation.duration = 0;
  }

  // `defaults.elements.<name>` likewise only exists once that element is
  // registered, so each branch is checked before writing through it.
  if (ChartJS.defaults.elements?.line) {
    ChartJS.defaults.elements.line.borderWidth = 1.75;
    ChartJS.defaults.elements.line.borderCapStyle = "round";
    ChartJS.defaults.elements.line.tension = 0.25;
  }
  if (ChartJS.defaults.elements?.point) {
    ChartJS.defaults.elements.point.radius = 0;
    ChartJS.defaults.elements.point.hoverRadius = 4.5;
    ChartJS.defaults.elements.point.hitRadius = 12;
  }

  // Chart.js only creates a `defaults.plugins.<name>` branch when that plugin is
  // registered. Legend is deliberately NOT registered above, so this branch is
  // undefined and assigning through it throws. Nothing to disable either — an
  // unregistered plugin cannot render. Guard both rather than assume.
  if (ChartJS.defaults.plugins?.legend) {
    ChartJS.defaults.plugins.legend.display = false;
  }
  if (ChartJS.defaults.plugins?.tooltip) {
    ChartJS.defaults.plugins.tooltip.enabled = false;
  }

  // Chart.js measures text at draw time, so axis ticks get sized in the
  // fallback face before the webfont lands — which silently breaks the pinned
  // scale widths that keep stacked panels aligned. Re-measure once fonts are in.
  if (!fontsHooked && typeof document !== "undefined" && "fonts" in document) {
    fontsHooked = true;
    document.fonts.ready
      .then(() => {
        Object.values(ChartJS.instances).forEach((chart) => chart.update("none"));
      })
      .catch(() => {
        /* font loading is best-effort */
      });
  }
}
