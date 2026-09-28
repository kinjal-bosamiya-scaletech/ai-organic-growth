import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/features/free-tools/components/CopyButton";
import type { PageAuditMetaField, PageAuditResult } from "@/types/pageAudit";

function MetaFieldCard({ title, field }: { title: string; field: PageAuditMetaField }) {
  return (
    <SectionCard title={title}>
      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
        {field.value}
      </div>
      <div className="mt-3 flex items-start gap-2">
        <Badge variant={field.status === "good" ? "default" : "destructive"}>
          {field.status === "good" ? "Looking Good!" : title}
        </Badge>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{field.note}</p>

      {field.suggestion ? (
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="text-2xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Suggested Replacement</p>
          <p className="text-sm text-foreground">{field.suggestion}</p>
          <CopyButton text={field.suggestion} label="Copy suggestion" className="self-start" />
        </div>
      ) : null}
    </SectionCard>
  );
}

export function MetadataTab({ result }: { result: PageAuditResult }) {
  return (
    <div className="flex flex-col gap-4">
      <MetaFieldCard title="Meta Title" field={result.metaTitle!} />
      <MetaFieldCard title="Meta Description" field={result.metaDescription!} />

      <SectionCard title="All Meta Data">
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
          {result.allMetaData!.map((entry) => (
            <p key={entry.key} className="break-words text-sm text-foreground">
              <span className="font-semibold">{entry.key}</span> : {entry.value}
            </p>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
