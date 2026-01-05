// src/store/slices/syncSlice.ts

import { SyncPriority, SyncStatus } from '@/models/Sync/SyncEnum';
import { SyncQueueItem, SyncState, SyncStatistics } from '@/models/Sync/SyncModel';
import { SyncService } from '@/services/sync/syncService';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: SyncState = {
  // Queue
  queue: [],
  conflicts: [],
  statistics: {
    totalPending: 0,
    totalSynced: 0,
    totalFailed: 0,
    byEntityType: {},
  },

  // Sync state
  isSyncing: false,
  currentBatch: null,
  isOnline: true,
  lastSyncTime: null,
  lastSyncResult: null,

  // Settings
  autoSyncEnabled: true,
  syncInterval: 60, // seconds
  syncOnlyOnWifi: false,

  // Error
  error: null,
};

// Async thunks
export const processSyncQueue = createAsyncThunk(
  'sync/processQueue',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as any;
      const queue = state.sync.queue;
      const isOnline = state.sync.isOnline;

      if (!isOnline) {
        return rejectWithValue('Device is offline');
      }

      if (queue.length === 0) {
        return { successCount: 0, failedCount: 0 };
      }

      // Get pending items sorted by priority
      const pendingItems = queue
        .filter((item: SyncQueueItem) => item.status === SyncStatus.PENDING || item.status === SyncStatus.FAILED)
        .sort((a: SyncQueueItem, b: SyncQueueItem) => {
          // Sort by priority first
          const priorityOrder: Record<SyncPriority, number> = {
            [SyncPriority.CRITICAL]: 0,
            [SyncPriority.HIGH]: 1,
            [SyncPriority.MEDIUM]: 2,
            [SyncPriority.LOW]: 3,
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

      // Process in batches of 10
      const batchSize = 10;
      const batch = pendingItems.slice(0, batchSize);

      const results = await SyncService.processSyncBatch(batch);

      return results;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to process sync queue');
    }
  },
);

export const addToSyncQueue = createAsyncThunk(
  'sync/addToQueue',
  async (item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'updatedAt'>, { getState }) => {
    const state = getState() as any;
    const queueItem: SyncQueueItem = {
      ...item,
      id: `${item.entityType}_${item.entityId}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If online, try to sync immediately for critical items
    if (state.sync.isOnline && item.priority === SyncPriority.CRITICAL) {
      try {
        await SyncService.processSyncItem(queueItem);
        return { ...queueItem, status: SyncStatus.SYNCED };
      } catch (error) {
        return queueItem;
      }
    }

    return queueItem;
  },
);

export const retryFailedItems = createAsyncThunk('sync/retryFailed', async (_, { getState, dispatch }) => {
  const state = getState() as any;
  const failedItems = state.sync.queue.filter((item: SyncQueueItem) => item.status === SyncStatus.FAILED);

  const retryableItems = failedItems.filter((item: SyncQueueItem) => item.retryCount < item.maxRetries);

  if (retryableItems.length > 0) {
    await dispatch(processSyncQueue());
  }

  return retryableItems.length;
});

export const clearSyncedItems = createAsyncThunk('sync/clearSynced', async (_, { getState }) => {
  const state = getState() as any;
  const syncedCount = state.sync.queue.filter((item: SyncQueueItem) => item.status === SyncStatus.SYNCED).length;
  return syncedCount;
});

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setAutoSync: (state, action: PayloadAction<boolean>) => {
      state.autoSyncEnabled = action.payload;
    },
    setSyncOnlyOnWifi: (state, action: PayloadAction<boolean>) => {
      state.syncOnlyOnWifi = action.payload;
    },
    setSyncInterval: (state, action: PayloadAction<number>) => {
      state.syncInterval = action.payload;
    },
    removeQueueItem: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((item) => item.id !== action.payload);
      state.statistics = calculateStatistics(state.queue);
    },
    updateQueueItemStatus: (
      state,
      action: PayloadAction<{ id: string; status: SyncStatus; errorMessage?: string }>,
    ) => {
      const item = state.queue.find((i) => i.id === action.payload.id);
      if (item) {
        item.status = action.payload.status;
        item.errorMessage = action.payload.errorMessage;
        item.updatedAt = new Date().toISOString();
        if (action.payload.status === SyncStatus.FAILED) {
          item.retryCount += 1;
          item.lastRetryAt = new Date().toISOString();
        }
      }
      state.statistics = calculateStatistics(state.queue);
    },
    clearSyncError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process sync queue
      .addCase(processSyncQueue.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(processSyncQueue.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.lastSyncTime = new Date().toISOString();
        state.lastSyncResult = {
          success: action.payload.successCount,
          failed: action.payload.failedCount,
          timestamp: new Date().toISOString(),
        };

        // Update statistics
        state.statistics = calculateStatistics(state.queue);
      })
      .addCase(processSyncQueue.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      })

      // Add to sync queue
      .addCase(addToSyncQueue.fulfilled, (state, action) => {
        // Check if item already exists
        const existingIndex = state.queue.findIndex((item) => item.id === action.payload.id);

        if (existingIndex !== -1) {
          state.queue[existingIndex] = action.payload;
        } else {
          state.queue.push(action.payload);
        }

        state.statistics = calculateStatistics(state.queue);
      })

      // Retry failed items
      .addCase(retryFailedItems.fulfilled, (state, action) => {
        // Statistics will be updated by processSyncQueue
      })

      // Clear synced items
      .addCase(clearSyncedItems.fulfilled, (state, action) => {
        state.queue = state.queue.filter((item) => item.status !== SyncStatus.SYNCED);
        state.statistics = calculateStatistics(state.queue);
      });
  },
});

// Helper function to calculate statistics
const calculateStatistics = (queue: SyncQueueItem[]): SyncStatistics => {
  const stats: SyncStatistics = {
    totalPending: 0,
    totalSynced: 0,
    totalFailed: 0,
    byEntityType: {},
  };

  queue.forEach((item) => {
    // Count by status
    if (item.status === SyncStatus.PENDING) stats.totalPending++;
    if (item.status === SyncStatus.SYNCED) stats.totalSynced++;
    if (item.status === SyncStatus.FAILED) stats.totalFailed++;

    // Count by entity type
    if (!stats.byEntityType[item.entityType]) {
      stats.byEntityType[item.entityType] = {
        pending: 0,
        synced: 0,
        failed: 0,
      };
    }

    if (item.status === SyncStatus.PENDING) {
      stats.byEntityType[item.entityType]!.pending++;
    } else if (item.status === SyncStatus.SYNCED) {
      stats.byEntityType[item.entityType]!.synced++;
    } else if (item.status === SyncStatus.FAILED) {
      stats.byEntityType[item.entityType]!.failed++;
    }
  });

  return stats;
};

export const {
  setOnlineStatus,
  setAutoSync,
  setSyncOnlyOnWifi,
  setSyncInterval,
  removeQueueItem,
  updateQueueItemStatus,
  clearSyncError,
} = syncSlice.actions;

export default syncSlice.reducer;

// Network monitoring middleware
export const setupNetworkMonitoring = (dispatch: any) => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    dispatch(setOnlineStatus(state.isConnected ?? false));

    // Trigger sync when coming back online
    if (state.isConnected) {
      setTimeout(() => {
        dispatch(processSyncQueue());
      }, 1000);
    }
  });

  return unsubscribe;
};
