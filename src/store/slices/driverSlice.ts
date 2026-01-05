// src/store/slices/driverSlice.ts

import { Driver, DriverState } from '@/models/Driver/DriverModel';
import {
  UpdateDriverLocationRequest,
  UpdateDriverProfileRequest,
  UpdateDriverStatusRequest,
} from '@/models/Driver/DriverRequest';
import { DriverService } from '@/services/driver/driverService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: DriverState = {
  // Data
  currentDriver: null,
  assignedVehicle: null,
  performanceMetrics: null,

  // Loading states
  isLoading: false,
  isUpdating: false,

  // Error
  error: null,

  // UI State
  lastSync: null,
};

// Async thunks
export const fetchDriverProfile = createAsyncThunk(
  'driver/fetchProfile',
  async (driverId: string, { rejectWithValue }) => {
    try {
      const response = await DriverService.getDriverProfile(driverId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch driver profile');
    }
  },
);

export const updateDriverProfile = createAsyncThunk(
  'driver/updateProfile',
  async ({ driverId, data }: { driverId: string; data: UpdateDriverProfileRequest }, { rejectWithValue }) => {
    try {
      const response = await DriverService.updateDriverProfile(driverId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update driver profile');
    }
  },
);

export const updateDriverStatus = createAsyncThunk(
  'driver/updateStatus',
  async ({ driverId, data }: { driverId: string; data: UpdateDriverStatusRequest }, { rejectWithValue }) => {
    try {
      const response = await DriverService.updateDriverStatus(driverId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update driver status');
    }
  },
);

export const updateDriverLocation = createAsyncThunk(
  'driver/updateLocation',
  async ({ driverId, data }: { driverId: string; data: UpdateDriverLocationRequest }, { rejectWithValue }) => {
    try {
      await DriverService.updateDriverLocation(driverId, data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update location');
    }
  },
);

export const fetchDriverPerformance = createAsyncThunk(
  'driver/fetchPerformance',
  async (driverId: string, { rejectWithValue }) => {
    try {
      const response = await DriverService.getDriverPerformance(driverId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch performance metrics');
    }
  },
);

export const uploadDocument = createAsyncThunk(
  'driver/uploadDocument',
  async (
    { driverId, documentType, file }: { driverId: string; documentType: string; file: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await DriverService.uploadDocument(driverId, { documentType, file });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload document');
    }
  },
);

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setCurrentDriver: (state, action: PayloadAction<Driver | null>) => {
      state.currentDriver = action.payload;
    },
    clearDriverError: (state) => {
      state.error = null;
    },
    updateLastSync: (state) => {
      state.lastSync = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch driver profile
      .addCase(fetchDriverProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDriverProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDriver = action.payload;
        state.assignedVehicle = action.payload.assignedVehicle || null;
        state.performanceMetrics = action.payload.performanceMetrics;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchDriverProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update driver profile
      .addCase(updateDriverProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateDriverProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentDriver = action.payload;
      })
      .addCase(updateDriverProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Update driver status
      .addCase(updateDriverStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateDriverStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.currentDriver) {
          state.currentDriver.status = action.payload.status;
        }
      })
      .addCase(updateDriverStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Update driver location
      .addCase(updateDriverLocation.fulfilled, (state, action) => {
        if (state.currentDriver) {
          state.currentDriver.currentLocation = {
            latitude: action.payload.latitude,
            longitude: action.payload.longitude,
            accuracy: action.payload.accuracy,
            timestamp: action.payload.timestamp,
          };
          state.currentDriver.lastSeenAt = action.payload.timestamp;
        }
      })

      // Fetch performance metrics
      .addCase(fetchDriverPerformance.fulfilled, (state, action) => {
        state.performanceMetrics = action.payload;
      });
  },
});

export const { setCurrentDriver, clearDriverError, updateLastSync } = driverSlice.actions;

export default driverSlice.reducer;
