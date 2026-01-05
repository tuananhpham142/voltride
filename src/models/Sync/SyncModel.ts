// src/models/Sync/SyncModel.ts

import { SyncEntityType, SyncOperation, SyncPriority, SyncStatus } from './SyncEnum';

export interface SyncQueueItem {
  id: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  priority: SyncPriority;
  status: SyncStatus;
  data: any; // The actual data to sync
  endpoint: string; // API endpoint to call
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  retryCount: number;
  maxRetries: number;
  lastRetryAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  scheduledSyncAt?: string; // For delayed syncs
}

export interface SyncBatch {
  id: string;
  items: SyncQueueItem[];
  status: SyncStatus;
  startedAt?: string;
  completedAt?: string;
  totalItems: number;
  successCount: number;
  failedCount: number;
}

export interface SyncConflict {
  id: string;
  queueItemId: string;
  localVersion: any;
  serverVersion: any;
  conflictType: 'VERSION_MISMATCH' | 'DELETED_ON_SERVER' | 'MODIFIED_ON_SERVER';
  resolvedBy?: 'SERVER' | 'LOCAL' | 'MANUAL';
  resolvedAt?: string;
  createdAt: string;
}

export interface SyncStatistics {
  totalPending: number;
  totalSynced: number;
  totalFailed: number;
  lastSyncTime?: string;
  nextScheduledSync?: string;
  byEntityType: {
    [key in SyncEntityType]?: {
      pending: number;
      synced: number;
      failed: number;
    };
  };
}

export interface SyncState {
  // Queue
  queue: SyncQueueItem[];
  conflicts: SyncConflict[];
  statistics: SyncStatistics;

  // Sync state
  isSyncing: boolean;
  currentBatch: SyncBatch | null;
  isOnline: boolean;
  lastSyncTime: string | null;
  lastSyncResult: {
    success: number;
    failed: number;
    timestamp: string;
  } | null;

  // Settings
  autoSyncEnabled: boolean;
  syncInterval: number; // in seconds
  syncOnlyOnWifi: boolean;

  // Error
  error: string | null;
}

// Helper functions
export const getSyncPriorityOrder = (priority: SyncPriority): number => {
  switch (priority) {
    case SyncPriority.CRITICAL:
      return 1;
    case SyncPriority.HIGH:
      return 2;
    case SyncPriority.MEDIUM:
      return 3;
    case SyncPriority.LOW:
      return 4;
    default:
      return 5;
  }
};

export const sortQueueByPriority = (queue: SyncQueueItem[]): SyncQueueItem[] => {
  return [...queue].sort((a, b) => {
    // First sort by priority
    const priorityDiff = getSyncPriorityOrder(a.priority) - getSyncPriorityOrder(b.priority);
    if (priorityDiff !== 0) return priorityDiff;

    // Then by creation time (older first)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

export const canRetryItem = (item: SyncQueueItem): boolean => {
  return item.status === SyncStatus.FAILED && item.retryCount < item.maxRetries;
};

export const shouldAutoRetry = (item: SyncQueueItem): boolean => {
  if (!canRetryItem(item)) return false;

  // Check if enough time has passed since last retry
  if (item.lastRetryAt) {
    const lastRetry = new Date(item.lastRetryAt).getTime();
    const now = Date.now();
    const minRetryDelay = Math.pow(2, item.retryCount) * 1000; // Exponential backoff
    return now - lastRetry >= minRetryDelay;
  }

  return true;
};

export const getSyncStatusColor = (status: SyncStatus): string => {
  switch (status) {
    case SyncStatus.PENDING:
      return '#FF9500'; // Orange
    case SyncStatus.SYNCING:
      return '#007AFF'; // Blue
    case SyncStatus.SYNCED:
      return '#34C759'; // Green
    case SyncStatus.FAILED:
      return '#FF3B30'; // Red
    case SyncStatus.REQUIRES_SUPPORT:
      return '#FF9500'; // Orange
    default:
      return '#8E8E93'; // Gray
  }
};

export const getSyncStatusLabel = (status: SyncStatus): string => {
  switch (status) {
    case SyncStatus.PENDING:
      return 'Pending Sync';
    case SyncStatus.SYNCING:
      return 'Syncing...';
    case SyncStatus.SYNCED:
      return 'Synced';
    case SyncStatus.FAILED:
      return 'Sync Failed';
    case SyncStatus.REQUIRES_SUPPORT:
      return 'Requires Support';
    default:
      return 'Unknown';
  }
};

export const createSyncQueueItem = (
  entityType: SyncEntityType,
  entityId: string,
  operation: SyncOperation,
  data: any,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  priority: SyncPriority = SyncPriority.MEDIUM,
): SyncQueueItem => {
  return {
    id: `${entityType}_${entityId}_${Date.now()}`,
    entityType,
    entityId,
    operation,
    priority,
    status: SyncStatus.PENDING,
    data,
    endpoint,
    method,
    retryCount: 0,
    maxRetries: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
