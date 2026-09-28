import { CHANGE_ICON, CHANGE_TEXT, changeTone } from "@/lib/score";
import { cn } from "@/lib/utils";
import type { Keyword } from "@/types/keyword";

const COLUMNS = "grid-cols-[2.2fr_1fr_1fr_1fr_1fr_1fr]";

export function TopKeywordsTable({ keywords }: { keywords: Keyword[] }) {
  return (
    <>
      <div className={cn("grid gap-2 bg-muted px-5 py-2.5 text-2xs font-medium tracking-[0.08em] text-muted-foreground uppercase", COLUMNS)}>
        <div>Query</div>
        <div className="text-right">Clicks</div>
        <div className="text-right">Impr.</div>
        <div className="text-right">CTR</div>
        <div className="text-right">Position</div>
        <div className="text-right">Change</div>
      </div>
      {keywords.map((keyword) => {
        const tone = changeTone(keyword.delta);
        const ChangeIcon = CHANGE_ICON[tone];
        return (
          <div
            key={keyword.query}
            className={cn("grid items-center gap-2 border-t border-border px-5 py-3 text-sm", COLUMNS)}
          >
            <div className="truncate font-medium">{keyword.query}</div>
            <div className="tabular text-right font-medium">{keyword.clicks}</div>
            <div className="tabular text-right text-muted-foreground">{keyword.impressions}</div>
            <div className="tabular text-right text-muted-foreground">{keyword.ctr}</div>
            <div className="tabular text-right font-medium">{keyword.position}</div>
            <div className="text-right">
              <span className={cn("tabular inline-flex items-center justify-end gap-1 font-medium", CHANGE_TEXT[tone])}>
                <ChangeIcon className="size-3" aria-hidden="true" />
                {keyword.delta}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
