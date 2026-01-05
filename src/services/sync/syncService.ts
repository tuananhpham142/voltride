// src/services/sync/syncService.ts

import { ENV_CONFIG } from '@/config/env.config';
import { SyncStatus } from '@/models/Sync/SyncEnum';
import { SyncQueueItem } from '@/models/Sync/SyncModel';
import { baseApi } from '../baseApi';

export class SyncService {
  /**
   * Process a single sync queue item
   */
  static async processSyncItem(item: SyncQueueItem): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const config = {
        url: item.endpoint,
        method: item.method,
        data: item.data,
        timeout: ENV_CONFIG.API_TIMEOUT,
      };

      const response = await baseApi.request(config);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sync failed',
      };
    }
  }

  /**
   * Process a batch of sync queue items
   */
  static async processSyncBatch(
    items: SyncQueueItem[],
  ): Promise<{ successCount: number; failedCount: number; results: any[] }> {
    let successCount = 0;
    let failedCount = 0;
    const results: any[] = [];

    for (const item of items) {
      try {
        const result = await this.processSyncItem(item);

        if (result.success) {
          successCount++;
          results.push({
            id: item.id,
            status: SyncStatus.SYNCED,
            data: result.data,
          });
        } else {
          failedCount++;
          results.push({
            id: item.id,
            status: SyncStatus.FAILED,
            error: result.error,
          });
        }
      } catch (error: any) {
        failedCount++;
        results.push({
          id: item.id,
          status: SyncStatus.FAILED,
          error: error.message || 'Unknown error',
        });
      }

      // Small delay between requests to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return {
      successCount,
      failedCount,
      results,
    };
  }

  /**
   * Check if item should be retried based on exponential backoff
   */
  static shouldRetry(item: SyncQueueItem): boolean {
    if (item.retryCount >= item.maxRetries) {
      return false;
    }

    if (!item.lastRetryAt) {
      return true;
    }

    const lastRetry = new Date(item.lastRetryAt).getTime();
    const now = Date.now();
    const backoffDelay = Math.pow(2, item.retryCount) * ENV_CONFIG.SYNC_RETRY_DELAY;

    return now - lastRetry >= backoffDelay;
  }

  /**
   * Calculate next retry time
   */
  static getNextRetryTime(item: SyncQueueItem): Date {
    const backoffDelay = Math.pow(2, item.retryCount) * ENV_CONFIG.SYNC_RETRY_DELAY;
    return new Date(Date.now() + backoffDelay);
  }
}
