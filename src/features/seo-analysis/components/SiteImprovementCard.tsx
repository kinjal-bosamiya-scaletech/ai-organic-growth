import { SectionCard } from "@/components/common/SectionCard";
import type { SiteAdvice } from "@/types/seo";

export function SiteImprovementCard({ advice }: { advice: SiteAdvice | null }) {
  if (!advice) {
    return (
      <SectionCard title="Suggestions to improve your site">
        <p className="text-sm text-muted-foreground">Not available right now — try refreshing in a moment.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Suggestions to improve your site">
      <ul className="flex flex-col gap-2">
        {advice.improvementSuggestions.map((tip) => (
          <li key={tip} className="flex gap-2 text-sm leading-relaxed">
            <span className="text-muted-foreground">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
