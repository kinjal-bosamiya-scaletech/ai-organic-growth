import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEVERITY_CHIP, SEVERITY_MARKER } from "@/lib/severity";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApply: (id: string) => void;
  isApplying: boolean;
}

export function RecommendationCard({ recommendation, onApply, isApplying }: RecommendationCardProps) {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("w-1.5 shrink-0", SEVERITY_MARKER[recommendation.priority])} />
      <div className="min-w-0 flex-1 p-5.5">
        <div className="flex flex-wrap items-start justify-between gap-3.5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-0.5 text-2xs font-semibold", SEVERITY_CHIP[recommendation.priority])}>
                {recommendation.priority}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-2xs font-semibold text-muted-foreground">
                {recommendation.category}
              </span>
            </div>
            <div className="text-base leading-snug font-semibold tracking-tight">{recommendation.title}</div>
            <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {recommendation.description}
            </div>
          </div>
          <div className="flex shrink-0 gap-2.5">
            <div className="min-w-[96px] rounded-[10px] bg-muted/60 px-3.5 py-2.5 text-center">
              <div className="text-2xs font-semibold text-muted-foreground">IMPACT</div>
              <div className="mt-0.5 text-base font-semibold text-foreground">{recommendation.impact}</div>
            </div>
            <div className="min-w-[78px] rounded-[10px] bg-muted/60 px-3.5 py-2.5 text-center">
              <div className="text-2xs font-semibold text-muted-foreground">EFFORT</div>
              <div className="mt-0.5 text-base font-semibold">{recommendation.effort}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-3.5">
          <div className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground">RECOMMENDED STEPS</div>
          <div className="flex flex-col gap-2">
            {recommendation.steps.map((step) => (
              <div key={step} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-positive" strokeWidth={2.5} />
                <span className="text-sm leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={() => onApply(recommendation.id)} disabled={isApplying}>
              {isApplying ? "Applying…" : "Apply fix"}
            </Button>
            <Button size="sm" variant="outline">
              View details
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
