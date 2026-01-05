// src/store/slices/trackingSlice.ts

import { LocationPoint, TrackingEvent, TrackingState } from '@/models/Tracking/TrackingModel';
import {
  BatchCreateLocationPointsRequest,
  CreateLocationPointRequest,
  CreateTrackingEventRequest,
} from '@/models/Tracking/TrackingTypes';
import { TrackingService } from '@/services/tracking/trackingService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: TrackingState = {
  // Current tracking
  isTracking: false,
  currentLocation: null,
  lastKnownLocation: null,

  // Tracking history
  locationHistory: [],
  trackingEvents: [],
  currentSession: null,

  // Offline queue
  offlineLocations: [],
  offlineEvents: [],

  // Sync state
  isSyncing: false,
  lastSyncTime: null,
  pendingSyncCount: 0,

  // Settings
  trackingInterval: 30, // seconds
  locationPermissionGranted: false,

  // Error
  error: null,
};

// Async thunks
export const createLocationPoint = createAsyncThunk(
  'tracking/createLocation',
  async (data: CreateLocationPointRequest, { rejectWithValue }) => {
    try {
      const response = await TrackingService.createLocationPoint(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save location');
    }
  },
);

export const batchCreateLocationPoints = createAsyncThunk(
  'tracking/batchCreateLocations',
  async (data: BatchCreateLocationPointsRequest, { rejectWithValue }) => {
    try {
      const response = await TrackingService.batchCreateLocationPoints(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sync locations');
    }
  },
);

export const createTrackingEvent = createAsyncThunk(
  'tracking/createEvent',
  async (data: CreateTrackingEventRequest, { rejectWithValue }) => {
    try {
      const response = await TrackingService.createTrackingEvent(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create tracking event');
    }
  },
);

export const startTrackingSession = createAsyncThunk(
  'tracking/startSession',
  async ({ driverId, tripId }: { driverId: string; tripId?: string }, { rejectWithValue }) => {
    try {
      const response = await TrackingService.startTrackingSession({
        driverId,
        tripId,
        startTime: new Date().toISOString(),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start tracking session');
    }
  },
);

export const endTrackingSession = createAsyncThunk(
  'tracking/endSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await TrackingService.endTrackingSession({
        sessionId,
        endTime: new Date().toISOString(),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to end tracking session');
    }
  },
);

export const syncOfflineLocations = createAsyncThunk(
  'tracking/syncOffline',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const offlineLocations = state.tracking.offlineLocations;

      if (offlineLocations.length === 0) {
        return { savedCount: 0, failedCount: 0 };
      }

      // Convert to API format
      const locationsToSync = offlineLocations.map((loc: LocationPoint) => ({
        driverId: loc.driverId,
        tripId: loc.tripId,
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        altitude: loc.altitude,
        heading: loc.heading,
        speed: loc.speed,
        timestamp: loc.timestamp,
      }));

      const response = await TrackingService.batchCreateLocationPoints({ locations: locationsToSync });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sync offline locations');
    }
  },
);

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<LocationPoint>) => {
      state.currentLocation = action.payload;
      state.lastKnownLocation = action.payload;
      state.locationHistory.push(action.payload);

      // Keep only last 100 locations in memory
      if (state.locationHistory.length > 100) {
        state.locationHistory = state.locationHistory.slice(-100);
      }
    },
    addOfflineLocation: (state, action: PayloadAction<LocationPoint>) => {
      state.offlineLocations.push(action.payload);
      state.pendingSyncCount = state.offlineLocations.length + state.offlineEvents.length;
    },
    addOfflineEvent: (state, action: PayloadAction<TrackingEvent>) => {
      state.offlineEvents.push(action.payload);
      state.pendingSyncCount = state.offlineLocations.length + state.offlineEvents.length;
    },
    clearSyncedOfflineData: (state) => {
      state.offlineLocations = [];
      state.offlineEvents = [];
      state.pendingSyncCount = 0;
      state.lastSyncTime = new Date().toISOString();
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.locationPermissionGranted = action.payload;
    },
    setTrackingInterval: (state, action: PayloadAction<number>) => {
      state.trackingInterval = action.payload;
    },
    clearTrackingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create location point
      .addCase(createLocationPoint.fulfilled, (state, action) => {
        // Location successfully synced, update last sync time
        state.lastSyncTime = new Date().toISOString();
      })
      .addCase(createLocationPoint.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Batch create locations
      .addCase(batchCreateLocationPoints.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(batchCreateLocationPoints.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.offlineLocations = [];
        state.pendingSyncCount = state.offlineEvents.length;
        state.lastSyncTime = new Date().toISOString();
      })
      .addCase(batchCreateLocationPoints.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      })

      // Create tracking event
      .addCase(createTrackingEvent.fulfilled, (state, action) => {
        state.trackingEvents.push(action.payload);
      })

      // Start tracking session
      .addCase(startTrackingSession.pending, (state) => {
        state.error = null;
      })
      .addCase(startTrackingSession.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.isTracking = true;
      })
      .addCase(startTrackingSession.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // End tracking session
      .addCase(endTrackingSession.pending, (state) => {
        state.error = null;
      })
      .addCase(endTrackingSession.fulfilled, (state, action) => {
        state.currentSession = null;
        state.isTracking = false;
      })
      .addCase(endTrackingSession.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Sync offline locations
      .addCase(syncOfflineLocations.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncOfflineLocations.fulfilled, (state, action) => {
        state.isSyncing = false;
        if (action.payload.savedCount > 0) {
          state.offlineLocations = [];
          state.pendingSyncCount = state.offlineEvents.length;
          state.lastSyncTime = new Date().toISOString();
        }
      })
      .addCase(syncOfflineLocations.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTracking,
  setCurrentLocation,
  addOfflineLocation,
  addOfflineEvent,
  clearSyncedOfflineData,
  setLocationPermission,
  setTrackingInterval,
  clearTrackingError,
} = trackingSlice.actions;

export default trackingSlice.reducer;
