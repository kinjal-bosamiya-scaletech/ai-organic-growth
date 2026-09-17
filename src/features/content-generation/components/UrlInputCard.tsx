import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { SectionCard } from "@/components/common/SectionCard";
import { usePagesStatus } from "@/hooks/queries/usePagesStatus";

interface UrlInputCardProps {
  projectId: string;
  onGenerateFromUrl: (url: string) => void;
  onGenerateFromTitle: (title: string) => void;
  isGenerating: boolean;
  initialTitle?: string;
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function UrlInputCard({
  projectId,
  onGenerateFromUrl,
  onGenerateFromTitle,
  isGenerating,
  initialTitle,
}: UrlInputCardProps) {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const [title, setTitle] = useState(initialTitle ?? "");
  const { data: pages, isLoading: isPagesLoading } = usePagesStatus(projectId);
  const pageSuggestions = useMemo(() => pages?.map((p) => p.url) ?? [], [pages]);

  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
  }, [initialTitle]);

  const validUrl = isValidUrl(url.trim());
  const validTitle = title.trim().length > 0;

  const handleUrlSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (!validUrl || isGenerating) return;
    onGenerateFromUrl(url.trim());
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validTitle || isGenerating) return;
    onGenerateFromTitle(title.trim());
  };

  return (
    <SectionCard title="Generate a blog post">
      {initialTitle ? (
        <div className="mb-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="text-xs font-semibold text-muted-foreground">Using title from Article Title Generator</p>
          <p className="text-sm font-medium text-foreground">{initialTitle}</p>
        </div>
      ) : null}

      <p className="mb-3 text-sm text-muted-foreground">
        Paste any product page URL from your site. We'll read the page and write a complete, SEO-ready blog
        article built to drive traffic straight to that product — ready to copy-paste into your website.
      </p>
      <form onSubmit={handleUrlSubmit} className="flex flex-col gap-2 sm:flex-row">
        <AutocompleteInput
          value={url}
          onChange={setUrl}
          onSubmit={() => handleUrlSubmit()}
          onBlur={() => setTouched(true)}
          suggestions={pageSuggestions}
          isLoading={isPagesLoading}
          placeholder="https://yourstore.com/products/example-product or search your saved pages"
          aria-invalid={touched && !validUrl && url.length > 0}
          disabled={isGenerating}
          className="sm:flex-1"
        />
        <Button type="submit" disabled={!validUrl || isGenerating} className="gap-1.5 sm:w-auto">
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isGenerating ? "Generating…" : "Generate Article"}
        </Button>
      </form>
      {touched && !validUrl && url.length > 0 ? (
        <p className="mt-2 text-xs text-destructive">Enter a full URL, e.g. https://yourstore.com/products/...</p>
      ) : null}

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        Don't have a product page yet? Generate a complete blog article directly from just a title/topic.
      </p>
      <form onSubmit={handleTitleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Best Nicotine Salt Juice - Fast Absorption"
          disabled={isGenerating}
          className="sm:flex-1"
        />
        <Button
          type="submit"
          variant="outline"
          disabled={!validTitle || isGenerating}
          className="gap-1.5 sm:w-auto"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isGenerating ? "Generating…" : "Generate from Title"}
        </Button>
      </form>
    </SectionCard>
  );
}
