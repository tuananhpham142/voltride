// src/store/slices/tripSlice.ts

import { mockAssignedTrips, mockCompletedTrips, mockCurrentTrip } from '@/assets/mock-data/trips';
import { Trip, TripState } from '@/models/Trip/TripModel';
import { AcceptTripRequest, CompleteTripRequest, RejectTripRequest, StartTripRequest } from '@/models/Trip/TripTypes';
import { TripService } from '@/services/trip/tripService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: TripState = {
  // Data
  currentTrip: mockCurrentTrip,
  assignedTrips: mockAssignedTrips,
  completedTrips: mockCompletedTrips,

  // Loading states
  isLoading: false,
  isAccepting: false,
  isRejecting: false,
  isStarting: false,
  isCompleting: false,

  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNextPage: false,
  },

  // Error
  error: null,
};

// Async thunks
export const fetchAssignedTrips = createAsyncThunk(
  'trip/fetchAssigned',
  async (driverId: string, { rejectWithValue }) => {
    try {
      const response = await TripService.getAssignedTrips(driverId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch assigned trips');
    }
  },
);

export const fetchTripById = createAsyncThunk('trip/fetchById', async (tripId: string, { rejectWithValue }) => {
  try {
    const response = await TripService.getTripById(tripId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch trip details');
  }
});

export const acceptTrip = createAsyncThunk('trip/accept', async (data: AcceptTripRequest, { rejectWithValue }) => {
  try {
    const response = await TripService.acceptTrip(data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to accept trip');
  }
});

export const rejectTrip = createAsyncThunk('trip/reject', async (data: RejectTripRequest, { rejectWithValue }) => {
  try {
    await TripService.rejectTrip(data);
    return data.tripId;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to reject trip');
  }
});

export const startTrip = createAsyncThunk('trip/start', async (data: StartTripRequest, { rejectWithValue }) => {
  try {
    const response = await TripService.startTrip(data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to start trip');
  }
});

export const completeTrip = createAsyncThunk(
  'trip/complete',
  async (data: CompleteTripRequest, { rejectWithValue }) => {
    try {
      const response = await TripService.completeTrip(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete trip');
    }
  },
);

export const fetchCompletedTrips = createAsyncThunk(
  'trip/fetchCompleted',
  async (
    { driverId, page = 1, limit = 20 }: { driverId: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await TripService.getCompletedTrips({ driverId, page, limit });
      return { ...response, page };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch completed trips');
    }
  },
);

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setCurrentTrip: (state, action: PayloadAction<Trip | null>) => {
      state.currentTrip = action.payload;
    },
    clearTripError: (state) => {
      state.error = null;
    },
    updateTripDeliveryProgress: (state, action: PayloadAction<{ completed: number; failed: number }>) => {
      if (state.currentTrip) {
        state.currentTrip.completedDeliveries = action.payload.completed;
        state.currentTrip.failedDeliveries = action.payload.failed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assigned trips
      .addCase(fetchAssignedTrips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTrips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignedTrips = action.payload;
      })
      .addCase(fetchAssignedTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch trip by ID
      .addCase(fetchTripById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Accept trip
      .addCase(acceptTrip.pending, (state) => {
        state.isAccepting = true;
        state.error = null;
      })
      .addCase(acceptTrip.fulfilled, (state, action) => {
        state.isAccepting = false;
        state.currentTrip = action.payload;
        state.assignedTrips = state.assignedTrips.filter((trip) => trip.id !== action.payload.id);
      })
      .addCase(acceptTrip.rejected, (state, action) => {
        state.isAccepting = false;
        state.error = action.payload as string;
      })

      // Reject trip
      .addCase(rejectTrip.pending, (state) => {
        state.isRejecting = true;
        state.error = null;
      })
      .addCase(rejectTrip.fulfilled, (state, action) => {
        state.isRejecting = false;
        state.assignedTrips = state.assignedTrips.filter((trip) => trip.id !== action.payload);
      })
      .addCase(rejectTrip.rejected, (state, action) => {
        state.isRejecting = false;
        state.error = action.payload as string;
      })

      // Start trip
      .addCase(startTrip.pending, (state) => {
        state.isStarting = true;
        state.error = null;
      })
      .addCase(startTrip.fulfilled, (state, action) => {
        state.isStarting = false;
        state.currentTrip = action.payload;
      })
      .addCase(startTrip.rejected, (state, action) => {
        state.isStarting = false;
        state.error = action.payload as string;
      })

      // Complete trip
      .addCase(completeTrip.pending, (state) => {
        state.isCompleting = true;
        state.error = null;
      })
      .addCase(completeTrip.fulfilled, (state, action) => {
        state.isCompleting = false;
        state.completedTrips.unshift(action.payload);
        state.currentTrip = null;
      })
      .addCase(completeTrip.rejected, (state, action) => {
        state.isCompleting = false;
        state.error = action.payload as string;
      })

      // Fetch completed trips
      .addCase(fetchCompletedTrips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompletedTrips.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          state.completedTrips = action.payload.data;
        } else {
          state.completedTrips = [...state.completedTrips, ...action.payload.data];
        }
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
      })
      .addCase(fetchCompletedTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentTrip, clearTripError, updateTripDeliveryProgress } = tripSlice.actions;

export default tripSlice.reducer;
