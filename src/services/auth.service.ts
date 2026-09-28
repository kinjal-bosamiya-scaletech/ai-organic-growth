/**
 * Token/session storage helpers, mirroring the shape of the `mmscan` frontend's
 * `Auth.service.ts` (checkLogin/getAccessToken/setAuthData/getAuthData/removeAuthData).
 */
import httpService from "@/services/http.service";

const AUTH_STORAGE_KEY = "organiq.auth";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName: string;
}

export interface AuthData {
  accessToken: string;
  user: AuthUser;
}

export function login(email: string, password: string): Promise<AuthData> {
  return httpService.post<AuthData>("/auth/login", { email, password }, { isPublic: true });
}

export function checkLogin(): boolean {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) !== null;
}

export function getAccessToken(): string | null {
  const data = getAuthData();
  return data ? data.accessToken : null;
}

export function setAuthData(data: AuthData): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function getAuthData(): AuthData | null {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthData;
  } catch {
    return null;
  }
}

export function removeAuthData(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
