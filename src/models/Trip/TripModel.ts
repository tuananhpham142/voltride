// src/models/Trip/TripModel.ts

import { DeliveryPoint } from '../Delivery/DeliveryModel';
import { TripPriority, TripStatus, TripType } from './TripEnum';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  zipCode?: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  sequence: number;
}

export interface TripRoute {
  origin: Location;
  destination: Location;
  waypoints: RoutePoint[];
  totalDistance: number; // in meters
  estimatedDuration: number; // in minutes
  polyline?: string; // encoded polyline for map display
}

export interface TripTimeline {
  assignedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface Trip {
  id: string;
  tripNumber: string; // Human-readable trip identifier
  driverId: string;
  vehicleId: string;
  type: TripType;
  priority: TripPriority;
  status: TripStatus;
  deliveryPoints: DeliveryPoint[];
  route: TripRoute;
  timeline: TripTimeline;
  estimatedStartTime: string;
  estimatedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  totalDeliveries: number;
  completedDeliveries: number;
  failedDeliveries: number;
  totalRevenue: number;
  notes?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripState {
  // Data
  currentTrip: Trip | null;
  assignedTrips: Trip[]; // For gig drivers who can accept/reject
  completedTrips: Trip[];

  // Loading states
  isLoading: boolean;
  isAccepting: boolean;
  isRejecting: boolean;
  isStarting: boolean;
  isCompleting: boolean;

  // Pagination for completed trips
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };

  // Error
  error: string | null;
}

// Helper functions
export const getTripProgress = (trip: Trip): number => {
  if (trip.totalDeliveries === 0) return 0;
  return (trip.completedDeliveries / trip.totalDeliveries) * 100;
};

export const getTripStatusColor = (status: TripStatus): string => {
  switch (status) {
    case TripStatus.ASSIGNED:
      return '#FF9500'; // Orange
    case TripStatus.ACCEPTED:
      return '#007AFF'; // Blue
    case TripStatus.IN_PROGRESS:
      return '#5856D6'; // Purple
    case TripStatus.COMPLETED:
      return '#34C759'; // Green
    case TripStatus.PARTIALLY_COMPLETED:
      return '#FF9500'; // Orange
    case TripStatus.CANCELLED:
    case TripStatus.REJECTED:
      return '#FF3B30'; // Red
    default:
      return '#8E8E93'; // Gray
  }
};

export const canAcceptTrip = (trip: Trip): boolean => {
  return trip.status === TripStatus.ASSIGNED;
};

export const canStartTrip = (trip: Trip): boolean => {
  return trip.status === TripStatus.ACCEPTED;
};

export const canCompleteTrip = (trip: Trip): boolean => {
  return (
    trip.status === TripStatus.IN_PROGRESS &&
    trip.completedDeliveries + trip.failedDeliveries === trip.totalDeliveries
  );
};

export const isActiveTripStatus = (status: TripStatus): boolean => {
  return [TripStatus.ACCEPTED, TripStatus.IN_PROGRESS].includes(status);
};
