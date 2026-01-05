// src/services/logging/loggingService.ts

import { CURRENT_ENV, ENV_CONFIG } from '@/config/env.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { baseApi } from '../baseApi';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum LogCategory {
  APP = 'app',
  NETWORK = 'network',
  BUSINESS_FLOW = 'business_flow',
  SYNC = 'sync',
  TRACKING = 'tracking',
  CRASH = 'crash',
  PERFORMANCE = 'performance',
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  stackTrace?: string;
  deviceInfo: {
    platform: string;
    version: string;
    deviceId?: string;
  };
  userInfo?: {
    driverId?: string;
    tripId?: string;
  };
  environment: string;
}

export class LoggingService {
  private static logQueue: LogEntry[] = [];
  private static isFlushingLogs = false;
  private static readonly MAX_QUEUE_SIZE = 50;
  private static readonly FLUSH_INTERVAL = 30000; // 30 seconds
  private static flushInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize logging service
   */
  static initialize() {
    // Start auto-flush interval
    this.flushInterval = setInterval(() => {
      this.flushLogs();
    }, this.FLUSH_INTERVAL);

    // Load any persisted logs
    this.loadPersistedLogs();
  }

  /**
   * Cleanup on app close
   */
  static cleanup() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushLogs();
  }

  /**
   * Log debug message
   */
  static debug(category: LogCategory, message: string, data?: any) {
    if (ENV_CONFIG.LOG_LEVEL === 'debug') {
      this.log(LogLevel.DEBUG, category, message, data);
    }
  }

  /**
   * Log info message
   */
  static info(category: LogCategory, message: string, data?: any) {
    if (['debug', 'info'].includes(ENV_CONFIG.LOG_LEVEL)) {
      this.log(LogLevel.INFO, category, message, data);
    }
  }

  /**
   * Log warning message
   */
  static warn(category: LogCategory, message: string, data?: any) {
    if (['debug', 'info', 'warn'].includes(ENV_CONFIG.LOG_LEVEL)) {
      this.log(LogLevel.WARN, category, message, data);
    }
  }

  /**
   * Log error message
   */
  static error(category: LogCategory, message: string, error?: Error, data?: any) {
    this.log(LogLevel.ERROR, category, message, {
      ...data,
      error: error ? this.serializeError(error) : undefined,
    });
  }

  /**
   * Log crash
   */
  static crash(message: string, error: Error, data?: any) {
    this.log(LogLevel.ERROR, LogCategory.CRASH, message, {
      ...data,
      error: this.serializeError(error),
      stackTrace: error.stack,
    });

    // Immediately flush crash logs
    this.flushLogs();
  }

  /**
   * Log network error
   */
  static networkError(endpoint: string, method: string, error: Error, data?: any) {
    this.log(LogLevel.ERROR, LogCategory.NETWORK, `Network error: ${method} ${endpoint}`, {
      ...data,
      endpoint,
      method,
      error: this.serializeError(error),
    });
  }

  /**
   * Log business flow event
   */
  static businessFlow(event: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.BUSINESS_FLOW, event, data);
  }

  /**
   * Log sync event
   */
  static syncEvent(event: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.SYNC, event, data);
  }

  /**
   * Core logging method
   */
  private static async log(level: LogLevel, category: LogCategory, message: string, data?: any) {
    const logEntry: LogEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: this.sanitizeData(data),
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version.toString(),
      },
      environment: CURRENT_ENV,
    };

    // Console log in development
    if (__DEV__) {
      const consoleMethod = level === LogLevel.ERROR ? console.error : console.log;
      consoleMethod(`[${level.toUpperCase()}] [${category}] ${message}`, data || '');
    }

    // Add to queue
    this.logQueue.push(logEntry);

    // Persist to storage
    await this.persistLog(logEntry);

    // Flush if queue is full
    if (this.logQueue.length >= this.MAX_QUEUE_SIZE) {
      this.flushLogs();
    }
  }

  /**
   * Flush logs to server
   */
  private static async flushLogs() {
    if (this.isFlushingLogs || this.logQueue.length === 0) {
      return;
    }

    this.isFlushingLogs = true;

    try {
      const logsToSend = [...this.logQueue];
      this.logQueue = [];

      await baseApi.post(ENV_CONFIG.LOGGING_ENDPOINT, {
        logs: logsToSend,
      });

      // Clear persisted logs after successful send
      await AsyncStorage.removeItem('persisted_logs');
    } catch (error) {
      // If sending fails, add logs back to queue
      this.logQueue = [...this.logQueue, ...this.logQueue];
      console.error('Failed to flush logs:', error);
    } finally {
      this.isFlushingLogs = false;
    }
  }

  /**
   * Persist log to local storage
   */
  private static async persistLog(logEntry: LogEntry) {
    try {
      const existingLogs = await AsyncStorage.getItem('persisted_logs');
      const logs: LogEntry[] = existingLogs ? JSON.parse(existingLogs) : [];

      logs.push(logEntry);

      // Keep only last 100 logs
      const recentLogs = logs.slice(-100);

      await AsyncStorage.setItem('persisted_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to persist log:', error);
    }
  }

  /**
   * Load persisted logs
   */
  private static async loadPersistedLogs() {
    try {
      const existingLogs = await AsyncStorage.getItem('persisted_logs');
      if (existingLogs) {
        const logs: LogEntry[] = JSON.parse(existingLogs);
        this.logQueue = [...logs, ...this.logQueue];
      }
    } catch (error) {
      console.error('Failed to load persisted logs:', error);
    }
  }

  /**
   * Sanitize data to remove sensitive information
   */
  private static sanitizeData(data: any): any {
    if (!data) return data;

    // Create a deep copy
    const sanitized = JSON.parse(JSON.stringify(data));

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'apiKey', 'creditCard', 'ssn'];

    const sanitizeObject = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return;

      Object.keys(obj).forEach((key) => {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      });
    };

    sanitizeObject(sanitized);
    return sanitized;
  }

  /**
   * Serialize error object
   */
  private static serializeError(error: Error): any {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
}

// Initialize logging on import
LoggingService.initialize();
