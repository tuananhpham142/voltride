// src/models/Driver/DriverModel.ts

import {
  DocumentType,
  DriverStatus,
  DriverType,
  DriverVerificationStatus,
  VehicleStatus,
  VehicleType,
} from './DriverEnum';

export interface FileSchema {
  id: string;
  path: string;
  url: string;
  type?: string;
  size?: number;
}

export interface DriverDocument {
  id: string;
  type: DocumentType;
  file: FileSchema;
  verificationStatus: DriverVerificationStatus;
  expiryDate?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  uploadedAt: string;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  capacity: number; // in kg or liters
  status: VehicleStatus;
  registrationDocument?: FileSchema;
  insuranceDocument?: FileSchema;
  currentOdometer?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverPerformanceMetrics {
  totalTrips: number;
  completedTrips: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  totalIncome: number;
  averageRating: number;
  totalRatings: number;
  onTimeDeliveryRate: number; // percentage
  acceptanceRate: number; // percentage
  cancellationRate: number; // percentage
  currentMonthIncome: number;
  currentMonthTrips: number;
  lastTripDate?: string;
  hoursWorked?: number;
}

export interface Driver {
  id: string;
  userId: string;
  type: DriverType;
  status: DriverStatus;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  photo?: FileSchema;
  qrCode: string; // QR code data for driver identification
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  emergencyContact: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  documents: DriverDocument[];
  assignedVehicle?: Vehicle;
  performanceMetrics: DriverPerformanceMetrics;
  verificationStatus: DriverVerificationStatus;
  verifiedAt?: string;
  isOnline: boolean;
  lastSeenAt?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DriverState {
  // Data
  currentDriver: Driver | null;
  assignedVehicle: Vehicle | null;
  performanceMetrics: DriverPerformanceMetrics | null;

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;

  // Error
  error: string | null;

  // UI State
  lastSync: string | null;
}

// Helper functions
export const getDriverFullName = (driver: Driver): string => {
  return `${driver.firstName} ${driver.lastName}`.trim();
};

export const getDriverInitials = (driver: Driver): string => {
  return `${driver.firstName.charAt(0)}${driver.lastName.charAt(0)}`.toUpperCase();
};

export const isDriverAvailable = (driver: Driver): boolean => {
  return driver.status === DriverStatus.ACTIVE && driver.isOnline;
};

export const isDriverVerified = (driver: Driver): boolean => {
  return driver.verificationStatus === DriverVerificationStatus.VERIFIED;
};
