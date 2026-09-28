import { SectionCard } from "@/components/common/SectionCard";
import { Progress } from "@/components/ui/progress";
import type { SeoBreakdownItem } from "@/types/seo";

export function HealthBreakdownCard({ items }: { items: SeoBreakdownItem[] }) {
  return (
    <SectionCard title="Health breakdown">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-semibold">{item.label}</span>
              <span className="font-semibold">{item.score}/100</span>
            </div>
            <Progress value={item.score} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
