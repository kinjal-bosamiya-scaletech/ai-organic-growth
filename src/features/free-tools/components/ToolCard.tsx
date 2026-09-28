import { Link } from "react-router";

interface ToolCardProps {
  name: string;
  icon: string;
  comingSoon?: boolean;
  to?: string;
}

export function ToolCard({ name, icon, comingSoon, to }: ToolCardProps) {
  const isLive = Boolean(to) && !comingSoon;

  const content = (
    <div className="group relative">
      <div
        className={`flex h-32 flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-muted/50 ${isLive ? "border-primary/40 bg-card" : "border-border bg-card"}`}
      >
        <div className="text-4xl">{icon}</div>
        <p className="text-center text-sm font-medium text-foreground">{name}</p>
      </div>
      {isLive && (
        <span className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-2xs font-semibold tracking-wide text-primary-foreground">
          Live
        </span>
      )}
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );

  if (to && !comingSoon) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
}
