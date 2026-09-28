import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * When the ingestion host can't be reached — an ad blocker or the browser's
 * tracking protection killing `us.i.posthog.com` is the common case —
 * posthog-js keeps the payload in its retry queue and re-sends it with an
 * incrementing `?retry_count=`, for both `/e/` (events) and `/s/` (session
 * recording). Nothing clears the queue, so the retries pile on top of each
 * other and the network panel fills with hundreds of failed requests.
 *
 * So: after a burst of failures, pause for a minute, then let it try again.
 * Capture stays on — a pause is not an opt-out — and if the block has lifted
 * by the time the cooldown ends, everything resumes on its own.
 */
const MAX_FAILURES = 3;
const FAILURE_WINDOW_MS = 30_000;
const COOLDOWN_MS = 60_000;

let failureCount = 0;
let lastFailureAt = 0;
let paused = false;

function resume(): void {
  paused = false;
  failureCount = 0;
  posthog.startSessionRecording();
}

export function initPostHog(): void {
  if (!POSTHOG_KEY) {
    console.warn("PostHog API key is not configured");
    return;
  }

  // `main.tsx` re-executes on a Vite HMR full reload. Initialising twice gives
  // PostHog two event queues, so every capture goes out twice.
  if (posthog.__loaded) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: true,
    },
    // Autocapture still records every click — batching only decides how many
    // requests carry them, so a burst of clicks is one `/e/` call, not twelve.
    request_batching: true,
    request_queue_config: {
      flush_interval_ms: 3000,
    },
    before_send: (event) => (paused ? null : event),
    on_request_error: (response) => {
      // A 4xx other than 429 is our own bad payload, not a transport problem —
      // posthog-js doesn't retry those, so they shouldn't count here.
      const isTransportFailure =
        response.statusCode === 0 || response.statusCode === 429 || response.statusCode >= 500;
      if (!isTransportFailure || paused) return;

      const now = Date.now();
      // Stale failures age out, so an isolated blip every few minutes never
      // adds up to a pause.
      failureCount = now - lastFailureAt > FAILURE_WINDOW_MS ? 1 : failureCount + 1;
      lastFailureAt = now;
      if (failureCount < MAX_FAILURES) return;

      paused = true;
      posthog.stopSessionRecording();
      setTimeout(resume, COOLDOWN_MS);
    },
  });
}

export default posthog;
