import { CalendarDays, ChevronRight, Settings } from "lucide-react";
import { Fragment } from "react";
import { Link, useLocation, useParams } from "react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { crumbsFor } from "@/lib/navigation";

export function Topbar() {
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const isAdmin = user?.roleName === "Admin";
  const crumbs = crumbsFor(location.pathname, projectId);

  return (
    <AppHeader
      left={
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          {crumbs.map((crumb, i) => (
            <Fragment key={crumb.key}>
              {i > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 text-border-strong" aria-hidden="true" />
              ) : null}
              {crumb.to ? (
                <Link
                  to={crumb.to}
                  className="truncate text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {crumb.title}
                </Link>
              ) : (
                <span aria-current="page" className="truncate font-medium text-foreground">
                  {crumb.title}
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      }
      actions={
        <>
          <span className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground sm:flex">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            Last 28 days
          </span>
          <ThemeToggle />
          {isAdmin ? (
            <Link
              to={`/app/${projectId}/settings`}
              title="Settings"
              aria-label="Settings"
              className="flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground transition-colors outline-none hover:border-border-strong hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Settings className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </>
      }
    />
  );
}
