import { apiClient } from "../api/apiClient";

import type {
  ApiResponse,
  PagedResult,
} from "../types/api";

import type {
  CompleteMaintenanceRecordRequest,
  CreateMaintenanceRecordRequest,
  MaintenanceRecord,
  MaintenanceRecordFilters,
  UpdateMaintenanceRecordRequest,
} from "../types/maintenanceRecord";

export const maintenanceRecordService = {
  async getRecords(
    filters: MaintenanceRecordFilters,
  ): Promise<
    PagedResult<MaintenanceRecord>
  > {
    const response = await apiClient.get<
      ApiResponse<
        PagedResult<MaintenanceRecord>
      >
    >("/maintenance-records", {
      params: {
        search:
          filters.search || undefined,

        vehicleId:
          filters.vehicleId ??
          undefined,

        maintenanceTypeId:
          filters.maintenanceTypeId ??
          undefined,

        status:
          filters.status || undefined,

        fromDate:
          filters.fromDate ||
          undefined,

        toDate:
          filters.toDate ||
          undefined,

        pageNumber:
          filters.pageNumber,

        pageSize:
          filters.pageSize,
      },
    });

    return response.data.data;
  },

  async getById(
    id: number,
  ): Promise<MaintenanceRecord> {
    const response = await apiClient.get<
      ApiResponse<MaintenanceRecord>
    >(`/maintenance-records/${id}`);

    return response.data.data;
  },

  async getByVehicleId(
    vehicleId: number,
  ): Promise<MaintenanceRecord[]> {
    const response = await apiClient.get<
      ApiResponse<MaintenanceRecord[]>
    >(
      `/maintenance-records/vehicle/${vehicleId}`,
    );

    return response.data.data;
  },

  async create(
    data: CreateMaintenanceRecordRequest,
  ): Promise<MaintenanceRecord> {
    const response = await apiClient.post<
      ApiResponse<MaintenanceRecord>
    >(
      "/maintenance-records",
      data,
    );

    return response.data.data;
  },

  async update(
    id: number,
    data: UpdateMaintenanceRecordRequest,
  ): Promise<MaintenanceRecord> {
    const response = await apiClient.patch<
      ApiResponse<MaintenanceRecord>
    >(
      `/maintenance-records/${id}`,
      data,
    );

    return response.data.data;
  },

  async complete(
    id: number,
    data: CompleteMaintenanceRecordRequest,
  ): Promise<MaintenanceRecord> {
    const response = await apiClient.patch<
      ApiResponse<MaintenanceRecord>
    >(
      `/maintenance-records/${id}/complete`,
      data,
    );

    return response.data.data;
  },

  async cancel(
  id: number,
    ): Promise<MaintenanceRecord> {
    const response = await apiClient.patch<
        ApiResponse<MaintenanceRecord>
    >(
        `/maintenance-records/${id}/cancel`,
    );

    return response.data.data;
    },

  async delete(
    id: number,
    ): Promise<void> {
        await apiClient.delete<
        ApiResponse<null>
        >(`/maintenance-records/${id}`);
    },
};