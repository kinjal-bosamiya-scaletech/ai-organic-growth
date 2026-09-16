import DOMPurify from "dompurify";
import { Wand2 } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";
import { CopyButton } from "@/features/content-generation/components/CopyButton";
import type { GeneratedContent } from "@/types/contentGeneration";
import { ARTICLE_ALLOWED_ATTR, ARTICLE_ALLOWED_TAGS } from "@/features/content-generation/articleHtmlSanitizer";

interface ArticleContentCardProps {
  content: GeneratedContent;
  onEditWithAi: () => void;
}

export function ArticleContentCard({ content, onEditWithAi }: ArticleContentCardProps) {
  const meetsMinimum = content.wordCount >= 700 && content.wordCount <= 800;
  const safeHtml = useMemo(
    () =>
      DOMPurify.sanitize(content.contentHtml, {
        ALLOWED_TAGS: ARTICLE_ALLOWED_TAGS,
        ALLOWED_ATTR: ARTICLE_ALLOWED_ATTR,
      }),
    [content.contentHtml],
  );

  return (
    <SectionCard
      title="Full Article"
      action={
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" className="gap-1.5" onClick={onEditWithAi}>
            <Wand2 />
            Edit With AI
          </Button>
          <CopyButton text={content.contentHtml} label="Copy Article HTML" />
        </div>
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <Badge variant={meetsMinimum ? "secondary" : "destructive"}>{content.wordCount} words</Badge>
        <span className="text-xs text-muted-foreground">
          {meetsMinimum
            ? "Within the target 700-800 word range for strong SEO ranking."
            : "Outside the target 700-800 word range — consider regenerating."}
        </span>
      </div>
      <div
        className="max-h-[32rem] overflow-y-auto rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground [&_a]:text-brand-ink [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:first:mt-0 [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_li]:ml-4 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_table]:mb-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:p-2"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        This is ready-to-paste HTML. Switch your website/blog editor (WordPress, Shopify, Ghost, Webflow, etc.) to
        its "HTML" / "Code view" mode and paste it in directly — no reformatting needed.
      </p>
    </SectionCard>
  );
}
