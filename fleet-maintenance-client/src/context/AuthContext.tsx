import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { STORAGE_KEYS } from "../constants/storage";
import { authService } from "../services/authService";

import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  UserRole,
} from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (
    credentials: LoginRequest,
  ) => Promise<AuthUser>;

  register: (
    registrationData: RegisterRequest,
  ) => Promise<AuthUser>;

  logout: () => void;

  updateUser: (
    updates: Partial<
      Pick<AuthUser, "fullName" | "email">
    >,
  ) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

function clearStoredAuthentication() {
  localStorage.removeItem(
    STORAGE_KEYS.ACCESS_TOKEN,
  );

  localStorage.removeItem(
    STORAGE_KEYS.USER,
  );
}

function isValidRole(
  role: unknown,
): role is UserRole {
  return role === "Admin" || role === "User";
}

function isExpired(expiresAt: string) {
  const expirationTime =
    new Date(expiresAt).getTime();

  return (
    !Number.isFinite(expirationTime) ||
    expirationTime <= Date.now()
  );
}

function getStoredUser(): AuthUser | null {
  const token = localStorage.getItem(
    STORAGE_KEYS.ACCESS_TOKEN,
  );

  const storedUser = localStorage.getItem(
    STORAGE_KEYS.USER,
  );

  if (!token || !storedUser) {
    clearStoredAuthentication();
    return null;
  }

  try {
    const parsedUser = JSON.parse(
      storedUser,
    ) as Partial<AuthUser>;

    const isValid =
      typeof parsedUser.userId === "string" &&
      typeof parsedUser.fullName === "string" &&
      typeof parsedUser.email === "string" &&
      typeof parsedUser.expiresAt === "string" &&
      isValidRole(parsedUser.role) &&
      !isExpired(parsedUser.expiresAt);

    if (!isValid) {
      clearStoredAuthentication();
      return null;
    }

    return parsedUser as AuthUser;
  } catch {
    clearStoredAuthentication();
    return null;
  }
}

function createAuthenticatedUser(
  response: AuthResponse,
): AuthUser {
  const hasAdminRole = response.roles.some(
    (role) =>
      role.toLowerCase() === "admin",
  );

  const hasUserRole = response.roles.some(
    (role) =>
      role.toLowerCase() === "user",
  );

  let role: UserRole;

  if (hasAdminRole) {
    role = "Admin";
  } else if (hasUserRole) {
    role = "User";
  } else {
    throw new Error(
      "Your account does not have an authorized FleetNova role.",
    );
  }

  return {
    userId: response.userId,
    fullName: response.fullName,
    email: response.email,
    role,
    expiresAt: response.expiresAt,
  };
}

function storeAuthentication(
  response: AuthResponse,
  user: AuthUser,
) {
  localStorage.setItem(
    STORAGE_KEYS.ACCESS_TOKEN,
    response.token,
  );

  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user),
  );
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(
      getStoredUser,
    );

  const logout = useCallback(() => {
    clearStoredAuthentication();
    setUser(null);
  }, []);

  const login = useCallback(
    async (
      credentials: LoginRequest,
    ): Promise<AuthUser> => {
      const response =
        await authService.login(credentials);

      const authenticatedUser =
        createAuthenticatedUser(response);

      storeAuthentication(
        response,
        authenticatedUser,
      );

      setUser(authenticatedUser);

      return authenticatedUser;
    },
    [],
  );

  const register = useCallback(
    async (
      registrationData: RegisterRequest,
    ): Promise<AuthUser> => {
      const response =
        await authService.register(
          registrationData,
        );

      const authenticatedUser =
        createAuthenticatedUser(response);

      storeAuthentication(
        response,
        authenticatedUser,
      );

      setUser(authenticatedUser);

      return authenticatedUser;
    },
    [],
  );

  const updateUser = useCallback(
    (
      updates: Partial<
        Pick<
          AuthUser,
          "fullName" | "email"
        >
      >,
    ) => {
      setUser((currentUser) => {
        if (!currentUser) {
          return null;
        }

        const updatedUser: AuthUser = {
          ...currentUser,
          ...updates,
        };

        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(updatedUser),
        );

        return updatedUser;
      });
    },
    [],
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    let timeoutId: number;

    const checkExpiration = () => {
      const remainingTime =
        new Date(
          user.expiresAt,
        ).getTime() - Date.now();

      if (remainingTime <= 0) {
        logout();
        return;
      }

      timeoutId = window.setTimeout(
        checkExpiration,
        Math.min(
          remainingTime,
          2_147_483_647,
        ),
      );
    };

    checkExpiration();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [user, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "Admin",
      login,
      register,
      logout,
      updateUser,
    }),
    [
      user,
      login,
      register,
      logout,
      updateUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}