import { useCallback, useEffect, useRef, useState } from "react";
import { getGoogleConnectUrl } from "@/services/projects.service";

interface GscConnectMessage {
  source: "gsc-connect";
  ok: boolean;
  message?: string;
}

function isGscConnectMessage(data: unknown): data is GscConnectMessage {
  return typeof data === "object" && data !== null && (data as { source?: unknown }).source === "gsc-connect";
}

interface UseGoogleAccountConnectOptions {
  onSuccess: () => void;
  onError?: (message: string) => void;
}

/**
 * Opens the backend's Google OAuth consent screen in a popup and resolves
 * once the popup's callback page postMessages back a result (or the user
 * closes the popup without finishing).
 */
export function useGoogleAccountConnect({ onSuccess, onError }: UseGoogleAccountConnectOptions) {
  const [isConnecting, setIsConnecting] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Callers pass fresh inline callbacks each render; keep them in refs so the
  // message listener below registers once per mount instead of on every render.
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  const cleanup = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    popupRef.current = null;
    setIsConnecting(false);
  }, []);

  useEffect(() => {
    let backendOrigin: string | null = null;
    try {
      backendOrigin = new URL(getGoogleConnectUrl()).origin;
    } catch {
      // VITE_API_BASE_URL is unset/invalid — connect() will surface this via onError instead.
    }

    function handleMessage(event: MessageEvent) {
      if (!backendOrigin) return;
      if (event.origin !== backendOrigin) return;
      if (!isGscConnectMessage(event.data)) return;

      popupRef.current?.close();
      cleanup();

      if (event.data.ok) {
        onSuccessRef.current();
      } else {
        onErrorRef.current?.(event.data.message ?? "Google connection failed.");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [cleanup]);

  const connect = useCallback(() => {
    let connectUrl: string;
    try {
      connectUrl = getGoogleConnectUrl();
      new URL(connectUrl); // eslint-disable-line no-new -- validates the URL is well-formed
    } catch {
      onError?.("VITE_API_BASE_URL is missing or invalid — check the frontend .env file.");
      return;
    }

    const width = 520;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      connectUrl,
      "gsc-connect",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
    if (!popup) {
      onError?.("Popup blocked — allow popups for this site and try again.");
      return;
    }

    popupRef.current = popup;
    setIsConnecting(true);

    pollRef.current = setInterval(() => {
      if (popup.closed) {
        cleanup();
      }
    }, 500);
  }, [cleanup, onError]);

  return { connect, isConnecting };
}
