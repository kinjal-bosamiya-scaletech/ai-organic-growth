import { AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  /** Helper text under the label, before the control. Explains what to enter. */
  description?: string;
  /** Validation message. Its presence puts the field in the invalid state. */
  error?: string;
  /** Leading icon rendered inside the control. */
  icon?: LucideIcon;
  optional?: boolean;
  className?: string;
  /**
   * Receives the id/aria wiring. Spread it onto the input so the label, the
   * description and the error message are all announced with the control.
   */
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean | undefined;
    className: string;
  }) => ReactNode;
}

/**
 * Label-above-control field.
 *
 * Every form in the product previously relied on the placeholder alone to say
 * what a field was — which disappears the moment someone types, and which
 * screen readers treat as a hint rather than a name. This wires label,
 * description and error to the control properly and gives the icon a
 * consistent inset so `pl-*` isn't re-guessed per form.
 */
export function FormField({
  label,
  description,
  error,
  icon: Icon,
  optional,
  className,
  children,
}: Readonly<FormFieldProps>) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {label}
        {optional ? <span className="text-xs font-normal text-muted-foreground">Optional</span> : null}
      </label>

      {description ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}

      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
        {children({
          id,
          "aria-describedby": describedBy,
          "aria-invalid": error ? true : undefined,
          className: Icon ? "pl-9" : "",
        })}
      </div>

      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
