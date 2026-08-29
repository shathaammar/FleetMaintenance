export type UserRole = "Admin" | "User";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  fullName: string;
  email: string;
  token: string;
  roles: UserRole[];
  expiresAt: string;
}

export interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
}