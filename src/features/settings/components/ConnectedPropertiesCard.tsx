import { ProjectAvatar } from "@/components/common/ProjectAvatar";
import { SectionCard } from "@/components/common/SectionCard";
import type { Project } from "@/types/project";

export function ConnectedPropertiesCard({ projects }: Readonly<{ projects: Project[] }>) {
  return (
    <SectionCard title="Connected properties">
      <div className="flex flex-col">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center gap-3 border-t border-border py-2.75 first:border-t-0">
            <ProjectAvatar letter={project.letter} />
            <span className="flex-1 truncate text-sm font-medium">{project.domain}</span>
            <span className="rounded-full bg-positive/10 px-2.5 py-0.5 text-xs font-medium text-positive">
              Connected
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
