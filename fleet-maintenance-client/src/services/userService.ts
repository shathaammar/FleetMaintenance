import { apiClient } from "../api/apiClient";
import type {
  ApiResponse,
  PagedResult,
} from "../types/api";
import type {
  UpdateUserRoleRequest,
  User,
  UserFilters,
} from "../types/user";

export const userService = {
  async getUsers(
    filters: UserFilters,
  ): Promise<PagedResult<User>> {
    const response = await apiClient.get<
      ApiResponse<PagedResult<User>>
    >(
      "/users",
      {
        params: {
          search:
            filters.search || undefined,

          pageNumber:
            filters.pageNumber,

          pageSize:
            filters.pageSize,
        },
      },
    );

    return response.data.data;
  },

  async updateRole(
    id: string,
    data: UpdateUserRoleRequest,
  ): Promise<User> {
    const response = await apiClient.patch<
      ApiResponse<User>
    >(
      `/users/${id}/role`,
      data,
    );

    return response.data.data;
  },
};