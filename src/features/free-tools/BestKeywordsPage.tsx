import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { SectionCard } from "@/components/common/SectionCard";
import { ToolPageHeader } from "@/features/free-tools/components/ToolPageHeader";
import { KeywordBadgeList } from "@/features/free-tools/components/KeywordBadgeList";
import { useBestKeywords } from "@/hooks/queries/useBestKeywords";
import { usePagesStatus } from "@/hooks/queries/usePagesStatus";
import { useActiveProject } from "@/hooks/useActiveProject";

// Accepts a bare domain ("example.com"), a "www." host, or a full URL with
// scheme/path/query — anything that resolves to a real-looking hostname with a TLD.
const HOSTNAME_PATTERN = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

function isValidWebsiteUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return HOSTNAME_PATTERN.test(url.hostname);
  } catch {
    return false;
  }
}

export function BestKeywordsPage() {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const keywordsMutation = useBestKeywords();
  const result = keywordsMutation.data;
  const project = useActiveProject();
  const { data: pages, isLoading: isPagesLoading } = usePagesStatus(project.id);
  const pageSuggestions = useMemo(() => pages?.map((p) => p.url) ?? [], [pages]);

  const isValid = useMemo(() => isValidWebsiteUrl(url), [url]);
  const showValidationError = touched && url.trim().length > 0 && !isValid;
  const canSubmit = isValid && !keywordsMutation.isPending;

  const handleSubmit = () => {
    setTouched(true);
    if (!canSubmit) return;
    keywordsMutation.mutate(url.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      <ToolPageHeader
        title="Your Best Keywords"
        description="Enter any website URL to get AI-suggested keywords it has the best chance of ranking for on Google, based on its actual page content."
      />

      <SectionCard title="Analyze a website">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm font-semibold text-foreground">Website URL</label>
            <AutocompleteInput
              value={url}
              onChange={setUrl}
              onSubmit={handleSubmit}
              onBlur={() => setTouched(true)}
              suggestions={pageSuggestions}
              isLoading={isPagesLoading}
              placeholder="https://example.com or search your saved pages"
              className="h-9"
              aria-invalid={showValidationError}
            />
          </div>
          <Button onClick={handleSubmit} disabled={!canSubmit} className="h-9 gap-1.5">
            {keywordsMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Get Keywords
          </Button>
        </div>
        {showValidationError ? (
          <p className="mt-2 text-xs text-destructive">
            Enter a valid website URL (e.g. example.com or https://example.com).
          </p>
        ) : null}
        {keywordsMutation.isPending ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Analyzing the page and researching keywords — this can take a few seconds…
          </p>
        ) : null}
      </SectionCard>

      {keywordsMutation.isError ? (
        <p className="text-sm text-destructive">Couldn't fetch keywords for this URL. Check it and try again.</p>
      ) : null}

      {result ? (
        <SectionCard title={`Keywords ${result.domain} has the best chance to rank for`}>
          <p className="-mt-2 mb-1 text-xs text-muted-foreground">
            {result.categories.length} topic groups ·{" "}
            {result.categories.reduce((sum, category) => sum + category.items.length, 0)} keywords
          </p>
          <p className="mb-3 text-2xs text-muted-foreground">
            AI-suggested ranking opportunities based on this page's actual content — not confirmed Google rankings.
          </p>
          <KeywordBadgeList domain={result.domain} categories={result.categories} />
        </SectionCard>
      ) : null}
    </div>
  );
}
