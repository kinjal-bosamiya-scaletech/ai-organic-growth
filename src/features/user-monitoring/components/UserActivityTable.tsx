import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import type { UserActivitySummary } from "@/types/activity";

interface UserActivityTableProps {
  summaries: UserActivitySummary[];
}

/** Short relative-time label ("just now", "5m ago", "3h ago", "2d ago") with no date library. */
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function UserActivityTable({ summaries }: UserActivityTableProps) {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  if (summaries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No user activity has been recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
            <th className="w-8 px-4 py-3" />
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Requests</th>
            <th className="px-4 py-3">Errors</th>
            <th className="px-4 py-3">Projects touched</th>
            <th className="px-4 py-3">Last active</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((summary) => {
            const isExpanded = expandedUserId === summary.userId;
            return (
              <Fragment key={summary.userId}>
                <tr
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                  onClick={() => setExpandedUserId(isExpanded ? null : summary.userId)}
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">{summary.fullName}</div>
                    <div className="text-xs text-muted-foreground">{summary.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{summary.roleName ?? "—"}</td>
                  <td className="px-4 py-3">{summary.requestCount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={summary.errorCount > 0 ? "font-semibold text-destructive" : "text-muted-foreground"}
                    >
                      {summary.errorCount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">{summary.projectsTouched}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {summary.lastActiveAt ? timeAgo(summary.lastActiveAt) : "—"}
                  </td>
                </tr>
                {isExpanded ? (
                  <tr className="border-b border-border bg-muted/20 last:border-0">
                    <td colSpan={7} className="px-4 py-3">
                      {summary.moduleBreakdown.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No tool usage recorded for this user.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {summary.moduleBreakdown.map((usage) => (
                            <span
                              key={usage.module}
                              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
                            >
                              {usage.module} <span className="text-muted-foreground">×{usage.count}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
