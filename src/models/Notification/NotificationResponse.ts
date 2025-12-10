// src/models/Notification/NotificationResponse.ts

import { ApiGetByPageResponse, ApiResponse } from '@/types/api';
import {
  Notification,
  NotificationBadge,
  NotificationPreferences,
  NotificationStatistics
} from './NotificationModel';

export interface NotificationListResponse extends ApiGetByPageResponse<Notification> {
  unreadCount: number;
}

export interface NotificationDetailResponse extends ApiResponse<Notification> {}

export interface NotificationMutationResponse extends ApiResponse<Notification> {}

export interface MarkAsReadResponse extends ApiResponse<Notification> {}

export interface MarkAllAsReadResponse extends ApiResponse<Notification[]> {
  success: boolean;
  markedCount: number;
}

export interface UnreadCountResponse {
  count: number;
  hasNew: boolean;
  lastNotificationAt?: string;
}

export interface NotificationStatisticsResponse extends ApiResponse<NotificationStatistics> {}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
  deletedCount?: number;
}

export interface BulkNotificationResponse {
  success: boolean;
  sent: number;
  failed: number;
  notifications: Notification[];
  errors?: Array<{
    userId: string;
    error: string;
  }>;
}

export interface NotificationPreferencesResponse extends ApiResponse<NotificationPreferences> {}

export interface SubscriptionResponse {
  success: boolean;
  topic: string;
  subscribed: boolean;
  message?: string;
}

export interface NotificationBadgeResponse {
  badge: NotificationBadge;
}

export interface TestNotificationResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ExportNotificationsResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  exportedCount: number;
  format: string;
}

export interface ArchiveNotificationsResponse {
  success: boolean;
  archivedCount: number;
  message?: string;
}

export interface RestoreNotificationsResponse {
  success: boolean;
  restoredCount: number;
  notifications: Notification[];
}

export interface ClearNotificationsResponse {
  success: boolean;
  clearedCount: number;
  message?: string;
}

export interface NotificationGroupedResponse {
  today: Notification[];
  yesterday: Notification[];
  thisWeek: Notification[];
  older: Notification[];
  unreadCount: {
    today: number;
    yesterday: number;
    thisWeek: number;
    older: number;
  };
}

export interface NotificationSyncResponse {
  success: boolean;
  syncedCount: number;
  newNotifications: Notification[];
  updatedNotifications: Notification[];
  deletedNotificationIds: string[];
  lastSyncTime: string;
}

export interface NotificationSocketResponse {
  type: 'notification:new' | 'notification:updated' | 'notification:deleted' | 'notification:read' | 'unread_count';
  data: any;
  timestamp: string;
}

export interface NotificationHealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: boolean;
    push: boolean;
    email: boolean;
    sms: boolean;
    socket: boolean;
  };
  timestamp: string;
}

export interface NotificationQuotaResponse {
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
  quotaType: 'daily' | 'monthly';
}

export interface NotificationErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}
