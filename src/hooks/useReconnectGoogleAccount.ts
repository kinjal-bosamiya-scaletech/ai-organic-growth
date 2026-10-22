import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { useGoogleAccountConnect } from "@/hooks/useGoogleAccountConnect";

/**
 * Reconnects the user's Google account after the OAuth grant has expired, then
 * refreshes the projects list. Pass `onReconnected` for surface-specific follow-up
 * (e.g. refetching the dashboard's queries).
 */
export function useReconnectGoogleAccount(onReconnected?: () => void) {
  const queryClient = useQueryClient();
  return useGoogleAccountConnect({
    onSuccess: () => {
      toast.success("Google account reconnected.");
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
      onReconnected?.();
    },
    onError: (message) => toast.error(message),
  });
}
