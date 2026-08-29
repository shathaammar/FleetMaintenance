import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { STORAGE_KEYS } from "../constants/storage";
import { authService } from "../services/authService";
import type { AuthUser, LoginRequest, LoginResponse, } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
    credentials: LoginRequest,
  ) => Promise<AuthUser>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(
    STORAGE_KEYS.USER,
  );

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(
      STORAGE_KEYS.USER,
    );

    return null;
  }
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(
      getStoredUser,
    );

  const login = useCallback(
    async (
      credentials: LoginRequest,
    ): Promise<AuthUser> => {
      const response: LoginResponse =
  await authService.login(credentials);

const isAdmin = response.roles.some(
  (role) =>
    role.toLowerCase() === "admin",
);

const normalizedRole: AuthUser["role"] =
  isAdmin ? "Admin" : "User";

const authenticatedUser: AuthUser = {
  userId: response.userId,
  fullName: response.fullName,
  email: response.email,
  role: normalizedRole,
};

localStorage.setItem(
  STORAGE_KEYS.ACCESS_TOKEN,
  response.token,
);

localStorage.setItem(
  STORAGE_KEYS.USER,
  JSON.stringify(authenticatedUser),
);

setUser(authenticatedUser);

return authenticatedUser;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(
      STORAGE_KEYS.ACCESS_TOKEN,
    );

    localStorage.removeItem(
      STORAGE_KEYS.USER,
    );

    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,

      isAuthenticated:
        user !== null &&
        Boolean(
          localStorage.getItem(
            STORAGE_KEYS.ACCESS_TOKEN,
          ),
        ),

      isAdmin: user?.role === "Admin",

      login,
      logout,
    }),
    [user, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}