import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/common/SectionCard";
import { CopyButton } from "@/features/free-tools/components/CopyButton";
import { ToolPageHeader } from "@/features/free-tools/components/ToolPageHeader";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useGenerateTitles } from "@/hooks/queries/useTitleGenerator";

const INITIAL_TITLE_COUNT = 10;
const MORE_TITLE_COUNT = 5;

export function ArticleTitleGeneratorPage() {
  const project = useActiveProject();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const { mutate, isPending, isError } = useGenerateTitles(project.id);

  const canSubmit = keyword.trim().length > 0 && !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setTitles([]);
    mutate(
      { keyword: keyword.trim(), count: INITIAL_TITLE_COUNT },
      { onSuccess: (result) => setTitles(result.titles) },
    );
  };

  const handleGenerateMore = () => {
    if (isPending) return;
    mutate(
      { keyword: keyword.trim(), count: MORE_TITLE_COUNT, excludeTitles: titles },
      { onSuccess: (result) => setTitles((prev) => [...prev, ...result.titles]) },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <ToolPageHeader
        title="Article/Blog Title Generator"
        description="Enter a keyword and get 10 SEO-friendly article title ideas, then jump straight into generating the full article from one."
      />

      <SectionCard title="Enter a keyword">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Nicotine Salt"
            disabled={isPending}
            className="sm:flex-1"
          />
          <Button type="submit" disabled={!canSubmit} className="gap-1.5 sm:w-auto">
            {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isPending ? "Generating…" : "Generate Titles"}
          </Button>
        </form>
      </SectionCard>

      {isError ? <p className="text-sm text-destructive">Couldn't generate titles. Try again.</p> : null}

      {titles.length > 0 ? (
        <SectionCard title="Suggested titles">
          <div className="flex flex-col gap-2">
            {titles.map((title) => (
              <div
                key={title}
                className="flex flex-col items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center"
              >
                <p className="flex-1 text-sm text-foreground">{title}</p>
                <div className="flex shrink-0 gap-2">
                  <CopyButton text={title} />
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5"
                    onClick={() =>
                      navigate(`/app/${project.id}/content-generation`, { state: { articleTitle: title } })
                    }
                  >
                    <Sparkles className="size-4" />
                    Generate Article
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              className="gap-1.5 px-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
              disabled={isPending}
              onClick={handleGenerateMore}
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {isPending ? "Generating…" : "Generate More Titles"}
            </Button>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
