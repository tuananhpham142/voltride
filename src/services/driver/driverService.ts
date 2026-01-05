// src/services/driver/driverService.ts

import {
  UpdateDriverLocationRequest,
  UpdateDriverProfileRequest,
  UpdateDriverStatusRequest,
  UploadDocumentRequest
} from '@/models/Driver/DriverRequest';
import {
  DocumentUploadResponse,
  DriverLocationUpdateResponse,
  DriverPerformanceResponse,
  DriverProfileResponse,
  DriverStatusUpdateResponse,
  UpdateDriverResponse,
} from '@/models/Driver/DriverResponse';
import { baseApi } from '../baseApi';

export class DriverService {
  private static readonly BASE_PATH = '/drivers';

  /**
   * Get driver profile
   */
  static async getDriverProfile(driverId: string): Promise<DriverProfileResponse> {
    try {
      const response = await baseApi.get<DriverProfileResponse>(`${this.BASE_PATH}/${driverId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update driver profile
   */
  static async updateDriverProfile(driverId: string, data: UpdateDriverProfileRequest): Promise<UpdateDriverResponse> {
    try {
      const response = await baseApi.patch<UpdateDriverResponse>(`${this.BASE_PATH}/${driverId}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update driver status (online/offline/on-trip)
   */
  static async updateDriverStatus(
    driverId: string,
    data: UpdateDriverStatusRequest,
  ): Promise<DriverStatusUpdateResponse> {
    try {
      const response = await baseApi.patch<DriverStatusUpdateResponse>(`${this.BASE_PATH}/${driverId}/status`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update driver location
   */
  static async updateDriverLocation(
    driverId: string,
    data: UpdateDriverLocationRequest,
  ): Promise<DriverLocationUpdateResponse> {
    try {
      const response = await baseApi.post<DriverLocationUpdateResponse>(`${this.BASE_PATH}/${driverId}/location`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get driver performance metrics
   */
  static async getDriverPerformance(driverId: string): Promise<DriverPerformanceResponse> {
    try {
      const response = await baseApi.get<DriverPerformanceResponse>(`${this.BASE_PATH}/${driverId}/performance`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload document (license, vehicle registration, etc.)
   */
  static async uploadDocument(driverId: string, data: UploadDocumentRequest): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('documentType', data.documentType);
      formData.append('file', {
        uri: data.file.uri,
        type: data.file.type,
        name: data.file.name,
      } as any);

      if (data.expiryDate) {
        formData.append('expiryDate', data.expiryDate);
      }

      const response = await baseApi.post<DocumentUploadResponse>(`${this.BASE_PATH}/${driverId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handler
   */
  private static handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}
