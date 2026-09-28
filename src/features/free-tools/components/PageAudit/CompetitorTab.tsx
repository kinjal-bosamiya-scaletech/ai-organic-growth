import {
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
  Search,
  XCircle,
} from "lucide-react";
import { useRef } from "react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { Callout } from "@/components/common/Callout";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATUS_TEXT } from "@/lib/score";
import type { useCompetitorAudit } from "@/hooks/queries/usePageAudit";
import {
  buildCompetitorComparisonDoc,
  downloadHtmlAsDoc,
  printElementAsPdf,
} from "@/lib/exportDocument";

/**
 * Two series in one form, so identity cannot come from colour in a monochrome
 * system. "You" is a solid strong step; "Competitor" is a pale step carrying
 * three separate relief channels — a 45° hairline texture, a 1px border that
 * clears 3:1 against the surface, and its printed value. Row labels replace the
 * old coloured-dot legend.
 */
function ComparisonBar({
  label,
  you,
  competitor,
}: Readonly<{
  label: string;
  you: number;
  competitor: number;
}>) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-20 shrink-0 pt-0.5 text-sm text-foreground">{label}</span>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-2xs text-muted-foreground">You</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-chart-grid">
            <div className="h-full rounded-full bg-chart-2" style={{ width: `${you}%` }} />
          </div>
          <span className="tabular w-10 shrink-0 text-right text-xs font-medium text-foreground">{you}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-2xs text-muted-foreground">Competitor</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-chart-grid">
            <div
              className="h-full rounded-full border border-chart-hairline"
              style={{
                width: `${competitor}%`,
                backgroundColor: "var(--chart-4)",
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--chart-hairline) 0 1px, transparent 1px 5px)",
              }}
            />
          </div>
          <span className="tabular w-10 shrink-0 text-right text-xs font-medium text-foreground">
            {competitor}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function CompetitorTab({
  yourUrl,
  competitorUrl,
  onCompetitorUrlChange,
  competitorAudit,
}: {
  yourUrl: string | undefined;
  competitorUrl: string;
  onCompetitorUrlChange: (value: string) => void;
  competitorAudit: ReturnType<typeof useCompetitorAudit>;
}) {
  const comparison = competitorAudit.data;
  const resultsRef = useRef<HTMLDivElement>(null);

  const canSubmit = !!yourUrl && competitorUrl.trim().length > 0;

  const handleAnalyze = () => {
    if (!canSubmit || !yourUrl) return;
    competitorAudit.mutate({
      url: yourUrl,
      competitorUrl: competitorUrl.trim(),
    });
  };

  const handleDownloadPdf = () => {
    if (!resultsRef.current) return;
    printElementAsPdf(resultsRef.current, "Competitor Analysis");
  };

  const handleDownloadDoc = () => {
    if (!comparison) return;
    const namePart = comparison.competitorUrl.replace(/[^a-z0-9]+/gi, "-");
    downloadHtmlAsDoc(
      buildCompetitorComparisonDoc(comparison),
      `competitor-analysis-${namePart}.doc`,
      "Competitor Analysis",
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Analyze and compare a competitor">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm font-semibold text-foreground">
              Page URL
            </label>
            <Input
              value={competitorUrl}
              onChange={(e) => onCompetitorUrlChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="https://competitor.com/their-page/"
              className="h-9"
              disabled={!yourUrl}
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={competitorAudit.isPending || !canSubmit}
            className="h-9"
          >
            {competitorAudit.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Analyze
          </Button>
        </div>
        {!yourUrl ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Run an audit on your own page first.
          </p>
        ) : null}
        {competitorAudit.isError || competitorAudit.isSuccess ? (
          !comparison ? (
            <p className="mt-2 text-xs text-destructive">
              Couldn't read one of the pages — it may be blocking automated
              requests. Try again.
            </p>
          ) : null
        ) : null}
      </SectionCard>

      {comparison ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDoc}
              className="h-9"
            >
              <FileText className="size-4" />
              Download as Word
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              className="h-9"
            >
              <Printer className="size-4" />
              Download PDF
            </Button>
          </div>
          <div
            ref={resultsRef}
            className="grid grid-cols-1 gap-4 bg-background p-1 lg:grid-cols-2"
          >
            <SectionCard title="Competitor SEO score">
              <div className="flex flex-col items-center gap-5">
                <div className="flex items-center gap-8">
                  <ScoreRing score={comparison.yourScore} label="You" />
                  <ScoreRing score={comparison.competitorScore} label="Competitor" />
                </div>
                {/* The coloured-dot legend is gone: each bar row is labelled
                    directly, which is both clearer and monochrome-safe. */}
                <div className="flex w-full flex-col gap-3 border-t border-border pt-4">
                  <ComparisonBar
                    label="Metadata"
                    you={comparison.yourCategoryScores.metadata}
                    competitor={comparison.competitorCategoryScores.metadata}
                  />
                  <ComparisonBar
                    label="Content"
                    you={comparison.yourCategoryScores.content}
                    competitor={comparison.competitorCategoryScores.content}
                  />
                  <ComparisonBar
                    label="Headings"
                    you={comparison.yourCategoryScores.headings}
                    competitor={comparison.competitorCategoryScores.headings}
                  />
                  <ComparisonBar
                    label="Keywords"
                    you={comparison.yourCategoryScores.keywords}
                    competitor={comparison.competitorCategoryScores.keywords}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Ranking potential">
              <div className="flex flex-col gap-4">
                <Callout
                  tone={comparison.gapPct >= 0 ? "positive" : "negative"}
                  title={
                    comparison.gapPct >= 0
                      ? "Your page is in better shape than your competitor's"
                      : "Your page is in worse shape than your competitor's"
                  }
                >
                  <span className="tabular">
                    {comparison.gapPct >= 0 ? "+" : ""}
                    {comparison.gapPct}% gap
                  </span>
                </Callout>

                <div>
                  <p className="mb-2 text-sm font-semibold text-foreground">
                    Keyword Usage
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">Your occurrences:</span>
                    <span className="font-semibold text-foreground">
                      {comparison.yourOccurrences} (
                      {comparison.yourOccurrencesPct}%)
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      Competitor occurrences:
                    </span>
                    <span className="font-semibold text-foreground">
                      {comparison.competitorOccurrences} (
                      {comparison.competitorOccurrencesPct}%)
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-end text-xs text-muted-foreground">
                    You vs Competitor
                  </div>
                  <div className="flex flex-col gap-2">
                    {comparison.checklist.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground">{item.label}</span>
                        <div className="flex items-center gap-6">
                          <span className="w-10 text-center" title={item.you ? "You: yes" : "You: no"}>
                            {item.you ? (
                              <CheckCircle2 className={`inline size-4 ${STATUS_TEXT.good}`} aria-label="You: yes" />
                            ) : (
                              <XCircle className={`inline size-4 ${STATUS_TEXT.bad}`} aria-label="You: no" />
                            )}
                          </span>
                          <span
                            className="w-10 text-center"
                            title={item.competitor ? "Competitor: yes" : "Competitor: no"}
                          >
                            {item.competitor ? (
                              <CheckCircle2
                                className={`inline size-4 ${STATUS_TEXT.good}`}
                                aria-label="Competitor: yes"
                              />
                            ) : (
                              <XCircle className={`inline size-4 ${STATUS_TEXT.bad}`} aria-label="Competitor: no" />
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      ) : (
        <SectionCard title="Competitor">
          <p className="text-sm text-muted-foreground">
            Add a competitor URL above and analyze it to see a side-by-side
            comparison against your page.
          </p>
        </SectionCard>
      )}
    </div>
  );
}
