import { Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAiAssistant } from "@/hooks/useAiAssistant";
import { cn } from "@/lib/utils";

interface AiActionProps {
  /** Button copy, e.g. "Explain this issue". */
  children: ReactNode;
  /**
   * The question handed to the assistant. Write it as the user would ask it —
   * it is sent verbatim and shown in the transcript.
   */
  prompt: string;
  icon?: LucideIcon;
  size?: "xs" | "sm" | "default";
  className?: string;
}

/**
 * A contextual AI affordance.
 *
 * Every one of these opens the assistant that already exists and seeds it with
 * a concrete, page-specific question — "Why is example.com outranking me for
 * 'seo audit tool'?" rather than a generic chat launcher. The visual treatment
 * is intentionally quiet: a tinted surface and a sparkle, so AI reads as part
 * of the product rather than a promotion inside it.
 */
export function AiAction({
  children,
  prompt,
  icon: Icon = Sparkles,
  size = "sm",
  className,
}: Readonly<AiActionProps>) {
  const { open } = useAiAssistant();

  return (
    <Button variant="ai" size={size} onClick={() => open(prompt)} className={className}>
      <Icon aria-hidden="true" />
      {children}
    </Button>
  );
}

interface AiInsightCardProps {
  title: string;
  /** Short lead-in shown under the title. */
  description?: ReactNode;
  /** The actionable body — steps, findings, a list. */
  children?: ReactNode;
  /** `AiAction`s or buttons. */
  actions?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

/** The AI recommendation surface. One recipe, so every AI block matches. */
export function AiInsightCard({
  title,
  description,
  children,
  actions,
  icon: Icon = Sparkles,
  className,
}: Readonly<AiInsightCardProps>) {
  return (
    <div
      className={cn(
        "surface-ai flex flex-col gap-3 rounded-xl border border-brand-soft-border p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base leading-snug font-semibold text-foreground">{title}</h3>
          {description ? (
            <div className="mt-0.5 text-sm text-muted-foreground">{description}</div>
          ) : null}
        </div>
      </div>

      {children ? <div className="text-sm text-foreground">{children}</div> : null}

      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
