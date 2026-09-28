import { useEffect, useRef } from "react";
import type { CircleMarker as LeafletCircleMarker } from "leaflet";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
// leaflet.css is imported from src/index.css, not here: this component is
// React.lazy-loaded, so Vite would emit its CSS into the async chunk and inject
// it after the main stylesheet, beating our theme overrides on every tie.
import { useChartTheme } from "@/hooks/useChartTheme";
import type { GeoDatum } from "@/types/geo";

interface GeoMapProps {
  data: GeoDatum[];
  focusedCountry: string | null;
}

/**
 * CARTO's Positron / Dark Matter basemaps are already neutral grey, so no
 * filter hack is needed. The label-free variants are used with a separate
 * labels overlay so label prominence stays under our control.
 */
const BASEMAP = {
  light: {
    base: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    labels: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    labelOpacity: 0.55,
  },
  dark: {
    base: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    labels: "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
    labelOpacity: 0.45,
  },
} as const;

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function MapController({
  focusedCountry,
  markerRefs,
}: Readonly<{
  focusedCountry: string | null;
  markerRefs: React.RefObject<Record<string, LeafletCircleMarker | null>>;
}>) {
  const map = useMap();

  useEffect(() => {
    if (!focusedCountry) return;
    const marker = markerRefs.current[focusedCountry];
    if (!marker) return;
    map.flyTo(marker.getLatLng(), 4, { animate: true });
    marker.openPopup();
  }, [focusedCountry, map, markerRefs]);

  return null;
}

export function GeoMap({ data, focusedCountry }: Readonly<GeoMapProps>) {
  const markerRefs = useRef<Record<string, LeafletCircleMarker | null>>({});
  const { mode, tokens } = useChartTheme();
  const maxClicks = Math.max(...data.map((g) => g.clicks));
  const tiles = BASEMAP[mode];

  return (
    <MapContainer
      center={[30, 0]}
      zoom={1.4}
      scrollWheelZoom={false}
      worldCopyJump
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer key={`${mode}-base`} url={tiles.base} maxZoom={12} attribution={ATTRIBUTION} />
      <TileLayer key={`${mode}-labels`} url={tiles.labels} maxZoom={12} opacity={tiles.labelOpacity} />
      {data.map((geo) => {
        // Area-proportional. The previous `9 + sqrt(share) * 24` offset broke
        // proportionality outright: with a 9px floor added to every bubble, a
        // 13x difference in clicks rendered as roughly 2x in radius.
        const radius = Math.max(4, 26 * Math.sqrt(geo.clicks / maxClicks));
        const flagged = geo.belowAverageCtr;
        const color = flagged ? tokens.warning : tokens.ink[1];
        return (
          <CircleMarker
            key={geo.country}
            ref={(marker) => {
              markerRefs.current[geo.country] = marker;
            }}
            center={[geo.lat, geo.lng]}
            radius={radius}
            pathOptions={{
              color,
              weight: 1.5,
              fillColor: color,
              fillOpacity: 0.18,
              // A dashed ring survives greyscale printing and colour-blind
              // viewing; the old amber fill alone did not.
              dashArray: flagged ? "3 3" : undefined,
            }}
          >
            <Popup>
              <span className="text-sm font-medium text-popover-foreground">{geo.country}</span>
              <span className="tabular mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                <span>Clicks</span>
                <span className="text-right text-foreground">{geo.clicks.toLocaleString()}</span>
                <span>Impressions</span>
                <span className="text-right text-foreground">{geo.impressions}</span>
                <span>CTR</span>
                <span className="text-right text-foreground">{geo.ctr}</span>
                <span>Avg position</span>
                <span className="text-right text-foreground">{geo.position}</span>
              </span>
              {flagged ? (
                <span className="mt-1.5 block text-xs text-warning">Below average CTR</span>
              ) : null}
            </Popup>
          </CircleMarker>
        );
      })}
      <MapController focusedCountry={focusedCountry} markerRefs={markerRefs} />
    </MapContainer>
  );
}
