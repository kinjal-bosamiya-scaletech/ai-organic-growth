import { AlertTriangle, FileText, ScanLine } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { crawlIssuesMock, indexingMock, sitemapMock } from "@/mocks/data/seo.mock";

interface HealthStripProps {
  indexing: typeof indexingMock;
  sitemap: typeof sitemapMock;
  crawlIssues: typeof crawlIssuesMock;
  onViewIssues: () => void;
}

export function HealthStrip({ indexing, sitemap, crawlIssues, onViewIssues }: HealthStripProps) {
  const indexedPercent = Math.round((indexing.indexed / indexing.discovered) * 100);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-4.5">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-foreground">
            <ScanLine className="size-[18px]" />
          </span>
          <span className="text-sm font-semibold">Indexed pages</span>
        </div>
        <div className="text-2xl font-semibold">{indexing.indexed.toLocaleString()}</div>
        <div className="mt-0.5 mb-3 text-sm text-muted-foreground">
          of {indexing.discovered.toLocaleString()} discovered · {indexing.excluded} excluded
        </div>
        <Progress value={indexedPercent} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4.5">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-foreground">
            <FileText className="size-[18px]" />
          </span>
          <span className="text-sm font-semibold">Sitemap</span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-md font-medium text-positive">
          <span className="size-2 rounded-full bg-primary" />
          {sitemap.status}
        </div>
        <div className="mt-1.5 mb-3 text-sm text-muted-foreground">
          {sitemap.file} · {sitemap.urlCount.toLocaleString()} URLs · read {sitemap.readAgo}
        </div>
        <div className="text-sm font-medium text-foreground">Resubmit sitemap →</div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4.5">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-[34px] items-center justify-center rounded-[9px] bg-destructive/10 text-destructive">
            <AlertTriangle className="size-[18px]" />
          </span>
          <span className="text-sm font-semibold">Crawl issues</span>
        </div>
        <div className="flex gap-4.5">
          <div>
            <div className="text-2xl font-semibold text-destructive">{crawlIssues.errors}</div>
            <div className="text-xs text-muted-foreground">Errors</div>
          </div>
          <div>
            <div className="tabular text-2xl font-semibold text-warning">{crawlIssues.warnings}</div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewIssues}
          className="mt-2.5 text-sm font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
        >
          View all issues →
        </button>
      </div>
    </div>
  );
}
