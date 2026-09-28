import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { getActivityErrors, getActivityLogs, getActivitySummary } from "@/services/activity.service";
import type { ActivityLogsParams } from "@/types/activity";

export function useActivitySummary() {
  return useQuery({
    queryKey: queryKeys.activitySummary(),
    queryFn: getActivitySummary,
  });
}

export function useActivityLogs(params: ActivityLogsParams = {}) {
  return useQuery({
    queryKey: queryKeys.activityLogs(params),
    queryFn: () => getActivityLogs(params),
  });
}

export function useActivityErrors(limit = 50) {
  return useQuery({
    queryKey: queryKeys.activityErrors(),
    queryFn: () => getActivityErrors(limit),
  });
}
