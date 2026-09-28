import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import type { Chart as ChartJSInstance, ChartOptions } from "chart.js";
import type { LucideIcon } from "lucide-react";
import { applyChartDefaults } from "@/components/charts/chartSetup";
import {
  formatCompact,
  formatFull,
  formatShortDate,
  formatTooltipTitle,
  niceCeil,
} from "@/components/charts/chartFormat";
import { withAlpha } from "@/components/charts/chartTokens";
import type { ChartTokens } from "@/components/charts/chartTokens";
import { useChartTheme } from "@/hooks/useChartTheme";
import { cn } from "@/lib/utils";

/** Width every y-axis is pinned to, so panels share identical plot insets. */
const Y_AXIS_WIDTH = 48;

export interface TrendPanel {
  /** Doubles as the panel title, so no legend is needed. */
  label: string;
  data: number[];
  /**
   * "negative" / "warning" mark this as a *status* series (e.g. Errors) rather
   * than a categorical one — it takes a reserved tone plus an icon.
   */
  tone?: "neutral" | "negative" | "warning";
  icon?: LucideIcon;
  format?: (n: number) => string;
}

interface StackedTrendChartProps {
  labels: string[];
  /** 2–3 panels. Below ~80px a zero-based area chart has no readable range. */
  panels: TrendPanel[];
  emptyMessage?: string;
}

const PANEL_HEIGHTS: Record<number, number[]> = {
  1: [200],
  2: [148, 148],
  3: [108, 108, 108],
};

function toneColor(tokens: ChartTokens, panel: TrendPanel, index: number): string {
  if (panel.tone === "negative") return tokens.negative;
  if (panel.tone === "warning") return tokens.warning;
  // One series per panel means each can use a strong ink step — that is the
  // whole payoff of splitting a dual-axis chart into panels.
  return index === 0 ? tokens.ink[0] : tokens.ink[1];
}

