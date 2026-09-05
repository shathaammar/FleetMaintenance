import { apiClient } from "../api/apiClient";

import type {
  ApiResponse,
  PagedResult,
} from "../types/api";

import type {
  ApproveMaintenanceRequestRequest,
  CreateMaintenanceRequestRequest,
  MaintenanceRequest,
  MaintenanceRequestFilters,
  RejectMaintenanceRequestRequest,
} from "../types/maintenanceRequest";

function createFilterParams(
  filters: MaintenanceRequestFilters,
) {
  return {
    search:
      filters.search || undefined,

    status:
      filters.status || undefined,

    fromDate:
      filters.fromDate || undefined,

    toDate:
      filters.toDate || undefined,

    pageNumber:
      filters.pageNumber,

    pageSize:
      filters.pageSize,
  };
}

export const maintenanceRequestService = {
  async getAll(
    filters: MaintenanceRequestFilters,
  ): Promise<
    PagedResult<MaintenanceRequest>
  > {
    const response = await apiClient.get<
      ApiResponse<
        PagedResult<MaintenanceRequest>
      >
    >("/maintenance-requests", {
      params: createFilterParams(
        filters,
      ),
    });

    return response.data.data;
  },

  async getById(
    id: number,
  ): Promise<MaintenanceRequest> {
    const response = await apiClient.get<
      ApiResponse<MaintenanceRequest>
    >(`/maintenance-requests/${id}`);

    return response.data.data;
  },

  async getMyRequests(
    filters: MaintenanceRequestFilters,
  ): Promise<
    PagedResult<MaintenanceRequest>
  > {
    const response = await apiClient.get<
      ApiResponse<
        PagedResult<MaintenanceRequest>
      >
    >("/maintenance-requests/my", {
      params: createFilterParams(
        filters,
      ),
    });

    return response.data.data;
  },

  async getMyRequestById(
    id: number,
  ): Promise<MaintenanceRequest> {
    const response = await apiClient.get<
      ApiResponse<MaintenanceRequest>
    >(
      `/maintenance-requests/my/${id}`,
    );

    return response.data.data;
  },

  async create(
    data: CreateMaintenanceRequestRequest,
  ): Promise<MaintenanceRequest> {
    const response = await apiClient.post<
      ApiResponse<MaintenanceRequest>
    >(
      "/maintenance-requests",
      data,
    );

    return response.data.data;
  },

  async approve(
    id: number,
    data: ApproveMaintenanceRequestRequest,
  ): Promise<MaintenanceRequest> {
    const response = await apiClient.patch<
      ApiResponse<MaintenanceRequest>
    >(
      `/maintenance-requests/${id}/approve`,
      data,
    );

    return response.data.data;
  },

  async reject(
    id: number,
    data: RejectMaintenanceRequestRequest,
  ): Promise<MaintenanceRequest> {
    const response = await apiClient.patch<
      ApiResponse<MaintenanceRequest>
    >(
      `/maintenance-requests/${id}/reject`,
      data,
    );

    return response.data.data;
  },

  async cancelMyRequest(
    id: number,
  ): Promise<MaintenanceRequest> {
    const response = await apiClient.patch<
      ApiResponse<MaintenanceRequest>
    >(
      `/maintenance-requests/my/${id}/cancel`,
    );

    return response.data.data;
  },
};