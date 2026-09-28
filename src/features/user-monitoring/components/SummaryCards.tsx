import { StatCard } from "@/components/common/StatCard";
import type { ActivityLog, UserActivitySummary } from "@/types/activity";

interface SummaryCardsProps {
  summaries: UserActivitySummary[];
  errors: ActivityLog[];
}

export function SummaryCards({ summaries, errors }: SummaryCardsProps) {
  const totalRequests = summaries.reduce((sum, s) => sum + s.requestCount, 0);
  const totalErrors = summaries.reduce((sum, s) => sum + s.errorCount, 0);
  const activeUsers = summaries.length;
  const errorRate = totalRequests > 0 ? `${((totalErrors / totalRequests) * 100).toFixed(1)}%` : "0%";
  const mostActive = [...summaries].sort((a, b) => b.requestCount - a.requestCount)[0];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Active users" value={activeUsers} />
      <StatCard label="Total requests" value={totalRequests.toLocaleString()} />
      <StatCard
        label="Errors logged"
        value={totalErrors.toLocaleString()}
        change={errors.length > 0 ? `${errorRate} error rate` : undefined}
        changeTone="negative"
      />
      <StatCard
        label="Most active user"
        value={mostActive?.fullName ?? "—"}
        change={mostActive ? `${mostActive.requestCount} requests` : undefined}
        changeTone="neutral"
      />
    </div>
  );
}
