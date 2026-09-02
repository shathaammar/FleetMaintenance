export type UserRole = "Admin" | "User";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
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