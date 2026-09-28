import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { SEVERITY_MARKER } from "@/lib/severity";
import type { Recommendation } from "@/types/recommendation";

interface AiRecommendationsPreviewProps {
  recommendations: Recommendation[];
  projectId: string;
}

export function AiRecommendationsPreview({
  recommendations,
  projectId,
}: Readonly<AiRecommendationsPreviewProps>) {
  const navigate = useNavigate();
  const topThree = recommendations.slice(0, 3);
  const highPriorityCount = recommendations.filter((r) => r.priority === "High").length;

  return (
    <SectionCard
      title="AI growth recommendations"
      action={
        <span className="rounded-full bg-muted px-2.5 py-1 text-2xs font-medium text-muted-foreground">
          {highPriorityCount} high priority
        </span>
      }
    >
      <div className="flex flex-col gap-2">
        {topThree.map((reco) => (
          <div key={reco.id} className="flex gap-3 rounded-md border border-border bg-muted px-3.5 py-3">
            <span
              className={`mt-1.5 size-1.5 shrink-0 rounded-full ${SEVERITY_MARKER[reco.priority]}`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm leading-snug font-medium">{reco.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {reco.priority} priority · impact{" "}
                <span className="font-medium text-foreground">{reco.impact}</span> · {reco.effort} effort
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button className="mt-4 w-full" onClick={() => navigate(`/app/${projectId}/competitors`)}>
        <Sparkles className="size-4" />
        View all recommendations
      </Button>
    </SectionCard>
  );
}
