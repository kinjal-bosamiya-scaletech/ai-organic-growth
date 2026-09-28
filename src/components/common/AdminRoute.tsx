import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

/** Gates a route subtree behind sign-in AND the Admin role. Non-admins are sent to /projects. */
export function AdminRoute() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.roleName !== "Admin") return <Navigate to="/projects" replace />;
  return <Outlet />;
}
