import { useState } from "react";
import { cn } from "@/lib/utils";
import { TopKeywordsTable } from "@/features/dashboard/components/TopKeywordsTable";
import { TopPagesTable } from "@/features/dashboard/components/TopPagesTable";
import { PageRecommendationsDialog } from "@/features/dashboard/components/PageRecommendationsDialog";
import { usePageRecommendations } from "@/hooks/queries/usePageRecommendations";
import type { Keyword } from "@/types/keyword";
import type { PageMetric } from "@/types/page";

type ContentTab = "keywords" | "pages";

interface TopContentCardProps {
  projectId: string;
  keywords: Keyword[];
  pages: PageMetric[];
}

export function TopContentCard({ projectId, keywords, pages }: TopContentCardProps) {
  const [tab, setTab] = useState<ContentTab>("keywords");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const recommendMutation = usePageRecommendations(projectId);
  const count = tab === "keywords" ? keywords.length : pages.length;

  const handleRecommend = (page: string) => {
    setSelectedPage(page);
    recommendMutation.mutate(page);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5.5 py-4.5">
        <div className="flex rounded-[10px] bg-muted p-0.5">
          <button
            type="button"
            onClick={() => setTab("keywords")}
            className={cn(
              "rounded-[8px] px-3.5 py-1.5 text-sm font-semibold",
              tab === "keywords" ? "bg-card shadow-sm" : "text-muted-foreground",
            )}
          >
            Top keywords
          </button>
          <button
            type="button"
            onClick={() => setTab("pages")}
            className={cn(
              "rounded-[8px] px-3.5 py-1.5 text-sm font-semibold",
              tab === "pages" ? "bg-card shadow-sm" : "text-muted-foreground",
            )}
          >
            Top pages
          </button>
        </div>
        <span className="text-xs text-muted-foreground">{count} tracked · last 28 days</span>
      </div>
      {tab === "keywords" ? (
        <TopKeywordsTable keywords={keywords} />
      ) : (
        <TopPagesTable pages={pages} onRecommend={handleRecommend} />
      )}

      <PageRecommendationsDialog
        pageUrl={selectedPage}
        recommendations={recommendMutation.data}
        isLoading={recommendMutation.isPending}
        isError={recommendMutation.isError}
        onClose={() => {
          setSelectedPage(null);
          recommendMutation.reset();
        }}
      />
    </div>
  );
}
