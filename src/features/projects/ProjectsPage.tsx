import { Activity, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { AppHeader } from "@/components/layout/AppHeader";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from '@/components/common/Logo';
import { PageLoader } from '@/components/common/PageLoader';
import { QueryErrorFallback } from '@/components/common/QueryErrorFallback';
import { Button } from '@/components/ui/button';
import { AddProjectCard } from '@/features/projects/components/AddProjectCard';
import { ConnectConsentDialog } from '@/features/projects/components/ConnectConsentDialog';
import { ConnectingOverlay } from '@/features/projects/components/ConnectingOverlay';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { useConnectProject, useProjects } from '@/hooks/queries/useProjects';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleAccountConnect } from '@/hooks/useGoogleAccountConnect';
import { USE_MOCKS } from '@/lib/mockDelay';
import type { Project } from '@/types/project';

export function ProjectsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const connectMutation = useConnectProject();

  const [connectTarget, setConnectTarget] = useState<Project | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { connect: connectGoogleAccount, isConnecting: isConnectingGoogleAccount } =
    useGoogleAccountConnect({
      onSuccess: () => {
        toast.success('Google account connected.');
        refetch();
      },
      onError: (message) => toast.error(message),
    });

  const connectedCount = useMemo(
    () => projects?.filter((p) => p.connected).length ?? 0,
    [projects]
  );
  const isAdmin = user?.roleName === 'Admin';
  const settingsTargetProjectId = projects?.[0]?.id;

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const handleAddProperty = () => {
    if (USE_MOCKS) {
      toast.info('Adding new properties is coming soon.');
      return;
    }
    connectGoogleAccount();
  };

  const handleAllowConnect = () => {
    if (!connectTarget) return;
    setIsConnecting(true);
    connectMutation.mutate(connectTarget.id, {
      onSuccess: (project) => navigate(`/app/${project.id}/dashboard`),
      onSettled: () => {
        setIsConnecting(false);
        setConnectTarget(null);
      },
    });
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        left={<Logo iconSize={30} />}
        actions={
          <>
            {isAdmin ? (
              <Link
                to="/admin/user-monitoring"
                title="User monitoring"
                aria-label="User monitoring"
                className="flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground transition-colors outline-none hover:border-border-strong hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Activity className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
            {isAdmin && settingsTargetProjectId ? (
              <Link
                to={`/app/${settingsTargetProjectId}/settings`}
                title="Settings"
                aria-label="Settings"
                className="flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground transition-colors outline-none hover:border-border-strong hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Settings className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
            <ThemeToggle />
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.fullName}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        }
      />

      <div className="px-8 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">Your Projects</h1>
          <p className="text-md text-muted-foreground">
            {connectedCount} of {projects?.length ?? 0} properties connected from your Google Search
            Console account.
          </p>
        </div>

        {isLoading ? <PageLoader label="Loading your projects…" /> : null}
        {isError ? (
          <QueryErrorFallback message="We couldn't load your projects." onRetry={() => refetch()} />
        ) : null}
        {projects ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onConnect={setConnectTarget} />
            ))}
            <AddProjectCard onClick={handleAddProperty} isConnecting={isConnectingGoogleAccount} />
          </div>
        ) : null}
      </div>

      <ConnectConsentDialog
        project={isConnecting ? null : connectTarget}
        onCancel={() => setConnectTarget(null)}
        onAllow={handleAllowConnect}
      />
      {isConnecting && connectTarget ? (
        <ConnectingOverlay projectName={connectTarget.name} />
      ) : null}
    </div>
  );
}
