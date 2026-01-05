// src/models/Driver/DriverEnum.ts

export enum DriverType {
  INTERNAL = 'INTERNAL',
  GIG = 'GIG',
}

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_TRIP = 'ON_TRIP',
  OFFLINE = 'OFFLINE',
  SUSPENDED = 'SUSPENDED',
}

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  BICYCLE = 'BICYCLE',
  E_BIKE = 'E_BIKE',
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export enum DriverVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum DocumentType {
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  INSURANCE = 'INSURANCE',
  ID_CARD = 'ID_CARD',
  PROFILE_PHOTO = 'PROFILE_PHOTO',
}
