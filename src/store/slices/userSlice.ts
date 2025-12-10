// src/store/slices/userSlice.ts
import { UpdateUserProfileRequest, UserService } from '@/services/user/userService';
import { User } from '@/types/auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  isUpdating: boolean;
  isUploadingAvatar: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  isUpdating: false,
  isUploadingAvatar: false,
  error: null,
};

// Async thunks
export const getMyProfile = createAsyncThunk('user/getMyProfile', async (payload: any, { rejectWithValue }) => {
  try {
    const response = await UserService.getMyProfile();

    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch user profile');
  }
});
// Async thunks
export const getUserProfile = createAsyncThunk('user/getUserProfile', async (userId: string, { rejectWithValue }) => {
  try {
    const response = await UserService.getUserProfile(userId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch user profile');
  }
});

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data: UpdateUserProfileRequest, { rejectWithValue }) => {
    try {
      const response = await UserService.updateUserProfile(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async ({ userId, formData }: { userId: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await UserService.uploadAvatar(userId, formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  },
);

export const deleteAvatar = createAsyncThunk('user/deleteAvatar', async (userId: string, { rejectWithValue }) => {
  try {
    await UserService.deleteAvatar(userId);
    return userId;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete avatar');
  }
});

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (
    { userId, currentPassword, newPassword }: { userId: string; currentPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      await UserService.updatePassword(userId, { currentPassword, newPassword });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update password');
    }
  },
);

export const getUserStatistics = createAsyncThunk(
  'user/getUserStatistics',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await UserService.getUserStatistics(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user statistics');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    updateUserField: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
      state.isUpdating = false;
      state.isUploadingAvatar = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get my profile
      .addCase(getMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isUpdating = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isUploadingAvatar = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isUploadingAvatar = false;
        if (state.currentUser && action.payload.user) {
          state.currentUser = action.payload.user;
        }
        state.error = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isUploadingAvatar = false;
        state.error = action.payload as string;
      })

      // Delete avatar
      .addCase(deleteAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.isLoading = false;
        if (state.currentUser && state.currentUser.avatar) {
          state.currentUser.avatar = undefined;
        }
        state.error = null;
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update password
      .addCase(updatePassword.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Get user statistics
      .addCase(getUserStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserStatistics.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentUser, updateUserField, clearUser } = userSlice.actions;

export default userSlice.reducer;
