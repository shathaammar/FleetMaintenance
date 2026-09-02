import { apiClient } from "../api/apiClient";
import type { ApiResponse, } from "../types/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

export const authService = {
  async login(
    credentials: LoginRequest,
  ): Promise<AuthResponse> {
    const response = await apiClient.post<
      ApiResponse<AuthResponse>
    >(
      "/auth/login",
      credentials,
    );

    return response.data.data;
  },

  async register(
    registrationData: RegisterRequest,
  ): Promise<AuthResponse> {
    const response = await apiClient.post<
      ApiResponse<AuthResponse>
    >(
      "/auth/register",
      registrationData,
    );

    return response.data.data;
  },
};