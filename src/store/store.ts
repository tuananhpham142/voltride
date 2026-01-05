// src/store/store.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';

// Import existing slices
import appSlice from './slices/appSlice';
import authSlice from './slices/authSlice';
import languageSlice from './slices/languageSlice';
import notificationReducer from './slices/notificationSlice';
import themeReducer from './slices/themeSlice';
import userSlice from './slices/userSlice';

// Import driver app slices
import deliverySlice from './slices/deliverySlice';
import driverSlice from './slices/driverSlice';
import syncSlice from './slices/syncSlice';
import trackingSlice from './slices/trackingSlice';
import tripSlice from './slices/tripSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'auth',
    'theme',
    'language',
    'driver',
    'sync', // Persist sync queue for offline support
  ],
  blacklist: [
    'trip', // Don't persist trip state
    'delivery', // Don't persist delivery state
    'tracking', // Don't persist tracking state
  ],
};

const rootReducer = combineReducers({
  // Existing slices
  auth: authSlice,
  app: appSlice,
  theme: themeReducer,
  language: languageSlice,
  user: userSlice,
  notifications: notificationReducer,

  // Driver app slices
  driver: driverSlice,
  trip: tripSlice,
  delivery: deliverySlice,
  tracking: trackingSlice,
  sync: syncSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
