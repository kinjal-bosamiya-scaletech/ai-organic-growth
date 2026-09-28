import { useState } from "react";
import { MeterBar } from "@/components/charts/MeterBar";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { SCORE_SCALES } from "@/lib/score";
import type { PageAuditResult } from "@/types/pageAudit";

function StatRow({ label, value }: Readonly<{ label: string; value: string | number }>) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular font-medium text-foreground">{value}</span>
    </div>
  );
}

export function ContentTab({ result }: { result: PageAuditResult }) {
  const [densityView, setDensityView] = useState<"oneWord" | "twoWord" | "threeWord">("oneWord");
  const readability = result.readability!;
  const stats = result.stats!;
  const density = result.wordDensity![densityView];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <SectionCard
        title="Readability"
        description={`Flesch reading score of ${readability.fleschScore} is considered ${readability.fleschLabel}.`}
      >
        <div className="mb-4 flex items-baseline gap-2 border-b border-border pb-3">
          <span className="tabular text-2xl font-semibold text-foreground">{readability.fleschScore}%</span>
          <span className="text-xs text-muted-foreground">Flesch reading score</span>
        </div>
        {/* SCORE_SCALES.readability keeps the original 70/40 breakpoints: these
            are content sub-metrics that sit lower by nature, and forcing them
            onto the 90/50 audit scale would turn nearly every bar red. */}
        <div className="flex flex-col gap-2">
          <MeterBar label="Passive voice" value={readability.passiveVoice} scale={SCORE_SCALES.readability} suffix="%" />
          <MeterBar label="Sentence length" value={readability.sentenceLength} scale={SCORE_SCALES.readability} suffix="%" />
          <MeterBar label="Paragraph length" value={readability.paragraphLength} scale={SCORE_SCALES.readability} suffix="%" />
          <MeterBar label="Word complexity" value={readability.wordComplexity} scale={SCORE_SCALES.readability} suffix="%" />
          <MeterBar label="Transition words" value={readability.transitionWords} scale={SCORE_SCALES.readability} suffix="%" />
        </div>
      </SectionCard>

      <SectionCard title="Stats">
        <div className="flex flex-col gap-1.5">
          <StatRow label="Word count" value={stats.wordCount} />
          <StatRow label="Keyword occurrences" value={stats.keywordOccurrences} />
          <StatRow label="Keyword density" value={`${stats.keywordDensity.toFixed(1)}%`} />
          <StatRow label="Images" value={stats.images} />
          <StatRow label="Images with alt text" value={stats.imagesWithAltText} />
          <StatRow label="Links" value={stats.links} />
          <StatRow label="Paragraphs" value={stats.paragraphs} />
          <StatRow label="Sentences" value={stats.sentences} />
          <StatRow label="Transitioned sentences" value={stats.transitionedSentences} />
        </div>
      </SectionCard>

      <SectionCard title="Word density">
        <div className="mb-3 flex gap-1">
          <Button size="sm" variant={densityView === "oneWord" ? "default" : "outline"} onClick={() => setDensityView("oneWord")}>
            1 word
          </Button>
          <Button size="sm" variant={densityView === "twoWord" ? "default" : "outline"} onClick={() => setDensityView("twoWord")}>
            2 words
          </Button>
          <Button size="sm" variant={densityView === "threeWord" ? "default" : "outline"} onClick={() => setDensityView("threeWord")}>
            3 words
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          {density.map((entry) => (
            <div key={entry.word} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{entry.word}</span>
              <span className="text-muted-foreground">
                {entry.count} ({entry.pct}%)
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Headings" className="lg:col-span-3">
        <div className="flex flex-col gap-2">
          {result.headings!.map((heading, index) => (
            <div
              key={`${heading.level}-${index}`}
              className="flex items-center gap-3"
              style={{ paddingLeft: `${(Number(heading.level.slice(1)) - 1) * 12}px` }}
            >
              <span className="w-8 shrink-0 text-2xs font-medium uppercase text-muted-foreground">
                {heading.level}
              </span>
              <span className="flex-1 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-foreground">
                {heading.text}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
