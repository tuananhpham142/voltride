// src/models/Sync/SyncEnum.ts

export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCING = 'SYNCING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
  REQUIRES_SUPPORT = 'REQUIRES_SUPPORT',
}

export enum SyncOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum SyncPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum SyncEntityType {
  DELIVERY = 'DELIVERY',
  POD = 'POD',
  LOCATION = 'LOCATION',
  TRIP = 'TRIP',
  PAYMENT = 'PAYMENT',
}
