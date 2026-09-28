import { useState } from "react";
import axios from "axios";
import { CheckCircle2, Loader2, RefreshCw, TrendingDown, TrendingUp, XCircle } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagesStatus } from "@/hooks/queries/usePagesStatus";
import { useSyncPages } from "@/hooks/queries/useSyncPages";
import { usePageAnalysis } from "@/hooks/queries/usePageAnalysis";
import { PageAnalysisResult } from "@/features/seo-analysis/components/PageAnalysisResult";
import type { PageStatus } from "@/types/pages";

function RankCell({ page }: { page: PageStatus }) {
  if (page.rank === null) {
    return <span className="text-muted-foreground/60">—</span>;
  }
  return (
    <span className="tabular inline-flex items-center gap-1">
      #{page.rank}
      {page.rankDelta !== null && page.rankDelta !== 0 ? (
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-medium ${page.rankDelta > 0 ? "text-positive" : "text-negative"}`}
        >
          {page.rankDelta > 0 ? (
            <TrendingUp className="size-3" aria-hidden="true" />
          ) : (
            <TrendingDown className="size-3" aria-hidden="true" />
          )}
          {Math.abs(page.rankDelta)}
        </span>
      ) : null}
    </span>
  );
}

type PageFilter = "all" | "indexed" | "not-indexed";

function getSyncErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return "Couldn't sync pages: connect this project to Google Search Console first.";
    }
    if (error.response?.status === 409) {
      return "Couldn't sync pages: your Google Search Console connection has expired. Reconnect and try again.";
    }
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return `Couldn't sync pages: ${message}`;
  }
  return "Couldn't sync pages. Please try again.";
}

function formatLastSynced(pages: PageStatus[] | undefined): string | null {
  if (!pages || pages.length === 0) return null;
  const timestamps = pages.map((page) => page.lastCheckedAt).filter((value): value is string => Boolean(value));
  if (timestamps.length === 0) return null;
  const latest = timestamps.reduce((max, current) => (current > max ? current : max));
  return new Date(latest).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AllPagesCard({ projectId }: { projectId: string }) {
  const { data: pages, isLoading } = usePagesStatus(projectId);
  const syncMutation = useSyncPages(projectId);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const analysisMutation = usePageAnalysis(projectId);
  const [filter, setFilter] = useState<PageFilter>("all");

  function openPage(url: string) {
    setActiveUrl(url);
    analysisMutation.mutate({ url });
  }

  const indexedCount = pages?.filter((page) => page.indexed).length ?? 0;
  const notIndexedCount = pages?.filter((page) => !page.indexed).length ?? 0;
  const filteredPages = pages?.filter((page) => {
    if (filter === "indexed") return page.indexed;
    if (filter === "not-indexed") return !page.indexed;
    return true;
  });
  const lastSynced = formatLastSynced(pages);

  return (
    <>
      <SectionCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          {pages && pages.length > 0 ? (
            <Tabs value={filter} onValueChange={(value) => setFilter(value as PageFilter)}>
              <TabsList variant="line">
                <TabsTrigger value="all">All ({pages.length})</TabsTrigger>
                <TabsTrigger value="indexed">Indexed ({indexedCount})</TabsTrigger>
                <TabsTrigger value="not-indexed">Not Indexed ({notIndexedCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            {lastSynced ? <span className="text-xs text-muted-foreground">Last synced {lastSynced}</span> : null}
            <Button size="sm" variant="outline" onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending}>
              {syncMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
              Sync pages
            </Button>
          </div>
        </div>
        {syncMutation.isError ? (
          <p className="py-2 text-center text-sm text-destructive">
            {getSyncErrorMessage(syncMutation.error)}
          </p>
        ) : null}
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading pages…</p>
        ) : !pages || pages.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No pages saved yet. Click "Sync pages" to pull every page from your sitemap and Search Console.
          </p>
        ) : (
          <>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border text-left text-2xs font-semibold text-muted-foreground">
                  <th className="pb-2 pr-3">Page</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Rank</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {filteredPages?.map((page) => (
                  <tr key={page.url} className="border-b border-border/60 last:border-0">
                    <td className="max-w-[320px] truncate py-2 pr-3" title={page.url}>
                      {page.url}
                    </td>
                    <td className="py-2 pr-3">
                      {page.indexed ? (
                        <span className="inline-flex items-center gap-1 text-positive">
                          <CheckCircle2 className="size-3.5" />
                          Indexed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-destructive">
                          <XCircle className="size-3.5" />
                          Not indexed
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <RankCell page={page} />
                    </td>
                    <td className="py-2 text-right">
                      <Button size="sm" variant="outline" onClick={() => openPage(page.url)}>
                        {page.indexed ? "View suggestions" : "View fix"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </SectionCard>

      <Dialog open={activeUrl !== null} onOpenChange={(open) => !open && setActiveUrl(null)}>
        <DialogContent className="max-w-[720px] sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle className="truncate text-md">{activeUrl}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            {analysisMutation.isPending ? (
              <div className="flex flex-col items-center gap-3 py-14 text-muted-foreground">
                <Loader2 className="size-7 animate-spin" />
                <span className="text-sm">Checking this page…</span>
              </div>
            ) : analysisMutation.isError ? (
              <p className="py-10 text-center text-sm text-destructive">Couldn't analyze this page. Try again.</p>
            ) : analysisMutation.data ? (
              <PageAnalysisResult analysis={analysisMutation.data} />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
