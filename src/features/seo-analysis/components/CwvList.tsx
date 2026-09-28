import { SectionCard } from "@/components/common/SectionCard";
import { Progress } from "@/components/ui/progress";
import { STATUS_FILL, STATUS_ICON, STATUS_PILL } from "@/lib/score";
import type { ScoreStatus } from "@/lib/score";
import type { CwvMetric } from "@/types/seo";

/** Maps the API's status wording onto the shared status vocabulary. */
const CWV_STATUS: Record<CwvMetric["status"], ScoreStatus> = {
  Good: "good",
  "Needs work": "warn",
  Poor: "bad",
};

export function CwvList({ metrics }: { metrics: CwvMetric[] }) {
  return (
    <SectionCard title="Core Web Vitals">
      <div className="flex flex-col">
        {metrics.map((metric) => {
          const status = CWV_STATUS[metric.status];
          const StatusIcon = STATUS_ICON[status];
          return (
            <div key={metric.label} className="flex items-center gap-3.5 border-b border-border py-3 last:border-b-0">
              <div className="w-14 shrink-0">
                <div className="tabular text-lg font-semibold">{metric.value}</div>
                <div className="text-2xs font-medium text-muted-foreground">{metric.label}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 text-sm text-muted-foreground">{metric.name}</div>
                <Progress value={metric.percent} indicatorClassName={STATUS_FILL[status]} />
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium ${STATUS_PILL[status]}`}
              >
                <StatusIcon className="size-3" aria-hidden="true" />
                {metric.status}
              </span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
