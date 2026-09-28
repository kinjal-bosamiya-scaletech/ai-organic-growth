import { ChevronsUpDown } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Logo } from "@/components/common/Logo";
import { ProjectAvatar } from "@/components/common/ProjectAvatar";
import { SidebarNavItem } from "@/components/layout/SidebarNavItem";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { NAV_ITEMS } from "@/lib/constants";
import type { Project } from "@/types/project";

interface SidebarProps {
  project: Project;
}

export function Sidebar({ project }: SidebarProps) {
  const location = useLocation();
  const activeModuleId = location.pathname.split("/")[3];
  const { user } = useAuth();
  const isAdmin = user?.roleName === "Admin";
  const navItems = NAV_ITEMS.filter((item) => item.id !== "settings" || isAdmin);

  return (
    // 260px rather than 246px: IBM Plex Sans is wider than the previous face,
    // and the project name and domain below both truncate.
    <aside className="flex h-full w-65 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Logo iconSize={30} />
      </div>

      <div className="p-3 pb-1">
        <Link
          to="/projects"
          className="flex w-full items-center gap-2.5 rounded-md border border-border bg-muted px-2.5 py-2 text-left transition-colors outline-none hover:border-border-strong hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ProjectAvatar letter={project.letter} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{project.name}</span>
            <span className="block truncate text-2xs text-muted-foreground">{project.domain}</span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="px-2 pt-2 pb-1.5 text-2xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Workspace
        </div>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              projectId={project.id}
              isActive={activeModuleId === item.id}
            />
          ))}
        </div>
      </nav>

      <UserMenu />
    </aside>
  );
}
