import { apiClient } from "../api/apiClient";
import type { ApiResponse, } from "../types/api";
import type { DashboardData, } from "../types/dashboard";

export const dashboardService = {
  async getDashboard():
    Promise<DashboardData> {
    const response = await apiClient.get<
      ApiResponse<DashboardData>
    >("/dashboard");

    return response.data.data;
  },
};