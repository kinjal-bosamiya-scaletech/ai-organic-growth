import { useEffect } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { axiosInstance } from "@/services/http.service";

interface ApiErrorBody {
  message?: string;
}

/**
 * Registers axios response interceptors for the lifetime of the app (mirrors
 * the `mmscan` frontend's `ErrorHandler` component). Toasts non-GET success
 * messages and every failure. Signs the user out only when a request that
 * carried our bearer token gets a 401, which means the stored session is no
 * longer valid. Rendered once near the app root, alongside `<ToastContainer/>`.
 */
export function ErrorHandler() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleSuccess = (response: AxiosResponse<ApiErrorBody>) => {
      const { data, config } = response;
      if (data?.message && config.method !== "get") {
        toast.success(data.message);
      }
      return response;
    };

    const handleError = (error: AxiosError<ApiErrorBody>) => {
      const { response, config } = error;

      // Only a 401 on a request that carried our bearer token means the stored
      // session is no longer valid, so only then do we sign the user out. A 401
      // without a token (for example a failed login) and a 403 (a permission
      // error) stay as toasts, so a single denied request never ends the session.
      const sessionExpired = response?.status === 401 && Boolean(config?.headers?.Authorization);
      if (sessionExpired) {
        signOut();
        navigate("/login");
        toast.error("Your session has expired. Please sign in again.");
        return Promise.reject(error);
      }

      const message = response?.data?.message ?? error.message ?? "Something went wrong. Please try again.";
      toast.error(message);

      return Promise.reject(error);
    };

    const interceptorId = axiosInstance.interceptors.response.use(handleSuccess, handleError);
    return () => axiosInstance.interceptors.response.eject(interceptorId);
  }, [navigate, signOut]);

  return null;
}
