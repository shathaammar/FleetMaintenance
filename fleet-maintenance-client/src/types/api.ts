export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiValidationErrors {
  [propertyName: string]: string[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data?: ApiValidationErrors | null;
}