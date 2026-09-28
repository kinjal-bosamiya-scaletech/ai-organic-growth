import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";

export function PlanCard({ description }: { description: string }) {
  return (
    <SectionCard title="Plan">
      <p className="mb-3.5 text-sm text-muted-foreground">{description}</p>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast.info("Upgrades are coming soon.")}>
        Upgrade plan
      </Button>
    </SectionCard>
  );
}
