import { SectionCard } from "@/components/common/SectionCard";
import type { SiteAdvice } from "@/types/seo";

export function SolutionsCard({ advice }: { advice: SiteAdvice | null }) {
  if (!advice) {
    return (
      <SectionCard title="Solutions for your current issues">
        <p className="text-sm text-muted-foreground">Not available right now — try refreshing in a moment.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Solutions for your current issues">
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed">{advice.summary}</p>
        <ul className="flex flex-col gap-2">
          {advice.fixes.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm leading-relaxed">
              <span className="text-muted-foreground">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}
