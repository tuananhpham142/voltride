// src/services/trip/tripService.ts

import {
  AcceptTripRequest,
  AcceptTripResponse,
  CompleteTripRequest,
  CompleteTripResponse,
  GetCompletedTripsRequest,
  RejectTripRequest,
  RejectTripResponse,
  StartTripRequest,
  StartTripResponse,
  TripDetailResponse,
  TripListResponse,
} from '@/models/Trip/TripTypes';
import { baseApi } from '../baseApi';

export class TripService {
  private static readonly BASE_PATH = '/trips';

  /**
   * Get assigned trips for driver
   */
  static async getAssignedTrips(driverId: string): Promise<TripListResponse> {
    try {
      const response = await baseApi.get<TripListResponse>(`${this.BASE_PATH}/assigned/${driverId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get trip by ID
   */
  static async getTripById(tripId: string): Promise<TripDetailResponse> {
    try {
      const response = await baseApi.get<TripDetailResponse>(`${this.BASE_PATH}/${tripId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Accept trip (for gig drivers)
   */
  static async acceptTrip(data: AcceptTripRequest): Promise<AcceptTripResponse> {
    try {
      const response = await baseApi.post<AcceptTripResponse>(`${this.BASE_PATH}/${data.tripId}/accept`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reject trip (for gig drivers)
   */
  static async rejectTrip(data: RejectTripRequest): Promise<RejectTripResponse> {
    try {
      const response = await baseApi.post<RejectTripResponse>(`${this.BASE_PATH}/${data.tripId}/reject`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Start trip
   */
  static async startTrip(data: StartTripRequest): Promise<StartTripResponse> {
    try {
      const response = await baseApi.post<StartTripResponse>(`${this.BASE_PATH}/${data.tripId}/start`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Complete trip
   */
  static async completeTrip(data: CompleteTripRequest): Promise<CompleteTripResponse> {
    try {
      const response = await baseApi.post<CompleteTripResponse>(`${this.BASE_PATH}/${data.tripId}/complete`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get completed trips with pagination
   */
  static async getCompletedTrips(params: GetCompletedTripsRequest): Promise<TripListResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: params.page?.toString() || '1',
        limit: params.limit?.toString() || '20',
      });

      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await baseApi.get<TripListResponse>(
        `${this.BASE_PATH}/completed/${params.driverId}?${queryParams.toString()}`,
      );
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
