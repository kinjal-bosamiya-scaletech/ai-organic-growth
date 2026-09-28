import { useState } from "react";
import { Globe, Loader2, Search, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/common/SectionCard";
import { ToolPageHeader } from "@/features/free-tools/components/ToolPageHeader";
import { useBuiltWith } from "@/hooks/queries/useBuiltWith";

export function BuiltWithPage() {
  const [url, setUrl] = useState("");
  const checkMutation = useBuiltWith();
  const result = checkMutation.data;
  const canSubmit = url.trim().length > 0;

  const handleCheck = () => {
    if (!canSubmit) return;
    checkMutation.mutate(url.trim());
  };

  const categories = result
    ? Array.from(new Set(result.technologies.map((t) => t.category)))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <ToolPageHeader
        title="Built With"
        description="Enter any URL to see what it's built with — CMS, frameworks, analytics, and hosting provider."
      />

      <SectionCard title="Analyze a website">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm font-semibold text-foreground">Website URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="https://example.com"
              className="h-9"
            />
          </div>
          <Button onClick={handleCheck} disabled={checkMutation.isPending || !canSubmit} className="h-9">
            {checkMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Analyze
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Free, no paid APIs — detects tech from the page's own HTML/headers and looks up hosting via DNS.
        </p>
      </SectionCard>

      {checkMutation.isError ? (
        <p className="text-sm text-destructive">Couldn't analyze this URL. Check it and try again.</p>
      ) : null}

      {result ? (
        <div className="flex flex-col gap-4">
          <SectionCard title="Hosting">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Server className="size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-2xs text-muted-foreground">Hosting Provider</p>
                  <p className="text-sm font-semibold text-foreground">
                    {result.hosting.hostingProvider ?? "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Globe className="size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-2xs text-muted-foreground">Server Location</p>
                  <p className="text-sm font-semibold text-foreground">
                    {[result.hosting.city, result.hosting.country].filter(Boolean).join(", ") || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-2xs text-muted-foreground">IP Address</p>
                <p className="text-sm font-semibold text-foreground">{result.hosting.ip ?? "Unknown"}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-2xs text-muted-foreground">Server Header</p>
                <p className="text-sm font-semibold text-foreground">{result.serverHeader ?? "Not disclosed"}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Technology Stack">
            {result.technologies.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No known technologies detected from this page's public HTML.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <div key={category}>
                    <p className="mb-1.5 text-sm font-semibold text-foreground">{category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.technologies
                        .filter((t) => t.category === category)
                        .map((t) => (
                          <span
                            key={t.name}
                            className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-xs font-medium text-foreground"
                          >
                            {t.name}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
