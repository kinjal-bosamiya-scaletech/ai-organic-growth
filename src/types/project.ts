export interface ProjectMetrics {
  clicks: string;
  impressions: string;
  avgPosition: string;
}

/**
 * Health of a linked project's Google Search Console grant. A linked project
 * (`connected: true`) can still lose access when its OAuth grant expires, so
 * this carries the state a bare `connected` boolean cannot express.
 */
export type GscGrantStatus = "active" | "expired";

export interface Project {
  id: string;
  name: string;
  domain: string;
  letter: string;
  color: string;
  connected: boolean;
  /** Grant health for a linked project. Absent means "active". Only meaningful when `connected`. */
  gscGrant?: GscGrantStatus;
  metrics?: ProjectMetrics;
}
