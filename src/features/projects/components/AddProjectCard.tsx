import { Loader2, Plus } from "lucide-react";

interface AddProjectCardProps {
  onClick: () => void;
  isConnecting: boolean;
}

export function AddProjectCard({ onClick, isConnecting }: AddProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isConnecting}
      className="group flex min-h-[168px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5.5 text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-60"
    >
      <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-foreground">
        {isConnecting ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
      </span>
      <div>
        <div className="text-base font-semibold tracking-tight text-foreground">
          {isConnecting ? "Connecting…" : "Add Project"}
        </div>
        <div className="text-sm text-muted-foreground">Connect a Search Console property</div>
      </div>
    </button>
  );
}
