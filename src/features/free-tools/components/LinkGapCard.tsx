import { useState } from "react";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Callout } from "@/components/common/Callout";
import { SectionCard } from "@/components/common/SectionCard";
import { useLinkGap } from "@/hooks/queries/useLinkGap";

export function LinkGapCard({ projectId }: { projectId: string }) {
  const [yourUrl, setYourUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const linkGapMutation = useLinkGap(projectId);
  const result = linkGapMutation.data;

  const canSubmit = yourUrl.trim().length > 0 && competitorUrl.trim().length > 0;

  const handleCheck = () => {
    if (!canSubmit) return;
    linkGapMutation.mutate({ yourUrl: yourUrl.trim(), competitorUrl: competitorUrl.trim() });
  };

  return (
    <SectionCard title="Link Gap">
      <p className="-mt-2 mb-3.5 text-sm text-muted-foreground">
        Enter your website and a competitor's website to find sites linking to them but not to you —
        ready-made outreach targets for link building.
      </p>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <Input
          value={yourUrl}
          onChange={(e) => setYourUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="https://yoursite.com"
          className="h-9 flex-1"
        />
        <span className="shrink-0 text-xs font-semibold text-muted-foreground sm:px-1">VS</span>
        <Input
          value={competitorUrl}
          onChange={(e) => setCompetitorUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="https://competitor.com"
          className="h-9 flex-1"
        />
      </div>

      <Button
        onClick={handleCheck}
        disabled={linkGapMutation.isPending || !canSubmit}
        size="lg"
        className="mt-3 h-11 self-start px-6 text-base"
      >
        {linkGapMutation.isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Search className="size-5" />
        )}
        Find Link Gaps
      </Button>

      {linkGapMutation.isError ? (
        <p className="mt-4 text-sm text-destructive">Couldn't run the comparison. Try again.</p>
      ) : null}

      {result ? (
        <div className="mt-6">
          {result.isSampleData ? (
            <Callout className="mb-4">
              Sample data — this tool isn't connected to a live backlink index yet, so these numbers
              and domains are illustrative, not real crawl results for the sites you entered. Every
              link below does point to a real, working homepage.
            </Callout>
          ) : null}

          <div className="flex flex-col items-center rounded-xl border border-border bg-muted/30 py-6 text-center">
            <span className="text-4xl font-semibold text-foreground">{result.gapCount}</span>
            <span className="mt-1 text-sm font-semibold text-foreground">Backlink Gaps Found</span>
            <span className="mt-0.5 text-sm text-muted-foreground">
              Sites linking to your competitor but not to you
            </span>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2">Referring domain</th>
                  <th className="px-3 py-2">Domain rating</th>
                  <th className="px-3 py-2">Anchor text</th>
                </tr>
              </thead>
              <tbody>
                {result.backlinks.map((link) => (
                  <tr key={link.sourceUrl} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">
                      <a
                        href={link.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
                      >
                        {link.sourceDomain}
                        <ExternalLink className="size-3 shrink-0" />
                      </a>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{link.domainRating}</td>
                    <td className="px-3 py-2 text-muted-foreground">"{link.anchorText}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Showing {result.backlinks.length} of {result.gapCount} gap opportunities.
          </p>
        </div>
      ) : null}
    </SectionCard>
  );
}
