import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { SectionCard } from "@/components/common/SectionCard";
import { usePageAnalysis } from "@/hooks/queries/usePageAnalysis";
import { usePagesStatus } from "@/hooks/queries/usePagesStatus";
import { PageAnalysisResult } from "@/features/seo-analysis/components/PageAnalysisResult";
import { buildPageAnalysisDoc, downloadHtmlAsDoc } from "@/lib/exportDocument";

export function PageAnalyzerCard({ projectId }: { projectId: string }) {
  const [url, setUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [manualHtml, setManualHtml] = useState("");
  const [showManualHtml, setShowManualHtml] = useState(false);
  const analysisMutation = usePageAnalysis(projectId);
  const analysis = analysisMutation.data;
  const { data: pages, isLoading: isPagesLoading } = usePagesStatus(projectId);
  const pageSuggestions = useMemo(() => pages?.map((p) => p.url) ?? [], [pages]);

  const wasBlocked = analysis?.htmlFetchBlocked ?? false;

  const handleAnalyze = () => {
    if (!url.trim()) return;
    analysisMutation.mutate({
      url: url.trim(),
      competitorUrl: competitorUrl.trim() || undefined,
      manualHtml: manualHtml.trim() || undefined,
    });
  };

  const namePart = () =>
    (competitorUrl.trim() || url.trim()).replace(/[^a-z0-9]+/gi, "-");

  const handleDownloadDoc = () => {
    if (!analysis) return;
    downloadHtmlAsDoc(
      buildPageAnalysisDoc(analysis),
      `page-analysis-${namePart()}.doc`,
      "Page Analysis",
    );
  };

  return (
    <SectionCard title="Analyze any page">
      <p className="-mt-2 mb-3.5 text-sm text-muted-foreground">
        Paste a page URL from this property to check its Google indexing status
        and get copy-paste-ready fixes. Optionally add a competitor's page to
        see why it might be outranking yours.
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <AutocompleteInput
            value={url}
            onChange={setUrl}
            onSubmit={handleAnalyze}
            suggestions={pageSuggestions}
            isLoading={isPagesLoading}
            placeholder="https://yoursite.com/some-page or search your saved pages"
            className="h-9 flex-1"
          />
          <span className="shrink-0 text-xs font-semibold text-muted-foreground sm:px-1">
            VS
          </span>
          <Input
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="Optional: competitor's page URL"
            className="h-9 flex-1"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowManualHtml((v) => !v)}
          className="flex w-fit items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          {showManualHtml ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
          Paste page HTML manually (use this if your site blocks our automatic
          check)
        </button>
        {showManualHtml ? (
          <textarea
            value={manualHtml}
            onChange={(e) => setManualHtml(e.target.value)}
            placeholder="View-source the page in your browser, copy the full HTML, and paste it here for an exact diagnosis."
            rows={6}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        ) : null}

        <Button
          onClick={handleAnalyze}
          disabled={analysisMutation.isPending || !url.trim()}
          size="lg"
          className="mt-1 h-11 self-start px-6 text-base"
        >
          {analysisMutation.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Search className="size-5" />
          )}
          Analyze
        </Button>
      </div>

      {analysisMutation.isError ? (
        <p className="mt-4 text-sm text-destructive">
          Couldn't analyze this page. Try again.
        </p>
      ) : null}

      {wasBlocked && !showManualHtml ? (
        <p className="mt-4 text-sm leading-relaxed text-destructive">
          We couldn't read your page's live HTML (likely bot protection blocking
          our request). Use "Paste page HTML manually" above and re-analyze for
          an exact diagnosis.
        </p>
      ) : null}

      {analysis ? (
        <div className="mt-5">
          <div className="mb-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDoc}
              className="h-9"
            >
              <FileText className="size-4" />
              Download Doc
            </Button>
          </div>
          <div className="bg-background p-1">
            <PageAnalysisResult analysis={analysis} />
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}
