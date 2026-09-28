/**
 * Central map of backend REST paths, mirrored after the `mmscan` frontend's
 * `shared/constants/api.ts` convention. Every domain service below builds its
 * URLs from here rather than hardcoding path strings — this is also the
 * documented contract the future `backend` package needs to implement.
 */
export const API_CONFIG = {
  projects: "projects",
  projectConnect: (projectId: string) => `projects/${projectId}/connect`,
  keywords: (projectId: string) => `projects/${projectId}/keywords`,
  pages: (projectId: string) => `projects/${projectId}/pages`,
  pageRecommendations: (projectId: string) => `projects/${projectId}/pages/recommendations`,
  pageAnalysis: (projectId: string) => `projects/${projectId}/page-analysis`,
  pagesSync: (projectId: string) => `projects/${projectId}/pages/sync`,
  pagesStatus: (projectId: string) => `projects/${projectId}/pages/status`,
  recommendations: (projectId: string) => `projects/${projectId}/recommendations`,
  applyRecommendation: (recommendationId: string) => `recommendations/${recommendationId}/apply`,
  seoAnalysis: (projectId: string) => `projects/${projectId}/seo-analysis`,
  chat: (projectId: string) => `projects/${projectId}/chat`,
  contentGeneration: (projectId: string) => `projects/${projectId}/content-generation`,
  contentGenerationFromTitle: (projectId: string) => `projects/${projectId}/content-generation/from-title`,
  contentGenerationPlagiarism: (projectId: string) => `projects/${projectId}/content-generation/plagiarism-check`,
  contentGenerationEdit: (projectId: string) => `projects/${projectId}/content-generation/edit`,
  titleGenerator: (projectId: string) => `projects/${projectId}/title-generator`,
  linkGap: (projectId: string) => `projects/${projectId}/link-gap`,
  pageAudit: (projectId: string) => `projects/${projectId}/page-audit`,
  pageAuditCompetitor: (projectId: string) => `projects/${projectId}/page-audit/competitor`,
  dashboardMetrics: (projectId: string) => `projects/${projectId}/metrics`,
  dashboardTrend: (projectId: string) => `projects/${projectId}/trend`,
  dashboardGeo: (projectId: string) => `projects/${projectId}/geo`,
  gscSync: (projectId: string) => `projects/${projectId}/gsc-sync`,
  coreWebVitals: "core-web-vitals",
  builtWith: "built-with",
  bestKeywords: "best-keywords",
  users: "users",
  roles: "roles",
  activitySummary: "activity/summary",
  activityLogs: "activity/logs",
  activityErrors: "activity/errors",
};

/**
 * Appends a query string built from `params`, dropping nullish/empty values.
 * Mirrors `getUrl` from the `mmscan` frontend without pulling in `query-string`/`lodash`.
 */
export function getUrl(url: string, params: Record<string, unknown> = {}): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const queryString = search.toString();
  return queryString ? `${url}?${queryString}` : url;
}
