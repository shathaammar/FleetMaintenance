import { apiClient } from "../api/apiClient";

import type {
  ApiResponse,
} from "../types/api";

import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from "../types/profile";

export const profileService = {
  async getProfile():
    Promise<UserProfile> {
    const response = await apiClient.get<
      ApiResponse<UserProfile>
    >("/profile");

    return response.data.data;
  },

  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<UserProfile> {
    const response = await apiClient.patch<
      ApiResponse<UserProfile>
    >(
      "/profile",
      data,
    );

    return response.data.data;
  },

  async changePassword(
    data: ChangePasswordRequest,
  ): Promise<void> {
    await apiClient.patch<
      ApiResponse<null>
    >(
      "/profile/password",
      data,
    );
  },
};