import { apiClient } from "../api/apiClient";
import type { ApiResponse, } from "../types/api";
import type {
  CreateMaintenanceTypeRequest,
  MaintenanceType,
  UpdateMaintenanceTypeRequest,
} from "../types/maintenanceType";

export const maintenanceTypeService = {
  async getAll():
    Promise<MaintenanceType[]> {
    const response = await apiClient.get<
      ApiResponse<MaintenanceType[]>
    >("/maintenance-types");

    return response.data.data;
  },

  async getById(
    id: number,
  ): Promise<MaintenanceType> {
    const response = await apiClient.get<
      ApiResponse<MaintenanceType>
    >(`/maintenance-types/${id}`);

    return response.data.data;
  },

  async create(
    data: CreateMaintenanceTypeRequest,
  ): Promise<MaintenanceType> {
    const response = await apiClient.post<
      ApiResponse<MaintenanceType>
    >(
      "/maintenance-types",
      data,
    );

    return response.data.data;
  },

  async update(
    id: number,
    data: UpdateMaintenanceTypeRequest,
  ): Promise<MaintenanceType> {
    const response = await apiClient.patch<
      ApiResponse<MaintenanceType>
    >(
      `/maintenance-types/${id}`,
      data,
    );

    return response.data.data;
  },

  async delete(
    id: number,
  ): Promise<void> {
    await apiClient.delete<
      ApiResponse<null>
    >(`/maintenance-types/${id}`);
  },
};