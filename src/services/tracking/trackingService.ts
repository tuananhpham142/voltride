// src/services/tracking/trackingService.ts

import {
  BatchCreateLocationPointsRequest,
  BatchLocationPointResponse,
  CreateLocationPointRequest,
  CreateTrackingEventRequest,
  EndTrackingResponse,
  EndTrackingSessionRequest,
  GetLocationHistoryRequest,
  LocationHistoryResponse,
  LocationPointResponse,
  StartTrackingResponse,
  StartTrackingSessionRequest,
  TrackingEventResponse,
} from '@/models/Tracking/TrackingTypes';
import { baseApi } from '../baseApi';

export class TrackingService {
  private static readonly BASE_PATH = '/tracking';

  /**
   * Create single location point
   */
  static async createLocationPoint(data: CreateLocationPointRequest): Promise<LocationPointResponse> {
    try {
      const response = await baseApi.post<LocationPointResponse>(`${this.BASE_PATH}/locations`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Batch create location points (for offline sync)
   */
  static async batchCreateLocationPoints(data: BatchCreateLocationPointsRequest): Promise<BatchLocationPointResponse> {
    try {
      const response = await baseApi.post<BatchLocationPointResponse>(`${this.BASE_PATH}/locations/batch`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create tracking event (trip start, delivery complete, etc.)
   */
  static async createTrackingEvent(data: CreateTrackingEventRequest): Promise<TrackingEventResponse> {
    try {
      const response = await baseApi.post<TrackingEventResponse>(`${this.BASE_PATH}/events`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get location history
   */
  static async getLocationHistory(params: GetLocationHistoryRequest): Promise<LocationHistoryResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.tripId) queryParams.append('tripId', params.tripId);
      if (params.startTime) queryParams.append('startTime', params.startTime);
      if (params.endTime) queryParams.append('endTime', params.endTime);
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await baseApi.get<LocationHistoryResponse>(
        `${this.BASE_PATH}/locations/${params.driverId}?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Start tracking session
   */
  static async startTrackingSession(data: StartTrackingSessionRequest): Promise<StartTrackingResponse> {
    try {
      const response = await baseApi.post<StartTrackingResponse>(`${this.BASE_PATH}/sessions/start`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * End tracking session
   */
  static async endTrackingSession(data: EndTrackingSessionRequest): Promise<EndTrackingResponse> {
    try {
      const response = await baseApi.post<EndTrackingResponse>(`${this.BASE_PATH}/sessions/end`, data);
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
