import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorHandler } from "@/components/common/ErrorHandler";
import { useTheme } from "@/hooks/useTheme";

/**
 * Pathless root route. `ErrorHandler` needs router context (`useNavigate`) to
 * redirect on 401, so it — and the toast container it feeds — must live inside
 * the router tree rather than beside `<RouterProvider/>`.
 */
export function RootLayout() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <ErrorHandler />
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar
        closeOnClick
        draggable
        pauseOnHover
        // Without this, toasts stay locked to react-toastify's light theme.
        theme={resolvedTheme}
      />
      <Outlet />
    </>
  );
}
