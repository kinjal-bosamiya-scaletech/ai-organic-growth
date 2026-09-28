import { MetricCard } from "@/features/dashboard/components/MetricCard";
import type { DashboardMetric, DashboardTrend } from "@/types/dashboard";

interface MetricsRowProps {
  metrics: DashboardMetric[];
  trend?: DashboardTrend;
}

/** Metrics that have a trend series to draw beneath the figure. */
const SERIES_BY_LABEL: Record<string, keyof Pick<DashboardTrend, "clicksSeries" | "impressionsSeries">> = {
  "Total clicks": "clicksSeries",
  Impressions: "impressionsSeries",
};

/**
 * Metrics where a falling number is an improvement. Search position 12.8 -> 8.2
 * is better, so an increase there must not read as a gain.
 */
const LOWER_IS_BETTER = /position/i;

export function MetricsRow({ metrics, trend }: Readonly<MetricsRowProps>) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const key = SERIES_BY_LABEL[metric.label];
        const series = key && trend ? trend[key] : undefined;
        return (
          <MetricCard
            key={metric.label}
            metric={metric}
            sparklineData={series?.slice(-14)}
            lowerIsBetter={LOWER_IS_BETTER.test(metric.label)}
          />
        );
      })}
    </div>
  );
}
