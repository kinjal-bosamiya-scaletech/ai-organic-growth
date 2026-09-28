import { MeterBar } from "@/components/charts/MeterBar";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { SectionCard } from "@/components/common/SectionCard";
import { STATUS_ICON, STATUS_TEXT } from "@/lib/score";
import type { PageAuditResult } from "@/types/pageAudit";

export function OverviewTab({ result }: Readonly<{ result: PageAuditResult }>) {
  const scores = result.categoryScores!;
  const keyword = result.keywordPerformance!;

  const checks = [
    { label: "Keyword in meta title", ok: keyword.inMetaTitle },
    { label: "Keyword in meta description", ok: keyword.inMetaDescription },
    { label: "Keyword in H1 heading", ok: keyword.inH1 },
  ];

  const OkIcon = STATUS_ICON.good;
  const WarnIcon = STATUS_ICON.warn;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <SectionCard title="SEO score">
        <div className="flex flex-col items-center gap-4">
          <ScoreRing score={result.seoScore!} />
          <div className="flex w-full flex-col gap-2 border-t border-border pt-4">
            <MeterBar label="Metadata" value={scores.metadata} />
            <MeterBar label="Content" value={scores.content} />
            <MeterBar label="Headings" value={scores.headings} />
            <MeterBar label="Keywords" value={scores.keywords} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Keyword performance" description={`Given keyword: "${keyword.keyword}"`}>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Keyword density</span>
          <span
            className={`tabular inline-flex items-center gap-1 font-medium ${
              keyword.densityStatus === "too_high" ? STATUS_TEXT.bad : "text-foreground"
            }`}
          >
            {keyword.densityStatus === "too_high" ? <WarnIcon className="size-3" aria-hidden="true" /> : null}
            {keyword.density.toFixed(1)}%{keyword.densityStatus === "too_high" ? " (too high)" : ""}
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-2.5 border-t border-border pt-3">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{check.label}</span>
              <span
                className={`inline-flex items-center gap-1 text-2xs font-medium ${
                  check.ok ? STATUS_TEXT.good : STATUS_TEXT.warn
                }`}
              >
                {check.ok ? (
                  <OkIcon className="size-3.5" aria-hidden="true" />
                ) : (
                  <WarnIcon className="size-3.5" aria-hidden="true" />
                )}
                {check.ok ? "Yes" : "No"}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Keyword occurrences</span>
            <span className="tabular font-medium text-foreground">{keyword.occurrences}</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Recommendations">
        <div className="flex flex-col gap-3">
          {result.recommendations!.map((rec) => (
            <div key={rec.title} className="flex items-start gap-2.5">
              <WarnIcon className={`mt-0.5 size-4 shrink-0 ${STATUS_TEXT.warn}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{rec.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
