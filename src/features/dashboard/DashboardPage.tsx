import { useNavigate } from "react-router";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/common/Callout";
import { PageLoader } from "@/components/common/PageLoader";
import { QueryErrorFallback } from "@/components/common/QueryErrorFallback";
import { GeoPerformanceCard } from "@/features/dashboard/components/GeoPerformanceCard";
import { HealthScoreCard } from "@/features/dashboard/components/HealthScoreCard";
import { HealthStrip } from "@/features/dashboard/components/HealthStrip";
import { MetricsRow } from "@/features/dashboard/components/MetricsRow";
import { PerformanceCard } from "@/features/dashboard/components/PerformanceCard";
import { TopContentCard } from "@/features/dashboard/components/TopContentCard";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useReconnectGoogleAccount } from "@/hooks/useReconnectGoogleAccount";
import { useRecommendations } from "@/hooks/queries/useRecommendations";
import { useSeoAnalysis } from "@/hooks/queries/useSeoAnalysis";
import { useGscSnapshot, useSyncGscSnapshot } from "@/hooks/queries/useDashboard";
import { isGscGrantExpiredError } from "@/lib/gscConnection";

/** Short relative-time label ("just now", "5m ago", "3h ago", "2d ago") with no date library. */
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Full local date + time, e.g. "31 Jul 2026, 17:57". */
function formatSyncedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardPage() {
  const project = useActiveProject();
  const navigate = useNavigate();

  const recommendationsQuery = useRecommendations(project.id);
  const seoQuery = useSeoAnalysis(project.id);
  const gscSnapshotQuery = useGscSnapshot(project.id);
  const syncGscSnapshotMutation = useSyncGscSnapshot(project.id);

  const retryAll = () => {
    recommendationsQuery.refetch();
    seoQuery.refetch();
    gscSnapshotQuery.refetch();
  };

  const { connect: reconnect, isConnecting } = useReconnectGoogleAccount(retryAll);

  const isLoading = recommendationsQuery.isLoading || seoQuery.isLoading || gscSnapshotQuery.isLoading;
  if (isLoading) return <PageLoader label="Loading dashboard…" />;

  // An expired Google grant makes every Search Console read fail with 409. It has its own
  // recovery path (reconnect), so it never falls through to the generic "Try again" fallback.
  const grantExpired =
    isGscGrantExpiredError(recommendationsQuery.error) ||
    isGscGrantExpiredError(seoQuery.error) ||
    isGscGrantExpiredError(gscSnapshotQuery.error);

  // Only blank the whole page when nothing usable came back; a single failed query no
  // longer hides the sections its siblings returned fine.
  if (!grantExpired && seoQuery.isError && gscSnapshotQuery.isError) {
    return <QueryErrorFallback message="We couldn't load the dashboard." onRetry={retryAll} />;
  }

  const seo = seoQuery.data;
  const snapshotData = gscSnapshotQuery.data?.data;
  const syncedAt = gscSnapshotQuery.data?.syncedAt;
  const quickWins = recommendationsQuery.data?.filter((r) => r.effort === "Low").length ?? 0;
  const openIssuesCount = seo?.issues.filter((issue) => issue.status === "Open").length ?? 0;

  const syncButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => syncGscSnapshotMutation.mutate()}
      disabled={syncGscSnapshotMutation.isPending}
    >
      <RefreshCw className={`size-4 ${syncGscSnapshotMutation.isPending ? "animate-spin" : ""}`} />
      {syncGscSnapshotMutation.isPending ? "Syncing…" : "Sync GSC data"}
    </Button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Organic search overview for <b className="text-foreground">{project.domain}</b>
          {syncedAt && <> · synced {formatSyncedAt(syncedAt)} ({timeAgo(syncedAt)})</>}
        </p>
        {syncButton}
      </div>

      {grantExpired && (
        <Callout tone="negative" title="Your Google Search Console connection has expired.">
          <p>Reconnect your Google account to restore this dashboard.</p>
          <Button size="sm" className="mt-2.5" onClick={reconnect} disabled={isConnecting}>
            {isConnecting ? "Reconnecting…" : "Reconnect Google"}
          </Button>
        </Callout>
      )}

      {snapshotData && <MetricsRow metrics={snapshotData.metrics} trend={snapshotData.trend} />}

      {(snapshotData || seo) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.9fr_1fr]">
          {snapshotData && <PerformanceCard title="Search performance" trend={snapshotData.trend} />}
          {seo && (
            <HealthScoreCard
              score={seo.healthScore}
              indexed={`${seo.indexing.indexed.toLocaleString()} / ${seo.indexing.discovered.toLocaleString()}`}
              openIssues={openIssuesCount}
              quickWins={quickWins}
              domainAuthority={seo.domainAuthority}
            />
          )}
        </div>
      )}

      {seo && (
        <HealthStrip
          indexing={seo.indexing}
          sitemap={seo.sitemap}
          crawlIssues={seo.crawlIssues}
          onViewIssues={() => navigate(`/app/${project.id}/seo-analysis`)}
        />
      )}

      {snapshotData && <GeoPerformanceCard data={snapshotData.geo} />}

      {snapshotData && (
        <TopContentCard projectId={project.id} keywords={snapshotData.keywords} pages={snapshotData.pages} />
      )}

      {!snapshotData && !grantExpired && gscSnapshotQuery.isError && (
        <QueryErrorFallback
          message="We couldn't load your Search Console data."
          onRetry={() => gscSnapshotQuery.refetch()}
        />
      )}

      {!snapshotData && !grantExpired && !gscSnapshotQuery.isError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-24 text-center">
          <p className="text-sm text-muted-foreground">
            No Search Console data has been synced yet for <b className="text-foreground">{project.domain}</b>.
          </p>
          {syncButton}
        </div>
      )}

      {!seo && !grantExpired && seoQuery.isError && (
        <QueryErrorFallback message="We couldn't load your SEO analysis." onRetry={() => seoQuery.refetch()} />
      )}
    </div>
  );
}
