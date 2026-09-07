import type {
  UserRole,
} from "./auth";

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  roles: UserRole[];
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}