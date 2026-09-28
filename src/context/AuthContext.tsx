import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import posthog from '@/lib/posthog';
import {
  checkLogin,
  getAuthData,
  login as loginRequest,
  removeAuthData,
  setAuthData,
} from '@/services/auth.service';
import type { AuthUser } from '@/services/auth.service';

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(checkLogin);
  const [user, setUser] = useState<AuthUser | null>(() => getAuthData()?.user ?? null);

  useEffect(() => {
    if (!user) return;
    posthog.identify(user.id, {
      email: user.email,
      name: user.fullName,
      role: user.roleName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const authData = await loginRequest(email, password);
    setAuthData(authData);
    setUser(authData.user);
    setIsAuthenticated(true);
    posthog.identify(authData.user.id, {
      email: authData.user.email,
      name: authData.user.fullName,
      role: authData.user.roleName,
    });
  }, []);

  const signOut = useCallback(() => {
    removeAuthData();
    setUser(null);
    setIsAuthenticated(false);
    posthog.reset();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, user, signIn, signOut }),
    [isAuthenticated, user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
