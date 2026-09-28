import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import type { ActivityLog } from "@/types/activity";

interface ErrorLogTableProps {
  errors: ActivityLog[];
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ErrorLogTable({ errors }: ErrorLogTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (errors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No errors have been recorded. The platform is running clean.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
            <th className="w-8 px-4 py-3" />
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Endpoint</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Message</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((error) => {
            const isExpanded = expandedId === error.id;
            return (
              <Fragment key={error.id}>
                <tr
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                  onClick={() => setExpandedId(isExpanded ? null : error.id)}
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatTimestamp(error.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {error.userFullName ? (
                      <div>
                        <div className="font-semibold text-foreground">{error.userFullName}</div>
                        <div className="text-xs text-muted-foreground">{error.userEmail}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Anonymous</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {error.method} {error.path}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                      {error.statusCode ?? "—"}
                    </span>
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-3 text-muted-foreground">
                    {error.errorMessage}
                  </td>
                </tr>
                {isExpanded ? (
                  <tr className="border-b border-border bg-muted/20 last:border-0">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground">
                          Project: {error.projectName ?? "—"} · IP: {error.ip ?? "—"}
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-foreground/5 p-3 text-xs whitespace-pre-wrap text-foreground">
                          {error.errorStack ?? error.errorMessage}
                        </pre>
                      </div>
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
