import { useNavigate } from "react-router";
import { ProjectAvatar } from "@/components/common/ProjectAvatar";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onConnect: (project: Project) => void;
}

export function ProjectCard({ project, onConnect }: Readonly<ProjectCardProps>) {
  const navigate = useNavigate();

  const stats = project.metrics
    ? [
        { label: "Clicks / 28d", value: project.metrics.clicks },
        { label: "Impressions", value: project.metrics.impressions },
        { label: "Avg position", value: project.metrics.avgPosition },
      ]
    : [];

  return (
    // Hover state comes from border weight and elevation, not hue — and the
    // green-tinted shadow is gone. A coloured drop-shadow under every card is
    // one of the most recognisable template artefacts.
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-[border-color,box-shadow] duration-150 hover:border-border-strong hover:shadow-md">
      <div className="flex items-center gap-3">
        <ProjectAvatar letter={project.letter} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold tracking-tight">{project.name}</div>
          <div className="truncate text-sm text-muted-foreground">{project.domain}</div>
        </div>
        <span
          className={
            project.connected
              ? "rounded-full bg-positive/10 px-2.5 py-1 text-xs font-medium text-positive"
              : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          }
        >
          {project.connected ? "Connected" : "Not connected"}
        </span>
      </div>

      {project.connected && stats.length > 0 ? (
        <dl className="flex gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 rounded-md bg-muted px-3 py-2.5">
              <dt className="text-2xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                {stat.label}
              </dt>
              <dd className="tabular mt-0.5 text-base font-semibold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="rounded-md border border-dashed border-border bg-muted p-3.5 text-sm leading-relaxed text-muted-foreground">
          Grant access to unlock search performance, indexing and AI growth recommendations.
        </p>
      )}

      {project.connected ? (
        <Button size="lg" onClick={() => navigate(`/app/${project.id}/dashboard`)}>
          Open dashboard
        </Button>
      ) : (
        <Button variant="outline" onClick={() => onConnect(project)}>
          Connect
        </Button>
      )}
    </div>
  );
}
