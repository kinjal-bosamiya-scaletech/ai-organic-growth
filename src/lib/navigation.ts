/**
 * Route titles keyed by the path *below* `/app/:projectId/`.
 *
 * Replaces MODULE_TITLES, which was keyed on `pathname.split("/")[3]` — a
 * single segment. That meant all eight `free-tools/*` sub-pages resolved to
 * "Tools" and showed the same header title.
 */
export interface RouteMeta {
  title: string;
  parent?: string;
}

export const ROUTE_META: Record<string, RouteMeta> = {
  dashboard: { title: "Dashboard" },
  competitors: { title: "Competitors" },
  "content-generation": { title: "Content Generator" },
  "seo-analysis": { title: "SEO Analysis" },
  settings: { title: "Settings" },
  "free-tools": { title: "Tools" },
  "free-tools/link-gap": { title: "Link Gap", parent: "free-tools" },
  "free-tools/page-audit": { title: "Page Audit", parent: "free-tools" },
  "free-tools/case-converter": { title: "Case Converter", parent: "free-tools" },
  "free-tools/small-text-generator": { title: "Small Text Generator", parent: "free-tools" },
  "free-tools/core-web-vitals": { title: "Core Web Vitals", parent: "free-tools" },
  "free-tools/built-with": { title: "Built With", parent: "free-tools" },
  "free-tools/article-title-generator": { title: "Title Generator", parent: "free-tools" },
  "free-tools/best-keywords": { title: "Your Best Keywords", parent: "free-tools" },
};

export interface Crumb {
  key: string;
  title: string;
  /** Absent on the current page. */
  to?: string;
}

/** Builds the breadcrumb trail for a pathname, walking `parent` links. */
export function crumbsFor(pathname: string, projectId: string | undefined): Crumb[] {
  const key = pathname.split("/").slice(3).filter(Boolean).join("/");
  const meta = ROUTE_META[key];
  if (!meta) return [{ key: "dashboard", title: ROUTE_META.dashboard.title }];

  const chain: { key: string; meta: RouteMeta }[] = [{ key, meta }];
  let cursor = meta.parent;
  while (cursor && ROUTE_META[cursor]) {
    chain.unshift({ key: cursor, meta: ROUTE_META[cursor] });
    cursor = ROUTE_META[cursor].parent;
  }

  return chain.map((entry, i) => ({
    key: entry.key,
    title: entry.meta.title,
    to: i < chain.length - 1 && projectId ? `/app/${projectId}/${entry.key}` : undefined,
  }));
}
