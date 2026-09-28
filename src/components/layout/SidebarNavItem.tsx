import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/nav";

interface SidebarNavItemProps {
  item: NavItem;
  projectId: string;
  isActive: boolean;
}

export function SidebarNavItem({ item, projectId, isActive }: Readonly<SidebarNavItemProps>) {
  const Icon = item.icon;
  return (
    <Link
      to={`/app/${projectId}/${item.id}`}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        // Was `bg-primary text-white`, which in mono becomes a heavy solid
        // black bar — and `text-white` would be wrong in dark mode anyway.
        // Three channels instead: a brand-coloured rule, a weight shift, and a
        // surface tint. The rule uses --primary so the active item picks up the
        // theme colour in both light and dark.
        isActive
          ? "bg-accent font-medium text-foreground before:absolute before:inset-y-1.5 before:-left-2 before:w-0.5 before:rounded-full before:bg-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge ? (
        <span className="tabular rounded-full bg-secondary px-1.5 py-0.5 text-2xs font-medium text-foreground">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
