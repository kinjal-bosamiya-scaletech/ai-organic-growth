import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { StackedTrendChart } from "@/components/charts/StackedTrendChart";
import { SectionCard } from "@/components/common/SectionCard";
import type { ActivityLog } from "@/types/activity";

interface UsageOverTimeChartProps {
  logs: ActivityLog[];
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10);
}

export function UsageOverTimeChart({ logs }: UsageOverTimeChartProps) {
  const { labels, requestSeries, errorSeries } = useMemo(() => {
    const counts = new Map<string, { requests: number; errors: number }>();
    for (const log of logs) {
      const key = toDateKey(log.createdAt);
      const entry = counts.get(key) ?? { requests: 0, errors: 0 };
      entry.requests += 1;
      if (log.isError) entry.errors += 1;
      counts.set(key, entry);
    }
    const sortedDates = [...counts.keys()].sort();
    return {
      labels: sortedDates,
      requestSeries: sortedDates.map((date) => counts.get(date)!.requests),
      errorSeries: sortedDates.map((date) => counts.get(date)!.errors),
    };
  }, [logs]);

  return (
    <SectionCard title="Requests over time">
      <StackedTrendChart
        labels={labels}
        panels={[
          { label: "Requests", data: requestSeries },
          // Errors is a status series, not a second categorical one, so it
          // takes the reserved negative tone plus an icon.
          { label: "Errors", data: errorSeries, tone: "negative", icon: AlertTriangle },
        ]}
        emptyMessage="Not enough activity yet to chart usage over time."
      />
    </SectionCard>
  );
}
