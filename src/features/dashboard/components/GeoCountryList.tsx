import { AlertTriangle } from "lucide-react";
import type { GeoDatum } from "@/types/geo";

interface GeoCountryListProps {
  data: GeoDatum[];
  onSelect: (geo: GeoDatum) => void;
}

/**
 * The ranked counterpart to the map. This list is also the map's required
 * relief channel: bubble fills sit at 0.18 alpha, far below a readable
 * contrast, so the figures must be available in text right beside it.
 */
export function GeoCountryList({ data, onSelect }: Readonly<GeoCountryListProps>) {
  const topCountries = data.slice(0, 8);
  const maxClicks = Math.max(...topCountries.map((g) => g.clicks));

  return (
    <div className="flex flex-col">
      <div className="mb-2 text-2xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
        Top countries
      </div>
      <div className="flex flex-col">
        {topCountries.map((geo, i) => (
          <button
            key={geo.country}
            type="button"
            onClick={() => onSelect(geo)}
            className="flex items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* A rank numeral replaces the colour-only status dot, which
                carried its meaning in hue alone. */}
            <span className="tabular w-5 shrink-0 text-2xs text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate font-medium">{geo.country}</span>
                <span className="tabular shrink-0 font-medium">{geo.clicks.toLocaleString()}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-chart-grid">
                <div
                  className="h-full rounded-full bg-chart-2"
                  style={{ width: `${(geo.clicks / maxClicks) * 100}%` }}
                />
              </div>
              {geo.belowAverageCtr ? (
                <span className="mt-1 inline-flex items-center gap-1 text-2xs text-warning">
                  <AlertTriangle className="size-3" aria-hidden="true" />
                  Below average CTR
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-auto pt-3 text-2xs leading-relaxed text-muted-foreground">
        Circle size reflects clicks. Flagged regions have below-average CTR.
      </div>
    </div>
  );
}
