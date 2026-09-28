import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render/lifecycle errors that hooks can't (mirrors the `mmscan`
 * frontend's class-component `ErrorBoundary`). Wraps the app root, above the router.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-6 text-center">
          <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            The application ran into an unexpected error. Try reloading the page.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
