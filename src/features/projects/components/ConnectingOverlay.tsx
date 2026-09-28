import { Loader2 } from "lucide-react";

interface ConnectingOverlayProps {
  projectName: string;
}

export function ConnectingOverlay({ projectName }: ConnectingOverlayProps) {
  return (
    <div className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-5.5 bg-background/95">
      <Loader2 className="size-11 animate-spin text-muted-foreground" />
      <div className="text-center">
        <div className="text-lg font-semibold">Connecting {projectName}…</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Syncing Search Console data &amp; running first AI scan
        </div>
      </div>
    </div>
  );
}
