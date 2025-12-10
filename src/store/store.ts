import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from '../services/auth/authApi';
import appSlice from './slices/appSlice';
import authSlice from './slices/authSlice';
import languageSlice from './slices/languageSlice';
import notificationReducer from './slices/notificationSlice';
import themeReducer from './slices/themeSlice';
import userSlice from './slices/userSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme', 'language'], // Only persist these slices
};

const rootReducer = combineReducers({
  auth: authSlice,
  app: appSlice,
  theme: themeReducer,
  language: languageSlice,
  user: userSlice,
  notifications: notificationReducer,
  [authApi.reducerPath]: authApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
      },
    }).concat(authApi.middleware),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
