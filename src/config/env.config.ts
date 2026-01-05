// src/config/env.config.ts

export type Environment = 'development' | 'staging' | 'production';

export interface EnvConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  MAPBOX_ACCESS_TOKEN: string;
  FIREBASE_CONFIG: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  LOGGING_ENDPOINT: string;
  SENTRY_DSN?: string;
  LOCATION_TRACKING_INTERVAL: number; // in seconds
  SYNC_RETRY_ATTEMPTS: number;
  SYNC_RETRY_DELAY: number; // in milliseconds
  OFFLINE_QUEUE_MAX_SIZE: number;
  GOOGLE_MAPS_API_KEY: string;
  ENABLE_DEV_TOOLS: boolean;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

const developmentConfig: EnvConfig = {
  API_BASE_URL: 'http://localhost:3000/api/v1',
  API_TIMEOUT: 30000,
  MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoiZGV2LXZvbHRyaWRlIiwiYSI6ImRldmVsb3BtZW50In0.xxx',
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyDevelopmentKey',
    authDomain: 'voltride-dev.firebaseapp.com',
    projectId: 'voltride-dev',
    storageBucket: 'voltride-dev.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:android:dev',
  },
  LOGGING_ENDPOINT: 'http://localhost:3000/api/v1/logs',
  LOCATION_TRACKING_INTERVAL: 30,
  SYNC_RETRY_ATTEMPTS: 3,
  SYNC_RETRY_DELAY: 2000,
  OFFLINE_QUEUE_MAX_SIZE: 1000,
  GOOGLE_MAPS_API_KEY: 'AIzaSyDevelopmentGoogleMaps',
  ENABLE_DEV_TOOLS: true,
  LOG_LEVEL: 'debug',
};

const stagingConfig: EnvConfig = {
  API_BASE_URL: 'https://api-staging.voltride.com/api/v1',
  API_TIMEOUT: 30000,
  MAPBOX_ACCESS_TOKEN: 'pk.eyJ1Ijoic3RhZ2luZy12b2x0cmlkZSIsImEiOiJzdGFnaW5nIn0.xxx',
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyStagingKey',
    authDomain: 'voltride-staging.firebaseapp.com',
    projectId: 'voltride-staging',
    storageBucket: 'voltride-staging.appspot.com',
    messagingSenderId: '987654321',
    appId: '1:987654321:android:staging',
  },
  LOGGING_ENDPOINT: 'https://api-staging.voltride.com/api/v1/logs',
  LOCATION_TRACKING_INTERVAL: 30,
  SYNC_RETRY_ATTEMPTS: 5,
  SYNC_RETRY_DELAY: 3000,
  OFFLINE_QUEUE_MAX_SIZE: 2000,
  GOOGLE_MAPS_API_KEY: 'AIzaSyStagingGoogleMaps',
  ENABLE_DEV_TOOLS: true,
  LOG_LEVEL: 'info',
};

const productionConfig: EnvConfig = {
  API_BASE_URL: 'https://api.voltride.com/api/v1',
  API_TIMEOUT: 30000,
  MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoicHJvZC12b2x0cmlkZSIsImEiOiJwcm9kdWN0aW9uIn0.xxx',
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyProductionKey',
    authDomain: 'voltride-prod.firebaseapp.com',
    projectId: 'voltride-prod',
    storageBucket: 'voltride-prod.appspot.com',
    messagingSenderId: '555555555',
    appId: '1:555555555:android:prod',
    measurementId: 'G-XXXXXXXXXX',
  },
  LOGGING_ENDPOINT: 'https://api.voltride.com/api/v1/logs',
  SENTRY_DSN: 'https://xxx@sentry.io/xxx',
  LOCATION_TRACKING_INTERVAL: 30,
  SYNC_RETRY_ATTEMPTS: 5,
  SYNC_RETRY_DELAY: 5000,
  OFFLINE_QUEUE_MAX_SIZE: 5000,
  GOOGLE_MAPS_API_KEY: 'AIzaSyProductionGoogleMaps',
  ENABLE_DEV_TOOLS: false,
  LOG_LEVEL: 'error',
};

// Determine current environment
export const getCurrentEnvironment = (): Environment => {
  // In a real app, this would be set via build config or environment variables
  if (__DEV__) {
    return 'development';
  }
  // Use build variants or environment variables to determine staging vs production
  // Example: return process.env.APP_ENV as Environment;
  return 'production';
};

// Get config for current environment
export const getEnvConfig = (): EnvConfig => {
  const env = getCurrentEnvironment();

  switch (env) {
    case 'development':
      return developmentConfig;
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
};

// Export current config
export const ENV_CONFIG = getEnvConfig();
export const CURRENT_ENV = getCurrentEnvironment();

// Helper to check environment
export const isDevelopment = () => CURRENT_ENV === 'development';
export const isStaging = () => CURRENT_ENV === 'staging';
export const isProduction = () => CURRENT_ENV === 'production';
