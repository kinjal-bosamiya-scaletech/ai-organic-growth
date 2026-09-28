import { AlertTriangle, CheckCircle2, Copy } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import type { PageAnalysis, PageAnalysisCompetitorComparison } from "@/types/pageAnalysis";

function CopyButton({ text, label }: { text: string; label: string }) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${label} copied to clipboard.`))
      .catch(() => toast.error("Couldn't copy — please copy manually."));
  };
  return (
    <Button size="sm" variant="outline" onClick={handleCopy}>
      <Copy className="size-3.5" />
      Copy
    </Button>
  );
}

function MetaFieldAssessment({
  label,
  current,
  assessment,
  needsChange,
  suggested,
  charCount,
  maxChars,
  copyLabel,
}: {
  label: string;
  current: string | null;
  assessment: string;
  needsChange: boolean;
  suggested: string;
  charCount: number;
  maxChars: number;
  copyLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border p-3.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-2xs font-semibold text-muted-foreground">{label}</span>
        {needsChange ? (
          <span className="rounded-full bg-warning/10 px-2 py-0.5 text-2xs font-medium text-warning">
            Update recommended
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-positive/10 px-2 py-0.5 text-2xs font-medium text-positive">
            <CheckCircle2 className="size-3" />
            Keep as-is
          </span>
        )}
      </div>
      <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{assessment}</p>
      {needsChange ? (
        <>
          {current ? <div className="mb-1.5 font-mono text-sm text-muted-foreground line-through">{current}</div> : null}
          <div className="flex items-center justify-between gap-2">
            <div className="font-mono text-sm">{suggested}</div>
            <CopyButton text={suggested} label={copyLabel} />
          </div>
          <div
            className={`mt-1 text-right text-2xs ${charCount > maxChars ? "font-semibold text-destructive" : "text-muted-foreground"}`}
          >
            {charCount}/{maxChars} chars
          </div>
        </>
      ) : (
        <div className="font-mono text-sm">{current ?? suggested}</div>
      )}
    </div>
  );
}

function CompetitorComparisonSection({ comparison }: { comparison: PageAnalysisCompetitorComparison }) {
  return (
    <div className="border-t border-border pt-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xs font-semibold tracking-wide text-muted-foreground">
          VS {comparison.competitorUrl}
        </span>
      </div>
      <p className="text-sm leading-relaxed">{comparison.gapAnalysis}</p>
      <div className="mt-3 rounded-xl border border-border p-3.5">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-2xs font-semibold text-muted-foreground">UPDATES TO BEAT THIS COMPETITOR</span>
          <CopyButton text={comparison.suggestedUpdates.map((u) => `- ${u}`).join("\n")} label="Suggested updates" />
        </div>
        <ul className="flex flex-col gap-1.5">
          {comparison.suggestedUpdates.map((update) => (
            <li key={update} className="flex gap-2 text-sm leading-relaxed">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/60" />
              {update}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Renders a single page-analysis result (indexed performance/suggestions, or not-indexed fix steps). Shared between the ad-hoc "Analyze any page" tool and the per-row action on the all-pages list. */
export function PageAnalysisResult({ analysis }: { analysis: PageAnalysis }) {
  if (analysis.indexed) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted px-3.5 py-2.5 text-foreground">
          <CheckCircle2 className="size-4 shrink-0" />
          <span className="text-sm font-semibold">This page is indexed by Google.</span>
          {analysis.inspectionResultLink ? (
            <a
              href={analysis.inspectionResultLink}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-xs font-semibold underline underline-offset-2"
            >
              Verify in Search Console →
            </a>
          ) : null}
        </div>
        <p className="-mt-2.5 text-2xs leading-relaxed text-muted-foreground/80">
          This comes straight from Google's URL Inspection tool
          {analysis.lastCrawlTime ? ` (last crawled ${new Date(analysis.lastCrawlTime).toLocaleDateString()})` : ""}
          — it's the authoritative source, more reliable than a manual <code>site:</code> search, which is known to
          under- or over-report indexing status.
        </p>

        {analysis.performance ? (
          <div>
            <div className="mb-2 text-2xs font-semibold tracking-wide text-muted-foreground">
              CURRENT SEARCH PERFORMANCE · LAST 28 DAYS
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="rounded-[10px] bg-muted/60 px-3.5 py-2.5">
                <div className="text-2xs font-semibold text-muted-foreground">CLICKS</div>
                <div className="mt-0.5 font-mono text-base font-semibold">{analysis.performance.clicks}</div>
              </div>
              <div className="rounded-[10px] bg-muted/60 px-3.5 py-2.5">
                <div className="text-2xs font-semibold text-muted-foreground">IMPRESSIONS</div>
                <div className="mt-0.5 font-mono text-base font-semibold">{analysis.performance.impressions}</div>
              </div>
              <div className="rounded-[10px] bg-muted/60 px-3.5 py-2.5">
                <div className="text-2xs font-semibold text-muted-foreground">CTR</div>
                <div className="mt-0.5 font-mono text-base font-semibold">{analysis.performance.ctr}</div>
              </div>
              <div className="rounded-[10px] bg-muted/60 px-3.5 py-2.5">
                <div className="text-2xs font-semibold text-muted-foreground">AVG. POSITION</div>
                <div className="mt-0.5 font-mono text-base font-semibold">{analysis.performance.position}</div>
              </div>
            </div>

            {analysis.performance.topQueries.length > 0 ? (
              <div className="mt-3">
                <div className="mb-1.5 text-2xs font-semibold tracking-wide text-muted-foreground">
                  TOP QUERIES THIS PAGE RANKS FOR
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.performance.topQueries.map((q) => (
                    <span key={q.query} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                      {q.query} · pos {q.position}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {analysis.suggestions ? (
          <div className="border-t border-border pt-4">
            <div className="mb-2 text-2xs font-semibold tracking-wide text-muted-foreground">
              COPY-PASTE IMPROVEMENTS
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-border p-3.5">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-2xs font-semibold text-muted-foreground">FOCUS KEYWORD</span>
                  <div className="flex items-center gap-1.5">
                    {analysis.suggestions.keywordConfidence === "verified_volume" ? (
                      <span className="flex items-center gap-1 rounded-full bg-positive/10 px-2 py-0.5 text-2xs font-medium text-positive">
                        <CheckCircle2 className="size-3" />
                        Verified volume
                      </span>
                    ) : (
                      <span className="rounded-full bg-warning/10 px-2 py-0.5 text-2xs font-medium text-warning">
                        Estimated
                      </span>
                    )}
                    <CopyButton text={analysis.suggestions.focusKeyword} label="Focus keyword" />
                  </div>
                </div>
                <div className="font-mono text-sm">{analysis.suggestions.focusKeyword}</div>
                <p className="mt-1.5 text-xs text-muted-foreground">{analysis.suggestions.keywordVerificationNote}</p>
                {analysis.suggestions.candidateKeywords.length > 1 ? (
                  <div className="mt-2">
                    <div className="mb-1 text-2xs font-semibold text-muted-foreground">OTHER CANDIDATES CONSIDERED</div>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.suggestions.candidateKeywords
                        .filter((k) => k !== analysis.suggestions?.focusKeyword)
                        .map((k) => (
                          <span key={k} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                            {k}
                          </span>
                        ))}
                    </div>
                  </div>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  Set this as the focus keyword in your SEO plugin — the title, description, and content tips below
                  are written to contain it, so plugin keyword checks pass.
                </p>
              </div>
              {analysis.suggestions.complianceNote ? (
                <div className="flex gap-2 rounded-lg border border-warning/25 bg-warning/8 p-3.5 text-xs leading-relaxed text-foreground">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <div className="mb-1 text-2xs font-semibold tracking-wide">REGULATED PRODUCT — COMPLIANCE NOTE</div>
                    {analysis.suggestions.complianceNote}
                  </div>
                </div>
              ) : null}
              <MetaFieldAssessment
                label="META TITLE"
                current={analysis.suggestions.currentMetaTitle}
                assessment={analysis.suggestions.titleAssessment}
                needsChange={analysis.suggestions.titleNeedsChange}
                suggested={analysis.suggestions.metaTitle}
                charCount={analysis.suggestions.metaTitleCharCount}
                maxChars={60}
                copyLabel="Meta title"
              />
              <MetaFieldAssessment
                label="META DESCRIPTION"
                current={analysis.suggestions.currentMetaDescription}
                assessment={analysis.suggestions.descriptionAssessment}
                needsChange={analysis.suggestions.descriptionNeedsChange}
                suggested={analysis.suggestions.metaDescription}
                charCount={analysis.suggestions.metaDescriptionCharCount}
                maxChars={155}
                copyLabel="Meta description"
              />
              {analysis.suggestions.h1Suggestion ? (
                <div className="rounded-xl border border-border p-3.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-2xs font-semibold text-muted-foreground">H1 SUGGESTION</span>
                    <CopyButton text={analysis.suggestions.h1Suggestion} label="H1" />
                  </div>
                  {analysis.suggestions.currentH1 ? (
                    <div className="mb-1.5 font-mono text-sm text-muted-foreground line-through">
                      {analysis.suggestions.currentH1}
                    </div>
                  ) : null}
                  <div className="font-mono text-sm">{analysis.suggestions.h1Suggestion}</div>
                </div>
              ) : null}
              {analysis.suggestions.complianceFlags.length > 0 ? (
                <div className="rounded-xl border border-border p-3.5">
                  <div className="mb-1.5 text-2xs font-semibold text-muted-foreground">
                    FLAG FOR LEGAL/REGULATORY REVIEW
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {analysis.suggestions.complianceFlags.map((flag) => (
                      <li key={flag} className="flex gap-2 text-sm leading-relaxed">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-chart-3" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <div className="mb-1.5 text-2xs font-semibold text-muted-foreground">CONTENT TIPS</div>
                <ul className="flex flex-col gap-1.5">
                  {analysis.suggestions.contentTips.map((tip) => (
                    <li key={tip} className="flex gap-2 text-sm leading-relaxed">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/60" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1.5 text-2xs font-semibold text-muted-foreground">KEYWORD IDEAS</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.suggestions.keywordIdeas.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {analysis.competitorComparison ? <CompetitorComparisonSection comparison={analysis.competitorComparison} /> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {analysis.indexingCheckFailed ? (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-warning/25 bg-warning/8 px-3.5 py-2.5 text-foreground">
          <AlertTriangle className="size-4 shrink-0" />
          <span className="text-sm font-semibold">
            We couldn't verify this page's indexing status with Google.
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 rounded-[10px] bg-destructive/10 px-3.5 py-2.5 text-destructive">
          <AlertTriangle className="size-4 shrink-0" />
          <span className="text-sm font-semibold">This page is not indexed by Google.</span>
          {analysis.inspectionResultLink ? (
            <a
              href={analysis.inspectionResultLink}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-xs font-semibold underline underline-offset-2"
            >
              Verify in Search Console →
            </a>
          ) : null}
        </div>
      )}
      {analysis.indexingExplanation ? (
        <div>
          <div className="mb-1 text-2xs font-semibold tracking-wide text-muted-foreground">
            WHY THIS PAGE ISN'T INDEXED
          </div>
          <p className="text-sm leading-relaxed">{analysis.indexingExplanation}</p>
        </div>
      ) : analysis.indexingReason ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Google's reason: {analysis.indexingReason}
        </p>
      ) : null}

      {analysis.fixSteps && analysis.fixSteps.length > 0 ? (
        <div>
          <div className="mb-1.5 text-2xs font-semibold tracking-wide text-muted-foreground">WHAT TO DO</div>
          <ol className="flex flex-col gap-1.5">
            {analysis.fixSteps.map((step, i) => (
              <li key={step} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-muted text-2xs font-semibold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {analysis.fixSnippet ? (
        <div className="rounded-xl border border-border p-3.5">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-2xs font-semibold text-muted-foreground">
              {analysis.fixSnippetLabel ?? "SUGGESTED FIX"}
            </span>
            <CopyButton text={analysis.fixSnippet} label="Fix snippet" />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs">{analysis.fixSnippet}</pre>
        </div>
      ) : null}

      {analysis.reindexSteps && analysis.reindexSteps.length > 0 ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
          <div className="mb-1.5 text-2xs font-medium tracking-[0.08em] uppercase text-muted-foreground">
            AFTER YOU'VE FIXED IT — HOW TO RESUBMIT WITHOUT GETTING REJECTED AGAIN
          </div>
          <ol className="flex flex-col gap-1.5">
            {analysis.reindexSteps.map((step, i) => (
              <li key={step} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-secondary text-2xs font-medium text-foreground">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-muted-foreground">
          After updating your page with the fix above, go to Search Console → URL Inspection, paste this page's URL,
          and click <b>Request Indexing</b> to ask Google to recrawl it.
        </p>
      )}

      {analysis.competitorComparison ? <CompetitorComparisonSection comparison={analysis.competitorComparison} /> : null}
    </div>
  );
}
