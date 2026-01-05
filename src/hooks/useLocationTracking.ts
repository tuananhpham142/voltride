// src/hooks/useLocationTracking.ts

import { SyncEntityType, SyncOperation, SyncPriority } from '@/models/Sync/SyncEnum';
import { LocationAccuracy } from '@/models/Tracking/TrackingEnum';
import { LocationPoint } from '@/models/Tracking/TrackingModel';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import { addToSyncQueue } from '@/store/slices/syncSlice';
import {
  addOfflineLocation,
  setCurrentLocation,
  setTracking,
  syncOfflineLocations
} from '@/store/slices/trackingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import Geolocation from '@react-native-community/geolocation';
import { useCallback, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const useLocationTracking = () => {
  const dispatch = useAppDispatch();
  const {
    isTracking,
    trackingInterval,
    currentLocation,
    isOnline,
  } = useAppSelector((state) => ({
    isTracking: state.tracking.isTracking,
    trackingInterval: state.tracking.trackingInterval,
    currentLocation: state.tracking.currentLocation,
    isOnline: state.sync.isOnline,
  }));

  const { currentDriver } = useAppSelector((state) => state.driver);
  const { currentTrip } = useAppSelector((state) => state.trip);

  const watchId = useRef<number | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  /**
   * Request location permissions
   */
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'VoltRide needs access to your location for delivery tracking',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        LoggingService.error(LogCategory.TRACKING, 'Failed to request location permission', err as Error);
        return false;
      }
    }
    return true;
  }, []);

  /**
   * Get current location
   */
  //@ts-ignore
  const getCurrentLocation = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }, []);

  /**
   * Process and save location point
   */
  const saveLocationPoint = useCallback(
  //@ts-ignore
    async (position: GeolocationPosition) => {
      if (!currentDriver) return;

      const locationPoint: LocationPoint = {
        id: `loc_${Date.now()}`,
        driverId: currentDriver.id,
        tripId: currentTrip?.id,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
        timestamp: new Date(position.timestamp).toISOString(),
        locationAccuracy:
          position.coords.accuracy < 20
            ? LocationAccuracy.HIGH
            : position.coords.accuracy < 50
            ? LocationAccuracy.MEDIUM
            : LocationAccuracy.LOW,
        isSynced: false,
        capturedOffline: !isOnline,
      };

      // Update current location in state
      dispatch(setCurrentLocation(locationPoint));

      // If online, sync immediately; otherwise, add to offline queue
      if (isOnline) {
        try {
          await dispatch(
            addToSyncQueue({
              entityType: SyncEntityType.LOCATION,
              entityId: locationPoint.id,
              operation: SyncOperation.CREATE,
              priority: SyncPriority.LOW,
              //@ts-ignore
              status: 'PENDING',
              data: {
                driverId: locationPoint.driverId,
                tripId: locationPoint.tripId,
                latitude: locationPoint.latitude,
                longitude: locationPoint.longitude,
                accuracy: locationPoint.accuracy,
                timestamp: locationPoint.timestamp,
              },
              endpoint: '/tracking/locations',
              method: 'POST',
              retryCount: 0,
              maxRetries: 3,
            }),
          );
        } catch (error) {
          LoggingService.error(LogCategory.TRACKING, 'Failed to sync location', error as Error, {
            locationId: locationPoint.id,
          });
          dispatch(addOfflineLocation(locationPoint));
        }
      } else {
        dispatch(addOfflineLocation(locationPoint));
      }
    },
    [currentDriver, currentTrip, isOnline, dispatch],
  );

  /**
   * Start location tracking
   */
  const startTracking = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      LoggingService.warn(LogCategory.TRACKING, 'Location permission denied');
      return;
    }

    LoggingService.info(LogCategory.TRACKING, 'Starting location tracking', {
      interval: trackingInterval,
    });

    dispatch(setTracking(true));

    // Get initial location
    try {
      const position = await getCurrentLocation();
      await saveLocationPoint(position);
    } catch (error) {
      LoggingService.error(LogCategory.TRACKING, 'Failed to get initial location', error as Error);
    }

    // Start periodic tracking
    intervalId.current = setInterval(async () => {
      try {
        const position = await getCurrentLocation();
        await saveLocationPoint(position);
      } catch (error) {
        LoggingService.error(LogCategory.TRACKING, 'Failed to get location', error as Error);
      }
    }, trackingInterval * 1000);

    // Also watch for significant location changes
    watchId.current = Geolocation.watchPosition(
      async (position) => {
        await saveLocationPoint(position);
      },
      (error) => {
        LoggingService.error(LogCategory.TRACKING, 'Location watch error', error as any);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: trackingInterval * 1000,
      },
    );
  }, [requestLocationPermission, getCurrentLocation, saveLocationPoint, trackingInterval, dispatch]);

  /**
   * Stop location tracking
   */
  const stopTracking = useCallback(() => {
    LoggingService.info(LogCategory.TRACKING, 'Stopping location tracking');

    dispatch(setTracking(false));

    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, [dispatch]);

  /**
   * Sync offline locations when back online
   */
  useEffect(() => {
    if (isOnline && !isTracking) {
      dispatch(syncOfflineLocations());
    }
  }, [isOnline, isTracking, dispatch]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    isTracking,
    currentLocation,
    startTracking,
    stopTracking,
    getCurrentLocation,
  };
};
