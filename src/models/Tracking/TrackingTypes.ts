// src/models/Tracking/TrackingRequest.ts

import { TrackingEventType } from './TrackingEnum';

export interface CreateLocationPointRequest {
  driverId: string;
  tripId?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface BatchCreateLocationPointsRequest {
  locations: CreateLocationPointRequest[];
}

export interface CreateTrackingEventRequest {
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
}

export interface GetLocationHistoryRequest {
  driverId: string;
  tripId?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
}

export interface StartTrackingSessionRequest {
  driverId: string;
  tripId?: string;
  startTime: string;
}

export interface EndTrackingSessionRequest {
  sessionId: string;
  endTime: string;
}

// src/models/Tracking/TrackingResponse.ts

import { ApiGetByPageResponse, ApiResponse } from '@/types/api';
import { LocationPoint, TrackingEvent, TrackingSession } from './TrackingModel';

export interface LocationPointResponse extends ApiResponse<LocationPoint> {}

export interface BatchLocationPointResponse {
  success: boolean;
  savedCount: number;
  failedCount: number;
  locations: LocationPoint[];
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

export interface TrackingEventResponse extends ApiResponse<TrackingEvent> {}

export interface LocationHistoryResponse extends ApiGetByPageResponse<LocationPoint> {}

export interface TrackingSessionResponse extends ApiResponse<TrackingSession> {}

export interface StartTrackingResponse extends ApiResponse<TrackingSession> {
  success: boolean;
  message?: string;
}

export interface EndTrackingResponse extends ApiResponse<TrackingSession> {
  success: boolean;
  message?: string;
}
