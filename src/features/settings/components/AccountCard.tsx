import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";
import { toast } from "react-toastify";

interface AccountCardProps {
  name: string;
  email: string;
  initial: string;
}

export function AccountCard({ name, email, initial }: AccountCardProps) {
  return (
    <SectionCard title="Account">
      <div className="mb-4 flex items-center gap-3.5">
        <span className="flex size-13 items-center justify-center rounded-full bg-foreground text-xl font-semibold text-background">
          {initial}
        </span>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-muted-foreground">{email} · connected via Google</div>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => toast.info("Manage access is coming soon.")}>
        Manage Google access
      </Button>
    </SectionCard>
  );
}
