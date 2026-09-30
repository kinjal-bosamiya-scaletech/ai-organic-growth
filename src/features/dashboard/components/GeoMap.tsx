import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minimize2, Minus, Plus, RotateCcw } from "lucide-react";
import { Chart as ChartJS, Tooltip } from "chart.js";
import type { Chart as ChartInstance, ChartConfiguration } from "chart.js";
import { Chart } from "react-chartjs-2";
import { ChoroplethController, ColorScale, GeoFeature, ProjectionScale } from "chartjs-chart-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldTopology from "world-atlas/countries-110m.json";
import { applyChartDefaults } from "@/components/charts/chartSetup";
import { useChartTheme } from "@/hooks/useChartTheme";
import type { GeoDatum } from "@/types/geo";

// Bundled Natural Earth polygons: no tile server, no API key, works offline.
ChartJS.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale, Tooltip);

interface GeoMapProps {
  data: GeoDatum[];
  focusedCountry: string | null;
}

/** Names in our data that differ from Natural Earth's. */
const ALIASES: Record<string, string> = {
  "United States": "United States of America",
  "Czech Republic": "Czechia",
};

const MAX_ZOOM = 8;
// equalEarth outline aspect, and the fraction of its height by which the
// populated latitudes (83.6°N to 55.9°S, Antarctica dropped) sit above centre.
const OUTLINE_ASPECT = 2.0548;
const CENTER_K = 0.052;

const topology = worldTopology as unknown as Topology<{ countries: GeometryCollection }>;
const countries = (feature(topology, topology.objects.countries) as FeatureCollection<Geometry, { name: string }>).features.filter(
  (f) => f.properties.name !== "Antarctica",
);

function canonical(name: string): string {
  return ALIASES[name] ?? name;
}

type Row = { feature: Feature<Geometry, { name: string }>; geo?: GeoDatum };

/**
 * Countries with data are filled on a clicks ramp; the rest stay neutral so the
 * highlighted areas read at a glance. Hover shows the metrics tooltip.
 */