function StackedTrendChartImpl({ labels, panels, emptyMessage }: Readonly<StackedTrendChartProps>) {
  const { mode, tokens } = useChartTheme();
  const chartRefs = useRef<(ChartJSInstance | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    applyChartDefaults(tokens);
  }, [tokens]);

  // Guard the height lookup: without this a 4th panel silently gets
  // `height: undefined` and collapses to nothing.
  if (import.meta.env.DEV && (panels.length < 1 || panels.length > 3)) {
    throw new Error(
      `StackedTrendChart supports 1-3 panels, got ${panels.length}. Below ~80px a zero-based area chart has no readable range — fold series into "Other" or facet instead.`,
    );
  }
  const heights = PANEL_HEIGHTS[Math.min(Math.max(panels.length, 1), 3)];
  const lastIndex = labels.length - 1;

  const buildOptions = useCallback(
    (panel: TrendPanel, isLast: boolean): ChartOptions<"line"> => {
      const max = Math.max(...panel.data, 0);
      return {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        // The wrapper owns hover, so Chart.js's own interaction is bypassed.
        events: [],
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        layout: { padding: { left: 0, right: 12, top: 8, bottom: 0 } },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              display: isLast,
              color: tokens.tick,
              font: { size: 11, family: tokens.fontSans },
              callback: (_v, i) => formatShortDate(labels[i] ?? ""),
              maxRotation: 0,
              autoSkip: true,
              autoSkipPadding: 20,
            },
          },
          y: {
            beginAtZero: true,
            // Headroom so the peak's direct label isn't clipped.
            max: niceCeil(max * 1.12),
            grid: { color: tokens.grid, lineWidth: 1, drawTicks: false },
            border: { display: false },
            ticks: {
              color: tokens.tick,
              font: { size: 10.5, family: tokens.fontMono },
              maxTicksLimit: 4,
              padding: 8,
              callback: (v) => formatCompact(Number(v)),
            },
            // Pinning the width is what guarantees both panels' plot areas
            // start at the same x. Without it, Chart.js sizes each scale to its
            // own label widths ("612" vs "1.2M") and the shared x-axis breaks.
            afterFit: (scale) => {
              scale.width = Y_AXIS_WIDTH;
            },
          },
        },
      };
    },
    [labels, tokens],
  );

  const datasets = useMemo(
    () =>
      panels.map((panel, i) => {
        const color = toneColor(tokens, panel, i);
        return {
          labels,
          datasets: [
            {
              label: panel.label,
              data: panel.data,
              borderColor: color,
              borderWidth: 1.75,
              pointRadius: 0,
              tension: 0.25,
              fill: true,
              // A real vertical gradient, not the old flat `${color}33`.
              backgroundColor: (ctx: { chart: ChartJSInstance }) => {
                const { chartArea, ctx: c } = ctx.chart;
                if (!chartArea) return "transparent";
                const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                g.addColorStop(0, withAlpha(color, 0.18));
                g.addColorStop(1, withAlpha(color, 0.02));
                return g;
              },
            },
          ],
        };
      }),
    [panels, labels, tokens],
  );

  const indexFromClientX = useCallback(
    (clientX: number): number | null => {
      const chart = chartRefs.current[0];
      const wrapper = wrapperRef.current;
      if (!chart || !wrapper || lastIndex < 1) return null;
      const area = chart.chartArea;
      if (!area) return null;
      const canvasRect = chart.canvas.getBoundingClientRect();
      const x = clientX - canvasRect.left - area.left;
      const step = area.width / lastIndex;
      const i = Math.round(x / step);
      if (i < 0 || i > lastIndex) return null;
      return i;
    },
    [lastIndex],
  );

  // Both panels are pinned to identical insets, so one geometry drives both —
  // which is also why hovering the gap between them still tracks.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    setActiveIndex(indexFromClientX(e.clientX));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (lastIndex < 0) return;
    const cur = activeIndex ?? lastIndex;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex(Math.max(0, cur - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex(Math.min(lastIndex, cur + 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(lastIndex);
    } else if (e.key === "Escape") {
      setActiveIndex(null);
    }
  };

  if (labels.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {emptyMessage ?? "No data for this period yet."}
      </div>
    );
  }

  const readIndex = activeIndex ?? lastIndex;
  const crosshairLeft = (() => {
    const chart = chartRefs.current[0];
    if (!chart?.chartArea || activeIndex === null || lastIndex < 1) return null;
    const area = chart.chartArea;
    return area.left + (area.width / lastIndex) * activeIndex;
  })();

  const announcement = `${formatTooltipTitle(labels[readIndex] ?? "")}: ${panels
    .map((p) => `${(p.format ?? formatFull)(p.data[readIndex] ?? 0)} ${p.label.toLowerCase()}`)
    .join(", ")}`;

  return (
    <div
      ref={wrapperRef}
      className="relative rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      tabIndex={0}
      role="group"
      aria-label={`Trend over ${labels.length} days. Use arrow keys to inspect values.`}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setActiveIndex(null)}
      onKeyDown={onKeyDown}
    >
      {crosshairLeft !== null ? (
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-chart-hairline"
          style={{ left: crosshairLeft }}
          aria-hidden="true"
        />
      ) : null}

      {panels.map((panel, i) => {
        const value = panel.data[readIndex] ?? 0;
        const fmt = panel.format ?? formatFull;
        const Icon = panel.icon;
        const isStatus = panel.tone === "negative" || panel.tone === "warning";
        return (
          <div key={panel.label} className={cn(i > 0 && "mt-2.5 border-t border-border pt-2.5")}>
            <div className="flex items-baseline justify-between gap-3 pl-0.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-2xs font-medium tracking-[0.08em] uppercase",
                  isStatus && panel.tone === "negative" && "text-negative",
                  isStatus && panel.tone === "warning" && "text-warning",
                  !isStatus && "text-muted-foreground",
                )}
              >
                {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
                {panel.label}
              </span>
              <span className="tabular text-sm font-semibold text-foreground">{fmt(value)}</span>
            </div>
            <div style={{ height: heights[i] }}>
              <Line
                ref={(instance) => {
                  chartRefs.current[i] = instance ?? null;
                }}
                data={datasets[i]}
                options={buildOptions(panel, i === panels.length - 1)}
                // Remount on theme change so scales and gradients rebuild.
                key={`${panel.label}-${mode}`}
              />
            </div>
          </div>
        );
      })}

      <div className="sr-only" aria-live="polite">
        {activeIndex !== null ? announcement : ""}
      </div>
    </div>
  );
}

export const StackedTrendChart = memo(StackedTrendChartImpl);
