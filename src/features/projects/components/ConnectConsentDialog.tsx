import { Check, FileSearch, LineChart, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Project } from "@/types/project";

interface ConnectConsentDialogProps {
  project: Project | null;
  onCancel: () => void;
  onAllow: () => void;
}

const PERMISSIONS = [
  { icon: Check, text: "View Search Console data for your verified sites" },
  { icon: LineChart, text: "Read search performance — clicks, impressions & rankings" },
  { icon: FileSearch, text: "View indexing status, sitemaps & crawl reports" },
];

export function ConnectConsentDialog({ project, onCancel, onAllow }: ConnectConsentDialogProps) {
  return (
    <Dialog open={project !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent showCloseButton={false} className="max-w-[452px] gap-0 overflow-hidden p-0">
        <div className="border-b border-border px-7 pt-6.5 pb-5">
          <span className="mb-4 flex size-9 items-center justify-center rounded-full bg-[#4285F4]/10 text-[#4285F4]">
            <ScanSearch className="size-5" />
          </span>
          <div className="text-lg leading-snug font-semibold text-foreground">
            Ranky AI wants to access your Google Account
          </div>
          <div className="mt-4 flex w-fit items-center gap-2.5 rounded-full border border-border px-3 py-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              A
            </span>
            <span className="text-sm text-muted-foreground">admin@gmail.com</span>
          </div>
        </div>
        <div className="px-7 py-5.5">
          <div className="mb-3.5 text-sm text-foreground">
            This will allow Ranky AI for <b>{project?.domain}</b> to:
          </div>
          <div className="flex flex-col gap-3.5">
            {PERMISSIONS.map((permission) => (
              <div key={permission.text} className="flex gap-3">
                <permission.icon className="mt-0.5 size-[18px] shrink-0 text-muted-foreground" />
                <span className="text-sm leading-relaxed text-muted-foreground">{permission.text}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground/80">
            Ranky AI requests read-only access. You can review these permissions and revoke access at any time in
            your Google Account settings.
          </p>
        </div>
        <div className="flex justify-end gap-2 px-6 pt-4 pb-5.5">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-[#1A73E8] text-white hover:bg-[#1A73E8]/90" onClick={onAllow}>
            Allow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
