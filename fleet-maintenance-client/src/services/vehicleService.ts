import { apiClient } from "../api/apiClient";
import type {
  ApiResponse,
  PagedResult,
} from "../types/api";
import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  Vehicle,
  VehicleFilters,
} from "../types/vehicle";

export const vehicleService = {
  async getVehicles(
    filters: VehicleFilters,
  ): Promise<PagedResult<Vehicle>> {
    const response = await apiClient.get<
      ApiResponse<PagedResult<Vehicle>>
    >(
      "/vehicles",
      {
        params: {
          search:
            filters.search || undefined,

          status:
            filters.status || undefined,

          pageNumber:
            filters.pageNumber,

          pageSize:
            filters.pageSize,
        },
      },
    );

    return response.data.data;
  },

  async getVehicleById(
    id: number,
  ): Promise<Vehicle> {
    const response = await apiClient.get<
      ApiResponse<Vehicle>
    >(`/vehicles/${id}`);

    return response.data.data;
  },

  async createVehicle(
    data: CreateVehicleRequest,
  ): Promise<Vehicle> {
    const response = await apiClient.post<
      ApiResponse<Vehicle>
    >(
      "/vehicles",
      data,
    );

    return response.data.data;
  },

  async updateVehicle(
    id: number,
    data: UpdateVehicleRequest,
  ): Promise<Vehicle> {
    const response = await apiClient.patch<
      ApiResponse<Vehicle>
    >(
      `/vehicles/${id}`,
      data,
    );

    return response.data.data;
  },

  async deleteVehicle(
    id: number,
  ): Promise<void> {
    await apiClient.delete<
      ApiResponse<null>
    >(`/vehicles/${id}`);
  },
};