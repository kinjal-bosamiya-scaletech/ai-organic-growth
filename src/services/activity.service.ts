import { API_CONFIG, getUrl } from "@/lib/api-endpoints";
import httpService from "@/services/http.service";
import type {
  ActivityLog,
  ActivityLogsParams,
  PaginatedActivityLogs,
  UserActivitySummary,
} from "@/types/activity";

export function getActivitySummary(): Promise<UserActivitySummary[]> {
  return httpService.get<UserActivitySummary[]>(API_CONFIG.activitySummary);
}

export function getActivityLogs(params: ActivityLogsParams = {}): Promise<PaginatedActivityLogs> {
  return httpService.get<PaginatedActivityLogs>(
    getUrl(API_CONFIG.activityLogs, params as Record<string, unknown>),
  );
}

export function getActivityErrors(limit = 50): Promise<ActivityLog[]> {
  return httpService.get<ActivityLog[]>(getUrl(API_CONFIG.activityErrors, { limit }));
}
