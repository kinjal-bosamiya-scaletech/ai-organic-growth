import axios from "axios";

/**
 * The backend returns HTTP 409 from any Google Search Console route once the
 * project's OAuth grant has expired. This is the single signal the frontend
 * uses to tell an expired grant apart from an ordinary request failure.
 */
export function isGscGrantExpiredError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 409;
}
