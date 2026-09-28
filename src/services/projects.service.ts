import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { projectsMock } from "@/mocks/data/projects.mock";
import httpService from "@/services/http.service";
import { getAccessToken } from "@/services/auth.service";
import type { Project } from "@/types/project";

// Future backend contract:
//   GET  /projects              -> Project[]
//   GET  /projects/:id          -> Project
//   POST /projects/:id/connect  -> Project (connected: true, metrics populated)

const inMemoryProjects: Project[] = projectsMock.map((project) => ({ ...project }));

export async function getProjects(): Promise<Project[]> {
  console.log("🚀 ~ getProjects ~ USE_MOCKS:", USE_MOCKS, import.meta.env.VITE_USE_MOCKS)
  if (USE_MOCKS) return mockDelay([...inMemoryProjects]);
  return httpService.get<Project[]>(API_CONFIG.projects);
}

export async function getProject(projectId: string): Promise<Project | undefined> {
  if (USE_MOCKS) return mockDelay(inMemoryProjects.find((project) => project.id === projectId));
  const projects = await httpService.get<Project[]>(API_CONFIG.projects);
  return projects.find((project) => project.id === projectId);
}

export async function connectProject(projectId: string): Promise<Project> {
  if (USE_MOCKS) {
    const project = inMemoryProjects.find((p) => p.id === projectId);
    if (!project) throw new Error(`Unknown project: ${projectId}`);
    project.connected = true;
    project.metrics = { clicks: "0", impressions: "0", avgPosition: "—" };
    return mockDelay({ ...project }, 1700);
  }
  return httpService.post<Project>(API_CONFIG.projectConnect(projectId));
}

/**
 * Absolute URL to the backend's Google OAuth consent redirect, for opening in
 * a popup. That's a plain browser navigation — it can't carry an
 * Authorization header — so the access token rides along as a query param.
 */
export function getGoogleConnectUrl(): string {
  const token = getAccessToken();
  const params = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${import.meta.env.VITE_API_BASE_URL}/auth/google${params}`;
}