export function GeoMap({ data, focusedCountry }: Readonly<GeoMapProps>) {
  const chartRef = useRef<ChartInstance | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const { mode, tokens } = useChartTheme();

  useEffect(() => {
    applyChartDefaults(tokens);
  }, [tokens]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Rendered height of the (width- or height-limited) world outline.
  const mapHeight = Math.min(size.h - 16, (size.w - 16) / OUTLINE_ASPECT);

  const changeZoom = useCallback((factor: number) => {
    setZoom((current) => {
      const z = Math.min(MAX_ZOOM, Math.max(1, current * factor));
      // Pan is in pixels at the current scale, so it scales with the zoom.
      if (z === 1) setPan({ x: 0, y: 0 });
      else setPan((p) => ({ x: (p.x * z) / current, y: (p.y * z) / current }));
      return z;
    });
  }, []);

  // Non-passive so the page doesn't scroll while the wheel zooms the map.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      changeZoom(Math.exp(-e.deltaY * 0.0015));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [changeZoom]);

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1 || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setPan({ x: d.panX + e.clientX - d.x, y: d.panY + e.clientY - d.y });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const rows = useMemo<Row[]>(() => {
    const byName = new Map(data.map((g) => [canonical(g.country), g]));
    return countries.map((f) => ({ feature: f, geo: byName.get(f.properties.name) }));
  }, [data]);

  const maxClicks = Math.max(1, ...data.map((g) => g.clicks));

  const config = useMemo(() => {
    // One hue only: intensity carries clicks. Below-average CTR is stated in
    // the tooltip and the ranked list rather than through a second colour.
    const fill = (row?: Row) => {
      if (!row?.geo) return tokens.band;
      const t = 0.3 + 0.7 * Math.sqrt(row.geo.clicks / maxClicks);
      return `color-mix(in srgb, ${tokens.brand} ${Math.round(t * 100)}%, transparent)`;
    };
    return {
      data: {
        labels: rows.map((r) => r.feature.properties.name),
        datasets: [
          {
            label: "Clicks",
            data: rows.map((r) => ({ feature: r.feature, value: r.geo?.clicks ?? 0 })),
            backgroundColor: (ctx?: { dataIndex: number }) => fill(ctx ? rows[ctx.dataIndex] : undefined),
            hoverBackgroundColor: (ctx?: { dataIndex: number }) =>
              (ctx ? rows[ctx.dataIndex] : undefined)?.geo ? tokens.brandInk : tokens.grid,
            borderColor: (ctx?: { dataIndex: number }) => ((ctx ? rows[ctx.dataIndex] : undefined)?.geo ? tokens.brandInk : tokens.hairline),
            borderWidth: 0.5,
          },
        ],
      },
      options: {
        showOutline: false,
        showGraticule: false,
        layout: { padding: 0 },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            // Countries without data get no tooltip.
            filter: (item?: { dataIndex: number }) => Boolean(item && rows[item.dataIndex]?.geo),
            backgroundColor: tokens.surface,
            titleColor: tokens.foreground,
            bodyColor: tokens.mutedForeground,
            borderColor: tokens.grid,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            titleFont: { family: tokens.fontSans, size: 13, weight: 600 },
            bodyFont: { family: tokens.fontSans, size: 12, weight: 500 },
            callbacks: {
              title: (items?: { dataIndex: number }[]) => (items?.[0] ? (rows[items[0].dataIndex]?.geo?.country ?? "") : ""),
              label: (item?: { dataIndex: number }) => {
                const g = item ? rows[item.dataIndex]?.geo : undefined;
                if (!g) return "";
                return [
                  `Clicks: ${g.clicks.toLocaleString()}`,
                  `Impressions: ${g.impressions}`,
                  `CTR: ${g.ctr}`,
                  `Avg position: ${g.position}`,
                  ...(g.belowAverageCtr ? ["Below average CTR"] : []),
                ];
              },
            },
          },
        },
        scales: {
          projection: {
            axis: "x",
            projection: "equalEarth",
            padding: 8,
            projectionScale: zoom,
            projectionOffset: [pan.x, pan.y + CENTER_K * mapHeight * zoom],
          },
          color: { axis: "x", display: false, legend: { display: false } },
        },
      },
    } as unknown as ChartConfiguration<"choropleth">;
  }, [rows, maxClicks, tokens, zoom, pan, mapHeight]);

  // Selecting a country in the list pins its tooltip on the map.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !focusedCountry) return;
    const idx = rows.findIndex((r) => r.geo?.country === focusedCountry);
    if (idx < 0) return;
    const el = chart.getDatasetMeta(0).data[idx];
    if (!el) return;
    const pos = (el as unknown as { getCenterPoint: () => { x: number; y: number } }).getCenterPoint();
    const active = [{ datasetIndex: 0, index: idx }];
    chart.setActiveElements(active);
    chart.tooltip?.setActiveElements(active, pos);
    chart.update("none");
  }, [focusedCountry, rows]);

  const btn =
    "grid size-8 place-items-center rounded-md border border-border bg-card text-foreground transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:hover:bg-card";

  return (
    <div
      ref={wrapRef}
      className={`relative size-full bg-muted ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
      style={{ touchAction: zoom > 1 ? "none" : undefined }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="size-full"
        role="img"
        aria-label="World map highlighting countries with search traffic. Figures are listed beside the map."
      >
        <Chart
          ref={(c) => {
            chartRef.current = c as ChartInstance | null;
          }}
          key={mode}
          type="choropleth"
          data={config.data as never}
          options={config.options as never}
        />
      </div>
      <div className="absolute top-2 right-2 flex flex-col gap-1.5">
        <button type="button" className={btn} aria-label="Zoom in" disabled={zoom >= MAX_ZOOM} onClick={() => changeZoom(1.5)}>
          <Plus className="size-4" aria-hidden="true" />
        </button>
        <button type="button" className={btn} aria-label="Zoom out" disabled={zoom <= 1} onClick={() => changeZoom(1 / 1.5)}>
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={btn}
          aria-label="Reset view"
          disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
        <button type="button" className={btn} aria-label={fullscreen ? "Exit full screen" : "Enter full screen"} onClick={toggleFullscreen}>
          {fullscreen ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
