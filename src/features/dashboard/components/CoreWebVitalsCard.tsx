import { SectionCard } from "@/components/common/SectionCard";
import { Progress } from "@/components/ui/progress";
import { STATUS_FILL, STATUS_ICON, STATUS_PILL, STATUS_TEXT, scoreStatus } from "@/lib/score";
import type { ScoreStatus } from "@/lib/score";
import type { CwvMetric } from "@/types/seo";

/** Maps the API's status wording onto the shared status vocabulary. */
const CWV_STATUS: Record<CwvMetric["status"], ScoreStatus> = {
  Good: "good",
  "Needs work": "warn",
  Poor: "bad",
};

interface CoreWebVitalsCardProps {
  metrics: CwvMetric[];
  title?: string;
  score?: number | null;
}

export function CoreWebVitalsCard({ metrics, title = "Core Web Vitals", score }: CoreWebVitalsCardProps) {
  return (
    <SectionCard
      title={title}
      action={
        typeof score === "number" ? (
          <span className={`tabular text-lg font-semibold ${STATUS_TEXT[scoreStatus(score)]}`}>{score}</span>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        {metrics.map((metric) => {
          const status = CWV_STATUS[metric.status];
          const StatusIcon = STATUS_ICON[status];
          return (
            <div key={metric.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  {metric.label} — {metric.name}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="tabular font-medium">{metric.value}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium ${STATUS_PILL[status]}`}
                  >
                    <StatusIcon className="size-3" aria-hidden="true" />
                    {metric.status}
                  </span>
                </span>
              </div>
              <Progress value={metric.percent} indicatorClassName={STATUS_FILL[status]} />
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
