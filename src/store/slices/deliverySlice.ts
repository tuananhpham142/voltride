// src/store/slices/deliverySlice.ts

import { DeliveryPoint, DeliveryState, Recipient } from '@/models/Delivery/DeliveryModel';
import {
  CompleteDeliveryRequest,
  CreatePODRequest,
  FailDeliveryRequest,
  ProcessCODPaymentRequest,
  StartDeliveryRequest,
} from '@/models/Delivery/DeliveryTypes';
import { DeliveryService } from '@/services/delivery/deliveryService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: DeliveryState = {
  // Data
  currentDelivery: null,
  deliveries: [],

  // POD capture state
  capturedPhotos: [],
  capturedSignature: null,
  capturedNotes: null,
  recipientInfo: null,

  // Loading states
  isLoading: false,
  isCapturing: false,
  isCompleting: false,
  isFailingDelivery: false,

  // Error
  error: null,
};

// Async thunks
export const startDelivery = createAsyncThunk(
  'delivery/start',
  async (data: StartDeliveryRequest, { rejectWithValue }) => {
    try {
      const response = await DeliveryService.startDelivery(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start delivery');
    }
  },
);

export const createPOD = createAsyncThunk('delivery/createPOD', async (data: CreatePODRequest, { rejectWithValue }) => {
  try {
    const response = await DeliveryService.createProofOfDelivery(data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to create proof of delivery');
  }
});

export const completeDelivery = createAsyncThunk(
  'delivery/complete',
  async (data: CompleteDeliveryRequest, { rejectWithValue }) => {
    try {
      const response = await DeliveryService.completeDelivery(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete delivery');
    }
  },
);

export const failDelivery = createAsyncThunk(
  'delivery/fail',
  async (data: FailDeliveryRequest, { rejectWithValue }) => {
    try {
      const response = await DeliveryService.failDelivery(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark delivery as failed');
    }
  },
);

export const processCODPayment = createAsyncThunk(
  'delivery/processCOD',
  async (data: ProcessCODPaymentRequest, { rejectWithValue }) => {
    try {
      const response = await DeliveryService.processCODPayment(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to process COD payment');
    }
  },
);

export const scanRecipientQR = createAsyncThunk(
  'delivery/scanQR',
  async ({ deliveryPointId, qrData }: { deliveryPointId: string; qrData: string }, { rejectWithValue }) => {
    try {
      const response = await DeliveryService.scanRecipientQR({ deliveryPointId, qrData });
      return response.recipientInfo;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to scan QR code');
    }
  },
);

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setCurrentDelivery: (state, action: PayloadAction<DeliveryPoint | null>) => {
      state.currentDelivery = action.payload;
    },
    setDeliveries: (state, action: PayloadAction<DeliveryPoint[]>) => {
      state.deliveries = action.payload;
    },
    addCapturedPhoto: (state, action: PayloadAction<string>) => {
      state.capturedPhotos.push(action.payload);
    },
    removeCapturedPhoto: (state, action: PayloadAction<number>) => {
      state.capturedPhotos.splice(action.payload, 1);
    },
    setCapturedSignature: (state, action: PayloadAction<string | null>) => {
      state.capturedSignature = action.payload;
    },
    setCapturedNotes: (state, action: PayloadAction<string | null>) => {
      state.capturedNotes = action.payload;
    },
    setRecipientInfo: (state, action: PayloadAction<Recipient | null>) => {
      state.recipientInfo = action.payload;
    },
    clearPODCapture: (state) => {
      state.capturedPhotos = [];
      state.capturedSignature = null;
      state.capturedNotes = null;
      state.recipientInfo = null;
    },
    clearDeliveryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start delivery
      .addCase(startDelivery.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startDelivery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDelivery = action.payload;
        // Update delivery in list
        const index = state.deliveries.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
      })
      .addCase(startDelivery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create POD
      .addCase(createPOD.pending, (state) => {
        state.isCapturing = true;
        state.error = null;
      })
      .addCase(createPOD.fulfilled, (state, action) => {
        state.isCapturing = false;
        if (state.currentDelivery) {
          state.currentDelivery.proofOfDelivery = action.payload;
        }
      })
      .addCase(createPOD.rejected, (state, action) => {
        state.isCapturing = false;
        state.error = action.payload as string;
      })

      // Complete delivery
      .addCase(completeDelivery.pending, (state) => {
        state.isCompleting = true;
        state.error = null;
      })
      .addCase(completeDelivery.fulfilled, (state, action) => {
        state.isCompleting = false;
        state.currentDelivery = null;
        // state.clearPODCapture
        // Update delivery in list
        const index = state.deliveries.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
      })
      .addCase(completeDelivery.rejected, (state, action) => {
        state.isCompleting = false;
        state.error = action.payload as string;
      })

      // Fail delivery
      .addCase(failDelivery.pending, (state) => {
        state.isFailingDelivery = true;
        state.error = null;
      })
      .addCase(failDelivery.fulfilled, (state, action) => {
        state.isFailingDelivery = false;
        state.currentDelivery = null;
        // Update delivery in list
        const index = state.deliveries.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
      })
      .addCase(failDelivery.rejected, (state, action) => {
        state.isFailingDelivery = false;
        state.error = action.payload as string;
      })

      // Process COD payment
      .addCase(processCODPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processCODPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentDelivery) {
          state.currentDelivery.codPayment = action.payload;
        }
      })
      .addCase(processCODPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Scan recipient QR
      .addCase(scanRecipientQR.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(scanRecipientQR.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipientInfo = action.payload;
      })
      .addCase(scanRecipientQR.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentDelivery,
  setDeliveries,
  addCapturedPhoto,
  removeCapturedPhoto,
  setCapturedSignature,
  setCapturedNotes,
  setRecipientInfo,
  clearPODCapture,
  clearDeliveryError,
} = deliverySlice.actions;

export default deliverySlice.reducer;
