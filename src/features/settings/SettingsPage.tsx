import { Navigate, useParams } from "react-router";
import { PageLoader } from "@/components/common/PageLoader";
import { QueryErrorFallback } from "@/components/common/QueryErrorFallback";
import { AccountCard } from "@/features/settings/components/AccountCard";
import { ConnectedPropertiesCard } from "@/features/settings/components/ConnectedPropertiesCard";
import { PlanCard } from "@/features/settings/components/PlanCard";
import { TeamCard } from "@/features/settings/components/TeamCard";
import { useProjects } from "@/hooks/queries/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { accountMock, planMock } from "@/mocks/data/settings.mock";

export function SettingsPage() {
  const { user } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const isAdmin = user?.roleName === "Admin";

  if (!isAdmin) return <Navigate to={`/app/${projectId}/dashboard`} replace />;

  return (
    <div className="flex max-w-[720px] flex-col gap-4">
      <AccountCard name={user?.fullName ?? accountMock.name} email={user?.email ?? accountMock.email} initial={accountMock.initial} />

      {isLoading ? <PageLoader label="Loading properties…" /> : null}
      {isError ? <QueryErrorFallback message="We couldn't load your projects." onRetry={() => refetch()} /> : null}
      {projects ? <ConnectedPropertiesCard projects={projects.filter((p) => p.connected)} /> : null}

      <TeamCard />

      <PlanCard description={planMock.description} />
    </div>
  );
}
