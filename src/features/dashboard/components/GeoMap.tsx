import { useEffect, useRef, useState } from "react";
import { MapPinOff } from "lucide-react";
import type { CircleMarker as LeafletCircleMarker } from "leaflet";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
// leaflet.css is imported from src/index.css, not here: this component is
// React.lazy-loaded, so Vite would emit its CSS into the async chunk and inject
// it after the main stylesheet, beating our theme overrides on every tie.
import { EmptyState } from "@/components/common/EmptyState";
import { useChartTheme } from "@/hooks/useChartTheme";
import type { GeoDatum } from "@/types/geo";

interface GeoMapProps {
  data: GeoDatum[];
  focusedCountry: string | null;
}

// The basemap defaults to OpenStreetMap's standard raster tiles: keyless and
// unwatermarked, so the map renders without any provider account. Set
// VITE_MAP_TILE_URL (and VITE_MAP_TILE_ATTRIBUTION) to a keyed provider — for
// example a neutral CARTO or MapTiler style — to override it.
const DEFAULT_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const TILE_URL = import.meta.env.VITE_MAP_TILE_URL || DEFAULT_TILE_URL;
const TILE_ATTRIBUTION = import.meta.env.VITE_MAP_TILE_ATTRIBUTION || DEFAULT_ATTRIBUTION;
// The default light tiles clash with the dark theme, so they are tinted dark in
// dark mode. A custom provider is trusted to supply its own dark style.
const USING_DEFAULT_TILES = !import.meta.env.VITE_MAP_TILE_URL;

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
  const [tilesFailed, setTilesFailed] = useState(false);
  const maxClicks = Math.max(...data.map((g) => g.clicks));

  // When the basemap cannot load, degrade to a short note instead of a broken
  // map. The country ranking beside this card still carries every figure.
  if (tilesFailed) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <EmptyState
          icon={MapPinOff}
          title="Map unavailable"
          description="The basemap could not load. The country ranking beside this map shows the same figures."
        />
      </div>
    );
  }

  return (
    <MapContainer
      center={[30, 0]}
      zoom={1.4}
      scrollWheelZoom={false}
      worldCopyJump
      className={USING_DEFAULT_TILES && mode === "dark" ? "geo-map--dark-tiles" : undefined}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={TILE_URL}
        maxZoom={12}
        attribution={TILE_ATTRIBUTION}
        eventHandlers={{ tileerror: () => setTilesFailed(true) }}
      />
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
