// src/models/Driver/DriverResponse.ts

import { ApiGetByPageResponse, ApiResponse } from '@/types/api';
import { Driver, DriverPerformanceMetrics, Vehicle } from './DriverModel';

export interface DriverProfileResponse extends ApiResponse<Driver> {}

export interface DriverPerformanceResponse extends ApiResponse<DriverPerformanceMetrics> {}

export interface VehicleResponse extends ApiResponse<Vehicle> {}

export interface UpdateDriverResponse extends ApiResponse<Driver> {
  message: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  data: {
    id: string;
    url: string;
    type: string;
  };
  message?: string;
}

export interface DriverStatusUpdateResponse {
  success: boolean;
  data: Driver;
  message?: string;
}

export interface DriverLocationUpdateResponse {
  success: boolean;
  message?: string;
}
