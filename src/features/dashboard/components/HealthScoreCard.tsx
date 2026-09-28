import { GaugeChart } from "@/components/charts/GaugeChart";
import { SectionCard } from "@/components/common/SectionCard";
import { SCORE_SCALES, STATUS_TEXT, scoreStatus } from "@/lib/score";

interface HealthScoreCardProps {
  score: number;
  indexed: string;
  openIssues: number;
  quickWins: number;
  domainAuthority: number | null;
}

/**
 * The `variant="light" | "dark"` prop was removed: DashboardPage never passed
 * it, so the entire dark branch was dead code — and it carried a hardcoded
 * gradient plus four arbitrary hex values that were hand-simulating dark mode.
 * Real dark mode now handles that through tokens.
 */
export function HealthScoreCard({
  score,
  indexed,
  openIssues,
  quickWins,
  domainAuthority,
}: Readonly<HealthScoreCardProps>) {
  const rows: { label: string; value: string; tone?: string }[] = [
    { label: "Indexed pages", value: indexed },
    { label: "Open issues", value: String(openIssues), tone: openIssues > 0 ? STATUS_TEXT.bad : undefined },
    { label: "Quick wins", value: String(quickWins), tone: quickWins > 0 ? STATUS_TEXT.good : undefined },
    { label: "Domain authority", value: domainAuthority === null ? "—" : String(domainAuthority) },
  ];

  return (
    <SectionCard title="SEO health score">
      <div className="flex justify-center">
        <GaugeChart score={score} scale={SCORE_SCALES.health} />
      </div>
      <dl className="mt-4 flex flex-col gap-2 border-t border-border pt-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className={`tabular font-medium ${row.tone ?? "text-foreground"}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}

/** Re-exported so callers can label a score consistently with the gauge. */
export function healthStatus(score: number) {
  return scoreStatus(score, SCORE_SCALES.health);
}
