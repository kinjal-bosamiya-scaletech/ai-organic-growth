import { StatCard } from "@/components/common/StatCard";
import { SparklineChart } from "@/components/charts/SparklineChart";
import type { DashboardMetric } from "@/types/dashboard";

interface MetricCardProps {
  metric: DashboardMetric;
  sparklineData?: number[];
  lowerIsBetter?: boolean;
}

export function MetricCard({ metric, sparklineData, lowerIsBetter }: Readonly<MetricCardProps>) {
  return (
    <StatCard
      label={metric.label}
      value={metric.value}
      change={metric.change}
      lowerIsBetter={lowerIsBetter}
      footer={sparklineData ? <SparklineChart data={sparklineData} /> : undefined}
    />
  );
}
