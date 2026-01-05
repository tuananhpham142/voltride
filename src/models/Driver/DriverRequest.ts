// src/models/Driver/DriverRequest.ts

import { DriverStatus, VehicleStatus } from './DriverEnum';

export interface GetDriverProfileRequest {
  driverId: string;
}

export interface UpdateDriverProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

export interface UpdateDriverStatusRequest {
  status: DriverStatus;
  reason?: string;
}

export interface UpdateDriverLocationRequest {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface GetDriverPerformanceRequest {
  driverId: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateVehicleStatusRequest {
  vehicleId: string;
  status: VehicleStatus;
  notes?: string;
}

export interface UploadDocumentRequest {
  documentType: string;
  file: {
    uri: string;
    type: string;
    name: string;
  };
  expiryDate?: string;
}
