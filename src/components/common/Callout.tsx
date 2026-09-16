import { AlertTriangle, CheckCircle2, Info, Sparkles, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CalloutTone = "neutral" | "brand" | "warning" | "positive" | "negative";

interface CalloutProps {
  tone?: CalloutTone;
  title?: string;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
}

const TONE_CLASSES: Record<CalloutTone, string> = {
  neutral: "border-border bg-muted [&_[data-callout-icon]]:text-muted-foreground",
  brand: "border-brand-soft-border bg-brand-soft [&_[data-callout-icon]]:text-brand-ink",
  warning: "border-warning/25 bg-warning/8 [&_[data-callout-icon]]:text-warning",
  positive: "border-positive/25 bg-positive/8 [&_[data-callout-icon]]:text-positive",
  negative: "border-negative/25 bg-negative/8 [&_[data-callout-icon]]:text-negative",
};

const TONE_ICON: Record<CalloutTone, LucideIcon> = {
  neutral: Info,
  brand: Sparkles,
  warning: AlertTriangle,
  positive: CheckCircle2,
  negative: XCircle,
};

/**
 * Replaces the amber alert block that was copy-pasted into four files.
 *
 * Body copy stays in ink rather than a tinted text colour — the old blocks used
 * text-amber-900/800/600, which is what made them read like a Bootstrap alert.
 * Colour lives in the icon and the border; the words stay legible.
 */
export function Callout({ tone = "neutral", title, icon, className, children }: Readonly<CalloutProps>) {
  const Icon = icon ?? TONE_ICON[tone];
  return (
    <div
      className={cn("flex items-start gap-2.5 rounded-xl border p-4 text-sm", TONE_CLASSES[tone], className)}
      role={tone === "negative" ? "alert" : undefined}
    >
      <Icon data-callout-icon className="mt-px size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-medium text-foreground">{title}</p> : null}
        {children ? (
          <div className={cn("text-muted-foreground", title && "mt-0.5")}>{children}</div>
        ) : null}
      </div>
    </div>
  );
}
