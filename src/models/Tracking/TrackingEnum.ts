// src/models/Tracking/TrackingEnum.ts

export enum LocationAccuracy {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum TrackingEventType {
  TRIP_START = 'TRIP_START',
  TRIP_END = 'TRIP_END',
  DELIVERY_START = 'DELIVERY_START',
  DELIVERY_COMPLETE = 'DELIVERY_COMPLETE',
  LOCATION_UPDATE = 'LOCATION_UPDATE',
  OFFLINE_MODE = 'OFFLINE_MODE',
  ONLINE_MODE = 'ONLINE_MODE',
}
