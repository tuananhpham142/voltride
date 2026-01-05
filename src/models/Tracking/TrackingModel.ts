// src/models/Tracking/TrackingModel.ts

import { LocationAccuracy, TrackingEventType } from './TrackingEnum';

export interface LocationPoint {
  id: string;
  driverId: string;
  tripId?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number; // Direction in degrees (0-360)
  speed?: number; // meters per second
  timestamp: string;
  locationAccuracy: LocationAccuracy;
  isSynced: boolean;
  syncedAt?: string;
  capturedOffline: boolean;
}

export interface TrackingEvent {
  id: string;
  driverId: string;
  tripId?: string;
  deliveryPointId?: string;
  type: TrackingEventType;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: string;
  metadata?: Record<string, any>;
  isSynced: boolean;
}

export interface TrackingSession {
  id: string;
  driverId: string;
  tripId?: string;
  startTime: string;
  endTime?: string;
  totalLocations: number;
  totalDistance: number; // in meters
  averageSpeed: number; // in km/h
  isActive: boolean;
}

export interface TrackingState {
  // Current tracking
  isTracking: boolean;
  currentLocation: LocationPoint | null;
  lastKnownLocation: LocationPoint | null;

  // Tracking history
  locationHistory: LocationPoint[];
  trackingEvents: TrackingEvent[];
  currentSession: TrackingSession | null;

  // Offline queue
  offlineLocations: LocationPoint[];
  offlineEvents: TrackingEvent[];

  // Sync state
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingSyncCount: number;

  // Settings
  trackingInterval: number; // in seconds
  locationPermissionGranted: boolean;

  // Error
  error: string | null;
}

// Helper functions
export const calculateDistance = (point1: LocationPoint, point2: LocationPoint): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const calculateTotalDistance = (points: LocationPoint[]): number => {
  if (points.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += calculateDistance(points[i - 1], points[i]);
  }

  return totalDistance;
};

export const getLocationAccuracyColor = (accuracy: number): string => {
  if (accuracy < 20) return '#34C759'; // Green - High accuracy
  if (accuracy < 50) return '#FF9500'; // Orange - Medium accuracy
  return '#FF3B30'; // Red - Low accuracy
};

export const shouldUpdateLocation = (
  lastLocation: LocationPoint | null,
  newLocation: LocationPoint,
  minDistance: number = 10, // meters
): boolean => {
  if (!lastLocation) return true;

  const distance = calculateDistance(lastLocation, newLocation);
  return distance >= minDistance;
};

export const formatSpeed = (speedMps: number): string => {
  const speedKmh = (speedMps * 3.6).toFixed(1);
  return `${speedKmh} km/h`;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};
