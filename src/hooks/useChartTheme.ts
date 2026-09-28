import { useSyncExternalStore } from "react";
import { invalidateChartTokens, readChartTokens } from "@/components/charts/chartTokens";
import type { ChartTokens, ThemeMode } from "@/components/charts/chartTokens";

/**
 * Charts observe the `.dark` class on the document rather than consuming
 * ThemeContext.
 *
 * `@custom-variant dark (&:is(.dark *))` means the class on an ancestor *is*
 * the mechanism, so watching it works regardless of how the theme is set —
 * including devtools toggling it by hand — and keeps the chart layer decoupled
 * from the provider's API. One module-level store means every chart shares a
 * single observer and repaints in the same tick.
 */

function currentMode(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ||
    document.body?.classList.contains("dark")
    ? "dark"
    : "light";
}

let mode: ThemeMode = currentMode();
const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function notify(): void {
  const next = currentMode();
  if (next === mode) return;
  mode = next;
  // Computed values changed, so the memo must go before anyone re-reads.
  invalidateChartTokens();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!observer && typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(notify);
    const opts = { attributes: true, attributeFilter: ["class"] };
    observer.observe(document.documentElement, opts);
    if (document.body) observer.observe(document.body, opts);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

function getSnapshot(): ThemeMode {
  return mode;
}

function getServerSnapshot(): ThemeMode {
  return "light";
}

export function useChartTheme(): { mode: ThemeMode; tokens: ChartTokens } {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { mode: current, tokens: readChartTokens(current) };
}
