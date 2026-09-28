import { memo, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { applyChartDefaults } from "@/components/charts/chartSetup";
import { useChartTheme } from "@/hooks/useChartTheme";

interface SparklineChartProps {
  data: number[];
  height?: number;
}

/**
 * Trend shape inside a KPI tile.
 *
 * Uses ramp step 3 rather than step 1 on purpose: the tile's figure is the
 * headline, and a near-black sparkline competes with it. The `color` prop is
 * gone — callers were passing brand hex.
 *
 * aria-hidden because the trend is already stated numerically in the tile's
 * delta, so this is redundant by design and needs no relief channel.
 */
function SparklineChartImpl({ data, height = 32 }: Readonly<SparklineChartProps>) {
  const { mode, tokens } = useChartTheme();

  useEffect(() => {
    applyChartDefaults(tokens);
  }, [tokens]);

  const chartData = useMemo(
    () => ({
      labels: data.map((_, i) => String(i)),
      datasets: [
        {
          data,
          borderColor: tokens.ink[2],
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.25,
          fill: false,
        },
      ],
    }),
    [data, tokens],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      events: [] as never[],
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      layout: { padding: { top: 2, bottom: 2 } },
    }),
    [],
  );

  return (
    <div style={{ height }} aria-hidden="true">
      <Line data={chartData} options={options} key={mode} />
    </div>
  );
}

export const SparklineChart = memo(SparklineChartImpl);
