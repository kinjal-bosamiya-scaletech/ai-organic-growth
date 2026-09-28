import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  left: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * The single app chrome bar.
 *
 * Three byte-identical header bars existed before — Topbar, plus hand-rolled
 * copies in ProjectsPage and UserMonitoringPage, which sit outside AppLayout.
 * 56px rather than 64px: a tall chrome bar is generous for a dense data product.
 */
export function AppHeader({ left, actions, className }: Readonly<AppHeaderProps>) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between gap-5 border-b border-border bg-card px-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">{left}</div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
