import { lazy, Suspense, useMemo, useState } from "react";
import { SectionCard } from "@/components/common/SectionCard";
import { PageLoader } from "@/components/common/PageLoader";
import type { GeoDatum } from "@/types/geo";
import { GeoCountryList } from "@/features/dashboard/components/GeoCountryList";

// Leaflet is a heavy dependency only needed on this one card — split it into its own chunk.
const GeoMap = lazy(() => import("@/features/dashboard/components/GeoMap").then((m) => ({ default: m.GeoMap })));

interface GeoPerformanceCardProps {
  data: GeoDatum[];
}

export function GeoPerformanceCard({ data }: GeoPerformanceCardProps) {
  const [focusedCountry, setFocusedCountry] = useState<string | null>(null);

  const topCountries = useMemo(() => data.slice(0, 10), [data]);

  const handleSelect = (geo: GeoDatum) => setFocusedCountry(geo.country);

  const topCountrySummary = useMemo(() => {
    if (topCountries.length === 0) return null;
    const totalClicks = topCountries.reduce((sum, g) => sum + g.clicks, 0);
    const top = topCountries.reduce((best, g) => (g.clicks > best.clicks ? g : best));
    const share = totalClicks > 0 ? Math.round((top.clicks / totalClicks) * 100) : 0;
    return `${top.country} · ${share}% of clicks`;
  }, [topCountries]);

  return (
    <SectionCard
      title="Search performance by region"
      action={
        topCountrySummary ? (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {topCountrySummary}
          </span>
        ) : undefined
      }
    >
      <p className="-mt-3 mb-3.5 text-sm text-muted-foreground">
        Clicks &amp; impressions by country · last 28 days · tap a country to zoom
      </p>
      <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1.7fr_1fr]">
        <div className="h-[380px] overflow-hidden rounded-xl border border-border bg-muted">
          <Suspense fallback={<PageLoader label="Loading map…" />}>
            <GeoMap data={topCountries} focusedCountry={focusedCountry} />
          </Suspense>
        </div>
        <GeoCountryList data={topCountries} onSelect={handleSelect} />
      </div>
    </SectionCard>
  );
}
