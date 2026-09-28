import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/common/Logo";
import { PageLoader } from "@/components/common/PageLoader";
import { QueryErrorFallback } from "@/components/common/QueryErrorFallback";
import { Button } from "@/components/ui/button";
import { ErrorLogTable } from "@/features/user-monitoring/components/ErrorLogTable";
import { SummaryCards } from "@/features/user-monitoring/components/SummaryCards";
import { UsageOverTimeChart } from "@/features/user-monitoring/components/UsageOverTimeChart";
import { UserActivityTable } from "@/features/user-monitoring/components/UserActivityTable";
import { useActivityErrors, useActivityLogs, useActivitySummary } from "@/hooks/queries/useActivity";
import { useAuth } from "@/hooks/useAuth";

/** Top-level admin page — not project-scoped, so it gets its own header instead of the project Sidebar/Topbar. */
export function UserMonitoringPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const summaryQuery = useActivitySummary();
  const logsQuery = useActivityLogs({ limit: 500 });
  const errorsQuery = useActivityErrors(50);

  const isLoading = summaryQuery.isLoading || logsQuery.isLoading || errorsQuery.isLoading;
  const isError = summaryQuery.isError || logsQuery.isError || errorsQuery.isError;

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        left={
          <>
            <Logo iconSize={30} />
            <Link
              to="/projects"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Projects
            </Link>
          </>
        }
        actions={
          <>
            <ThemeToggle />
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.fullName}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        }
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-8 py-8">
        <div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">User Monitoring</h1>
          <p className="text-md text-muted-foreground">
            How people are actually using the platform — activity, engagement and errors, at a glance.
          </p>
        </div>

        {isLoading ? <PageLoader label="Loading user activity…" /> : null}

        {isError || (!isLoading && (!summaryQuery.data || !logsQuery.data || !errorsQuery.data)) ? (
          <QueryErrorFallback
            message="We couldn't load user monitoring data."
            onRetry={() => {
              summaryQuery.refetch();
              logsQuery.refetch();
              errorsQuery.refetch();
            }}
          />
        ) : null}

        {summaryQuery.data && logsQuery.data && errorsQuery.data ? (
          <>
            <SummaryCards summaries={summaryQuery.data} errors={errorsQuery.data} />

            <UsageOverTimeChart logs={logsQuery.data.items} />

            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">Activity by user</h2>
              <UserActivityTable summaries={summaryQuery.data} />
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">Recent errors</h2>
              <ErrorLogTable errors={errorsQuery.data} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
