// src/services/user/userService.ts
import { User } from '@/types/auth';
import { baseApi } from '../baseApi';

export interface UpdateUserProfileRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  weight?: number;
  height?: number;
}

export interface UserProfileResponse {
  user: User;
  message?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
  user: User;
  message?: string;
}

export class UserService {
  /**
   * get my profile
   */
  static async getMyProfile(): Promise<User> {
    try {
      const response = await baseApi.get<User>('/auth/me');

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }
  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<User> {
    const response = await baseApi.get<User>(`/users/${userId}`);
    return response.data;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(data: UpdateUserProfileRequest): Promise<User> {
    const { id, ...updateData } = data;
    const response = await baseApi.patch<UserProfileResponse>(`/users`, updateData);
    return response.data.user || response.data;
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(userId: string, formData: FormData): Promise<UploadAvatarResponse> {
    const response = await baseApi.post<UploadAvatarResponse>(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Delete user avatar
   */
  static async deleteAvatar(userId: string): Promise<void> {
    await baseApi.delete(`/users/${userId}/avatar`);
  }

  /**
   * Update user password
   */
  static async updatePassword(userId: string, data: { currentPassword: string; newPassword: string }): Promise<void> {
    await baseApi.patch(`/users/${userId}/password`, data);
  }

  /**
   * Delete user account
   */
  static async deleteUser(userId: string): Promise<void> {
    await baseApi.delete(`/users/${userId}`);
  }

  /**
   * Get user statistics
   */
  static async getUserStatistics(userId: string): Promise<any> {
    const response = await baseApi.get(`/users/${userId}/statistics`);
    return response.data;
  }

  private static handleAuthError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('Authentication failed');
  }
}
