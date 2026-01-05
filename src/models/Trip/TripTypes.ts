// src/models/Trip/TripRequest.ts

export interface GetAssignedTripsRequest {
  driverId: string;
  status?: string[];
}

export interface AcceptTripRequest {
  tripId: string;
  acceptedAt: string;
}

export interface RejectTripRequest {
  tripId: string;
  reason: string;
}

export interface StartTripRequest {
  tripId: string;
  startLocation: {
    latitude: number;
    longitude: number;
  };
  startTime: string;
}

export interface CompleteTripRequest {
  tripId: string;
  endLocation: {
    latitude: number;
    longitude: number;
  };
  endTime: string;
  notes?: string;
}

export interface GetCompletedTripsRequest {
  driverId: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

// src/models/Trip/TripResponse.ts

import { ApiGetByPageResponse, ApiResponse } from '@/types/api';
import { Trip } from './TripModel';

export interface TripDetailResponse extends ApiResponse<Trip> {}

export interface TripListResponse extends ApiGetByPageResponse<Trip> {}

export interface AcceptTripResponse extends ApiResponse<Trip> {
  success: boolean;
  message?: string;
}

export interface RejectTripResponse {
  success: boolean;
  message?: string;
}

export interface StartTripResponse extends ApiResponse<Trip> {
  success: boolean;
  message?: string;
}

export interface CompleteTripResponse extends ApiResponse<Trip> {
  success: boolean;
  message?: string;
}
