import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueryErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

/** Reusable fallback each feature page renders when its query `isError`. */
export function QueryErrorFallback({
  message = "We couldn't load this data.",
  onRetry,
}: Readonly<QueryErrorFallbackProps>) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-14 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5.5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RefreshCw />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
