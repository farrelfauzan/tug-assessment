import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setApiAuthToken } from '../../../services/api';

const AUTH_STORAGE_KEY = 'tug-mobile-auth-session';

type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'USER';
  };
};

type AuthSessionContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  signIn: (nextSession: AuthSession) => void;
  signOut: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type AuthSessionProviderProps = {
  children: ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps): JSX.Element {
  const [isHydrated, setIsHydrated] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    void AsyncStorage.getItem(AUTH_STORAGE_KEY)
      .then((rawValue) => {
        if (!rawValue) {
          setApiAuthToken(null);
          setSession(null);
          setIsHydrated(true);
          return;
        }

        const parsed = JSON.parse(rawValue) as AuthSession;
        setApiAuthToken(parsed.accessToken);
        setSession(parsed);
        setIsHydrated(true);
      })
      .catch(() => {
        setApiAuthToken(null);
        setSession(null);
        setIsHydrated(true);
      });
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      isHydrated,
      signIn: (nextSession) => {
        setApiAuthToken(nextSession.accessToken);
        setSession(nextSession);
        void AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      },
      signOut: () => {
        setApiAuthToken(null);
        setSession(null);
        void AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }),
    [isHydrated, session]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error('useAuthSession must be used within AuthSessionProvider');
  }

  return context;
}
