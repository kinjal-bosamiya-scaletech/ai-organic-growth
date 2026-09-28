import { ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";
import { useCheckPlagiarism } from "@/hooks/queries/useContentGeneration";

interface PlagiarismCardProps {
  projectId: string;
  contentHtml: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function scoreVariant(percentage: number): "secondary" | "outline" | "destructive" {
  if (percentage < 10) return "secondary";
  if (percentage < 25) return "outline";
  return "destructive";
}

export function PlagiarismCard({ projectId, contentHtml }: PlagiarismCardProps) {
  const { mutate, data, isPending, isError, error } = useCheckPlagiarism(projectId);

  return (
    <SectionCard title="Plagiarism Check">
      <p className="mb-3 text-sm text-muted-foreground">
        Free web check — quote-searches a handful of the article's most distinctive sentences on Google to see if
        they turn up verbatim elsewhere. It's a spot-check sample, not an exhaustive full-text scan, but it's real
        web data and costs nothing. Only runs when you click the button below.
      </p>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => mutate(stripHtml(contentHtml))}
        className="gap-1.5"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
        {isPending ? "Checking…" : data ? "Re-check" : "Check Plagiarism"}
      </Button>

      {isError ? (
        <p className="mt-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Couldn't run the plagiarism check."}
        </p>
      ) : null}

      {data ? (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant={scoreVariant(data.plagiarismPercentage)}>
              {data.plagiarismPercentage}% of sampled sentences matched
            </Badge>
            <span className="text-xs text-muted-foreground">
              {data.matchesFound === 0
                ? "No matching sources found across the web."
                : `${data.matchesFound} matching source${data.matchesFound === 1 ? "" : "s"} found, across ${data.wordsChecked} words sampled.`}
            </span>
          </div>

          {data.matches.length > 0 ? (
            <div className="flex flex-col gap-2">
              {data.matches.map((match) => (
                <div key={match.url} className="flex items-start justify-between gap-2 rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{match.title}</p>
                    <p className="text-xs text-muted-foreground">{match.matchedWords} matching words</p>
                  </div>
                  <a
                    href={match.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
                  >
                    View <ExternalLink className="size-3" />
                  </a>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </SectionCard>
  );
}
