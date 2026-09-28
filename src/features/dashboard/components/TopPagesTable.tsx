import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHANGE_ICON, CHANGE_TEXT, changeTone } from "@/lib/score";
import { cn } from "@/lib/utils";
import type { PageMetric } from "@/types/page";

const COLUMNS = "grid-cols-[1.9fr_1fr_1fr_1fr_1fr_1fr_auto]";

interface TopPagesTableProps {
  pages: PageMetric[];
  onRecommend: (page: string) => void;
}

export function TopPagesTable({ pages, onRecommend }: TopPagesTableProps) {
  return (
    <>
      <div className={cn("grid items-center gap-2 bg-muted px-5 py-2.5 text-2xs font-medium tracking-[0.08em] text-muted-foreground uppercase", COLUMNS)}>
        <div>Page</div>
        <div className="text-right">Clicks</div>
        <div className="text-right">Impr.</div>
        <div className="text-right">CTR</div>
        <div className="text-right">Position</div>
        <div className="text-right">Change</div>
        <div />
      </div>
      {pages.map((page) => {
        const tone = changeTone(page.delta);
        const ChangeIcon = CHANGE_ICON[tone];
        return (
          <div
            key={page.page}
            className={cn("grid items-center gap-2 border-t border-border px-5 py-3 text-sm", COLUMNS)}
          >
            <div className="truncate font-medium">{page.page}</div>
            <div className="tabular text-right font-medium">{page.clicks}</div>
            <div className="tabular text-right text-muted-foreground">{page.impressions}</div>
            <div className="tabular text-right text-muted-foreground">{page.ctr}</div>
            <div className="tabular text-right font-medium">{page.position}</div>
            <div className="text-right">
              <span className={cn("tabular inline-flex items-center justify-end gap-1 font-medium", CHANGE_TEXT[tone])}>
                <ChangeIcon className="size-3" aria-hidden="true" />
                {page.delta}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={() => onRecommend(page.page)}>
              <Sparkles className="size-3.5" />
              Recommend
            </Button>
          </div>
        );
      })}
    </>
  );
}
