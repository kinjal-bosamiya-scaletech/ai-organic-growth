import { memo, useEffect, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { applyChartDefaults } from "@/components/charts/chartSetup";
import { useChartTheme } from "@/hooks/useChartTheme";
import { SCORE_SCALES, STATUS_ICON, STATUS_LABEL, STATUS_TEXT, scoreStatus, statusNotches } from "@/lib/score";
import type { ScoreScale } from "@/lib/score";

interface GaugeChartProps {
  score: number;
  scale?: ScoreScale;
  size?: number;
}

/**
 * Semicircle gauge: a 2-segment doughnut rotated to sweep 180°.
 *
 * The arc is monochrome — it encodes magnitude, and length already carries
 * that. Status lives in the label beneath, as tone + icon + word, so the
 * reading never depends on colour. Threshold notches are derived from the
 * scale rather than hardcoded, so they cannot drift from the bands.
 *
 * The old `color` / `trackColor` / `dark` props are gone: theme now comes from
 * the token layer.
 */
function GaugeChartImpl({ score, scale = SCORE_SCALES.audit, size = 208 }: Readonly<GaugeChartProps>) {
  const { mode, tokens } = useChartTheme();

  useEffect(() => {
    applyChartDefaults(tokens);
  }, [tokens]);

  const status = scoreStatus(score, scale);
  const StatusIcon = STATUS_ICON[status];
  const clamped = Math.max(0, Math.min(100, score));

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          data: [clamped, 100 - clamped],
          backgroundColor: [tokens.ink[0], tokens.grid],
          // 2px surface gap between the value arc and the track.
          borderColor: tokens.surface,
          borderWidth: 2,
        },
      ],
    }),
    [clamped, tokens],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      circumference: 180,
      rotation: 270,
      // Thinner than the old 78% — thin marks read as considered.
      cutout: "84%",
      events: [] as never[],
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    }),
    [],
  );

  const notches = statusNotches(scale);

  return (
    <div
      className="relative"
      style={{ width: size, height: size / 2 + 24 }}
      role="img"
      aria-label={`Score ${score} out of 100 — ${STATUS_LABEL[status]}`}
    >
      <div style={{ width: size, height: size / 2 }}>
        <Doughnut data={chartData} options={options} key={mode} />
      </div>

      {/* Threshold notches, derived from the scale. A 1px tick in the tick
          token clears 3:1 against the track (3.81 light / 5.68 dark). */}
      {notches.map((n) => {
        const angle = -90 + (n / 100) * 180;
        return (
          <div
            key={n}
            className="pointer-events-none absolute left-1/2 origin-bottom"
            style={{
              bottom: 24,
              height: size / 2 - 4,
              transform: `translateX(-50%) rotate(${angle}deg)`,
            }}
            aria-hidden="true"
          >
            <span
              className="block w-px"
              style={{ height: 7, background: tokens.tick }}
            />
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="tabular text-4xl leading-none font-semibold tracking-tight text-foreground">{score}</div>
        <div
          className={`mt-1.5 inline-flex items-center gap-1 text-2xs font-medium tracking-[0.08em] uppercase ${STATUS_TEXT[status]}`}
        >
          <StatusIcon className="size-3" aria-hidden="true" />
          {STATUS_LABEL[status]}
        </div>
      </div>
    </div>
  );
}

export const GaugeChart = memo(GaugeChartImpl);
