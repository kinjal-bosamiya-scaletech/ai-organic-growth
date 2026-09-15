import { AxiosError } from "axios";
import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { dashboardMetricsMock } from "@/mocks/data/dashboard.mock";
import { clicksSeriesMock, impressionsSeriesMock, trendLabelsMock } from "@/mocks/data/trend.mock";
import { geoMock } from "@/mocks/data/geo.mock";
import { keywordsMock } from "@/mocks/data/keywords.mock";
import { pagesMock } from "@/mocks/data/pages.mock";
import { projectsMock } from "@/mocks/data/projects.mock";
import httpService from "@/services/http.service";
import type { DashboardMetric, DashboardTrend } from "@/types/dashboard";
import type { GeoDatum } from "@/types/geo";
import type { GscSnapshot } from "@/types/gscSnapshot";

// Future backend contract:
//   GET /projects/:id/metrics -> DashboardMetric[]
//   GET /projects/:id/trend   -> DashboardTrend
//   GET /projects/:id/geo     -> GeoDatum[]
//   GET  /projects/:id/gsc-sync -> GscSnapshot (cached, offline read of the last manual sync)
//   POST /projects/:id/gsc-sync -> GscSnapshot (live fetch from Search Console, saved as the new snapshot)

export async function getDashboardMetrics(projectId: string): Promise<DashboardMetric[]> {
  if (USE_MOCKS) return mockDelay(dashboardMetricsMock);
  return httpService.get<DashboardMetric[]>(API_CONFIG.dashboardMetrics(projectId));
}

export async function getDashboardTrend(projectId: string): Promise<DashboardTrend> {
  if (USE_MOCKS) {
    return mockDelay({
      labels: trendLabelsMock,
      clicksSeries: clicksSeriesMock,
      impressionsSeries: impressionsSeriesMock,
    });
  }
  return httpService.get<DashboardTrend>(API_CONFIG.dashboardTrend(projectId));
}

export async function getDashboardGeo(projectId: string): Promise<GeoDatum[]> {
  if (USE_MOCKS) return mockDelay(geoMock);
  return httpService.get<GeoDatum[]>(API_CONFIG.dashboardGeo(projectId));
}

/** Mirrors the backend's 409 for a GSC route once the project's OAuth grant has expired. */
function gscGrantExpiredError(): AxiosError {
  const message = "Reconnect the Google account for this project.";
  const error = new AxiosError(message, "ERR_BAD_REQUEST");
  error.response = { status: 409, statusText: "Conflict", data: { message }, headers: {}, config: {} as never };
  return error;
}

export async function getGscSnapshot(projectId: string): Promise<GscSnapshot> {
  if (USE_MOCKS) {
    await mockDelay(null);
    if (projectsMock.find((p) => p.id === projectId)?.gscGrant === "expired") throw gscGrantExpiredError();
    return { data: null, syncedAt: null };
  }
  return httpService.get<GscSnapshot>(API_CONFIG.gscSync(projectId));
}

export async function syncGscSnapshot(projectId: string): Promise<GscSnapshot> {
  if (USE_MOCKS) {
    return mockDelay(
      {
        data: {
          metrics: dashboardMetricsMock,
          trend: { labels: trendLabelsMock, clicksSeries: clicksSeriesMock, impressionsSeries: impressionsSeriesMock },
          geo: geoMock,
          keywords: keywordsMock,
          pages: pagesMock,
        },
        syncedAt: new Date().toISOString(),
      },
      800,
    );
  }
  return httpService.post<GscSnapshot>(API_CONFIG.gscSync(projectId));
}
