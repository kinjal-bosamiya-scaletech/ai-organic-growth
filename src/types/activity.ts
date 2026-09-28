export interface ActivityLog {
  id: string;
  userId: string | null;
  userFullName: string | null;
  userEmail: string | null;
  projectId: string | null;
  projectName: string | null;
  method: string;
  path: string;
  statusCode: number | null;
  durationMs: number | null;
  isError: boolean;
  errorMessage: string | null;
  errorStack: string | null;
  ip: string | null;
  createdAt: string;
}

export interface PaginatedActivityLogs {
  items: ActivityLog[];
  total: number;
  page: number;
  limit: number;
}

export interface ActivityLogsParams {
  userId?: string;
  projectId?: string;
  isError?: boolean;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface ModuleUsage {
  module: string;
  count: number;
}

export interface UserActivitySummary {
  userId: string;
  fullName: string;
  email: string;
  roleName: string | null;
  requestCount: number;
  errorCount: number;
  lastActiveAt: string | null;
  projectsTouched: number;
  moduleBreakdown: ModuleUsage[];
}
