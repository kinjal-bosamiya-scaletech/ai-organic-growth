import { StackedTrendChart } from "@/components/charts/StackedTrendChart";
import { SectionCard } from "@/components/common/SectionCard";
import type { DashboardTrend } from "@/types/dashboard";

interface PerformanceCardProps {
  title: string;
  trend: DashboardTrend;
}

export function PerformanceCard({ title, trend }: Readonly<PerformanceCardProps>) {
  return (
    <SectionCard title={title} description="Last 28 days">
      {/* Clicks and impressions were previously drawn on two independent
          y-axes, which meant their crossings and gaps were artefacts of axis
          choice rather than real relationships. Two panels give each metric an
          honest zero-based scale and its own vertical space.

          The hand-rolled swatch legend is gone: each panel is titled with its
          own metric name and current value, which also removes the drift risk
          between the legend's tokens and the chart's colours. */}
      <StackedTrendChart
        labels={trend.labels}
        panels={[
          { label: "Clicks", data: trend.clicksSeries },
          { label: "Impressions", data: trend.impressionsSeries },
        ]}
      />
    </SectionCard>
  );
}
