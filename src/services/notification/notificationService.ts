// src/services/notification/notificationService.ts

import { useToast } from '@/components/Toast/useToast';
import {
  ClearNotificationsRequest,
  DEFAULT_NOTIFICATION_PARAMS,
  DeleteBulkNotificationsRequest,
  GetNotificationsRequest,
  MarkAllAsReadRequest,
  UpdatePreferencesRequest,
} from '@/models/Notification/NotificationRequest';
import {
  ClearNotificationsResponse,
  DeleteNotificationResponse,
  MarkAllAsReadResponse,
  MarkAsReadResponse,
  NotificationDetailResponse,
  NotificationGroupedResponse,
  NotificationListResponse,
  NotificationPreferencesResponse,
  NotificationStatisticsResponse,
  UnreadCountResponse,
} from '@/models/Notification/NotificationResponse';
import { RootStackNavigationProp } from '@/types/navigation';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { baseApi } from '../baseApi';

export class NotificationService {
  private static readonly BASE_PATH = '/notifications';

  /**
   * Get notifications with filtering and pagination
   */
  static async getNotifications(params: GetNotificationsRequest = {}): Promise<NotificationListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_NOTIFICATION_PARAMS,
        ...params,
      });

      const response = await baseApi.get<NotificationListResponse>(`${this.BASE_PATH}?${queryParams.toString()}`);

      const data = response.data;

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get notification by ID
   */
  static async getNotificationById(id: string): Promise<NotificationDetailResponse> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Notification ID is required');
      }

      const response = await baseApi.get<NotificationDetailResponse>(`${this.BASE_PATH}/${id}`);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string): Promise<MarkAsReadResponse> {
    try {
      if (!id) {
        throw new Error('Notification ID is required');
      }

      const response = await baseApi.patch<MarkAsReadResponse>(`${this.BASE_PATH}/${id}/read`);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(params?: MarkAllAsReadRequest): Promise<MarkAllAsReadResponse> {
    try {
      const queryParams = params ? this.buildQueryParams(params) : '';

      const response = await baseApi.patch<MarkAllAsReadResponse>(
        `${this.BASE_PATH}/mark-all-read${queryParams ? '?' + queryParams : ''}`,
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(): Promise<UnreadCountResponse> {
    try {
      const response = await baseApi.get<UnreadCountResponse>(`${this.BASE_PATH}/unread-count`);

      const data = response.data;

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get notification statistics
   */
  static async getStatistics(): Promise<NotificationStatisticsResponse> {
    try {
      const response = await baseApi.get<NotificationStatisticsResponse>(`${this.BASE_PATH}/statistics`);

      const stats = response.data;

      return stats;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get grouped notifications (today, yesterday, this week, older)
   */
  static async getGroupedNotifications(): Promise<NotificationGroupedResponse> {
    try {
      const response = await baseApi.get<NotificationGroupedResponse>(`${this.BASE_PATH}/grouped`);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(id: string): Promise<DeleteNotificationResponse> {
    try {
      if (!id) {
        throw new Error('Notification ID is required');
      }

      const response = await baseApi.delete<DeleteNotificationResponse>(`${this.BASE_PATH}/${id}`);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete multiple notifications
   */
  static async deleteBulkNotifications(params: DeleteBulkNotificationsRequest): Promise<DeleteNotificationResponse> {
    try {
      const response = await baseApi.post<DeleteNotificationResponse>(`${this.BASE_PATH}/bulk-delete`, params);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Clear notifications
   */
  static async clearNotifications(params: ClearNotificationsRequest): Promise<ClearNotificationsResponse> {
    try {
      const response = await baseApi.post<ClearNotificationsResponse>(`${this.BASE_PATH}/clear`, params);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get notification preferences
   */
  static async getPreferences(): Promise<NotificationPreferencesResponse> {
    try {
      const response = await baseApi.get<NotificationPreferencesResponse>(`${this.BASE_PATH}/preferences`);

      const preferences = response.data;

      return preferences;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(params: UpdatePreferencesRequest): Promise<NotificationPreferencesResponse> {
    try {
      const response = await baseApi.patch<NotificationPreferencesResponse>(`${this.BASE_PATH}/preferences`, params);

      const preferences = response.data;

      return preferences;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: any): URLSearchParams {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item.toString()));
        } else if (typeof value === 'boolean') {
          queryParams.append(key, value.toString());
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return queryParams;
  }

  /**
   * Handle API errors with proper error messages
   */
  private static handleError(error: any): Error {
    // Handle network errors
    if (!error.response) {
      return new Error('Network error. Please check your connection.');
    }

    // Handle API error responses
    const errorResponse = error.response?.data;

    if (errorResponse?.message) {
      const message = Array.isArray(errorResponse.message) ? errorResponse.message.join(', ') : errorResponse.message;
      return new Error(message);
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        return new Error('Invalid request parameters.');
      case 401:
        return new Error('Authentication required. Please login again.');
      case 403:
        return new Error('Access denied.');
      case 404:
        return new Error('Notification not found.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }
}

export const setupNotificationHandler = () => {
  // Handle foreground notifications
  messaging().onMessage(async (remoteMessage) => {
    const { showNotification } = useToast();
    const navigation = useNavigation<RootStackNavigationProp>();
    // Show toast in app
    showNotification(
      remoteMessage.notification?.title || 'Thông báo mới',
      remoteMessage.notification?.body || '',
      () => {
        // Navigate based on notification data
        if (remoteMessage.data?.screen) {
          navigation.navigate(remoteMessage.data.screen as any);
        }
      },
      remoteMessage.notification?.android?.imageUrl || remoteMessage.notification?.image,
    );
  });
};
