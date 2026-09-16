import type { UserRole } from "./auth";

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: UserRole[];
  createdAt: string;
}

export interface UserFilters {
  search?: string;
  pageNumber: number;
  pageSize: number;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}