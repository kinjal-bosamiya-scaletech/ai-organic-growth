import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";

/** Wired as `errorElement` on every router branch so one route's failure doesn't white-screen the app. */
export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : "Something went wrong";
  const message = isRouteErrorResponse(error)
    ? error.data?.message ?? "This page couldn't be loaded."
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button onClick={() => navigate(-1)}>Go back</Button>
    </div>
  );
}
