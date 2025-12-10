// src/types/api.ts
export interface ApiResponse<T = any> {
  data: T;
}
export interface ApiGetByPageResponse<T = any> {
  data: T[];
  hasNextPage: boolean;
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}

// Success response for create/update/delete operations
export interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}
