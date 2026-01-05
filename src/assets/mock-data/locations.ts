// mock-data/locations.ts

import { LocationAccuracy } from '@/models/Tracking/TrackingEnum';
import { LocationPoint, TrackingSession } from '@/models/Tracking/TrackingModel';

export interface RouteInfo {
  tripId: string;
  waypoints: Waypoint[];
  polyline?: string;
  totalDistance: number;
  totalDuration: number;
  completedDistance: number;
  remainingDistance: number;
}

export interface Waypoint {
  id: string;
  type: 'START' | 'DELIVERY' | 'END';
  deliveryId?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  estimatedArrival?: string;
  actualArrival?: string;
  departureTime?: string;
  distance?: number;
  duration?: number;
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface NearbyPoint {
  deliveryId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  eta: number;
  status: string;
  isNext: boolean;
}

export interface TrafficConditions {
  currentArea: string;
  congestionLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  averageSpeed: number;
  incidents: TrafficIncident[];
  alternativeRoutes: AlternativeRoute[];
}

export interface TrafficIncident {
  type: string;
  location: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH';
  estimatedDelay: number;
}

export interface AlternativeRoute {
  id: string;
  description: string;
  distance: number;
  duration: number;
  savings: string;
}

export interface OfflineQueue {
  totalItems: number;
  pendingSync: QueueItem[];
  lastSyncAt: string;
}

export interface QueueItem {
  id: string;
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  data: any;
  createdAt: string;
  retries: number;
}

export interface GPSStatus {
  enabled: boolean;
  accuracy: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXCELLENT';
  satellitesVisible: number;
  signalStrength: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  lastFix: string;
}

export const mockCurrentLocation: LocationPoint = {
  id: 'LOC-CURRENT-001',
  driverId: 'DRV-2024-001',
  tripId: 'TRP-2026-003',
  latitude: 21.0278,
  longitude: 105.8342,
  accuracy: 5.2,
  altitude: 12.5,
  speed: 4.25, // 15.3 km/h = 4.25 m/s
  heading: 45.0,
  timestamp: '2026-01-05T10:30:25Z',
  locationAccuracy: LocationAccuracy.HIGH,
  isSynced: true,
  syncedAt: '2026-01-05T10:30:30Z',
  capturedOffline: false,
};

export const mockTrackingSession: TrackingSession = {
  id: 'TRACK-2026-001',
  driverId: 'DRV-2024-001',
  tripId: 'TRP-2026-003',
  startTime: '2026-01-05T09:05:00Z',
  totalLocations: 104,
  totalDistance: 8700, // in meters
  averageSpeed: 18.5, // in km/h
  isActive: true,
};

export const mockLocationHistory: LocationPoint[] = [
  {
    id: 'LOC-001',
    driverId: 'DRV-2024-001',
    tripId: 'TRP-2026-003',
    latitude: 21.0285,
    longitude: 105.8542,
    accuracy: 4.8,
    timestamp: '2026-01-05T09:05:00Z',
    locationAccuracy: LocationAccuracy.HIGH,
    isSynced: true,
    syncedAt: '2026-01-05T09:05:05Z',
    capturedOffline: false,
  },
  {
    id: 'LOC-002',
    driverId: 'DRV-2024-001',
    tripId: 'TRP-2026-003',
    latitude: 21.029,
    longitude: 105.8538,
    accuracy: 5.1,
    timestamp: '2026-01-05T09:05:30Z',
    locationAccuracy: LocationAccuracy.HIGH,
    isSynced: true,
    syncedAt: '2026-01-05T09:05:35Z',
    capturedOffline: false,
  },
  {
    id: 'LOC-003',
    driverId: 'DRV-2024-001',
    tripId: 'TRP-2026-003',
    latitude: 21.0298,
    longitude: 105.8532,
    accuracy: 4.9,
    timestamp: '2026-01-05T09:06:00Z',
    locationAccuracy: LocationAccuracy.HIGH,
    isSynced: true,
    syncedAt: '2026-01-05T09:06:05Z',
    capturedOffline: false,
  },
  {
    id: 'LOC-004',
    driverId: 'DRV-2024-001',
    tripId: 'TRP-2026-003',
    latitude: 21.0312,
    longitude: 105.8525,
    accuracy: 5.2,
    timestamp: '2026-01-05T09:06:30Z',
    locationAccuracy: LocationAccuracy.HIGH,
    isSynced: true,
    syncedAt: '2026-01-05T09:06:35Z',
    capturedOffline: false,
  },
  {
    id: 'LOC-005',
    driverId: 'DRV-2024-001',
    tripId: 'TRP-2026-003',
    latitude: 21.0325,
    longitude: 105.852,
    accuracy: 4.7,
    timestamp: '2026-01-05T09:07:00Z',
    locationAccuracy: LocationAccuracy.HIGH,
    isSynced: true,
    syncedAt: '2026-01-05T09:07:05Z',
    capturedOffline: false,
  },
  {
    id: 'LOC-006',
    driverId: 'DRV-2024-001',
    tripId: 'TRP-2026-003',
    latitude: 21.0334,
    longitude: 105.8524,
    accuracy: 5.0,
    timestamp: '2026-01-05T09:07:30Z',
    locationAccuracy: LocationAccuracy.HIGH,
    isSynced: true,
    syncedAt: '2026-01-05T09:07:35Z',
    capturedOffline: false,
  },
];

export const mockRoute: RouteInfo = {
  tripId: 'TRP-2026-003',
  waypoints: [
    {
      id: 'WP-001',
      type: 'START',
      name: 'VoltRide Warehouse',
      address: '456 Le Duan Street, Hoan Kiem, Hanoi',
      latitude: 21.0285,
      longitude: 105.8542,
      actualArrival: '2026-01-05T09:05:00Z',
      departureTime: '2026-01-05T09:10:00Z',
      status: 'COMPLETED',
    },
    {
      id: 'WP-002',
      type: 'DELIVERY',
      deliveryId: 'DEL-006',
      name: 'Pham Thi Dung',
      address: '123 Hang Gai Street',
      latitude: 21.0334,
      longitude: 105.8524,
      estimatedArrival: '2026-01-05T09:30:00Z',
      actualArrival: '2026-01-05T09:35:00Z',
      departureTime: '2026-01-05T09:45:00Z',
      distance: 1.2,
      duration: 8,
      status: 'COMPLETED',
    },
    {
      id: 'WP-003',
      type: 'DELIVERY',
      deliveryId: 'DEL-007',
      name: 'Nguyen Van Binh',
      address: '67 Hang Trong Street',
      latitude: 21.0298,
      longitude: 105.8498,
      estimatedArrival: '2026-01-05T10:00:00Z',
      actualArrival: '2026-01-05T10:05:00Z',
      departureTime: '2026-01-05T10:15:00Z',
      distance: 0.8,
      duration: 5,
      status: 'COMPLETED',
    },
    {
      id: 'WP-004',
      type: 'DELIVERY',
      deliveryId: 'DEL-008',
      name: 'Le Van Cuong',
      address: '45 Phan Chu Trinh Street',
      latitude: 21.0256,
      longitude: 105.8521,
      estimatedArrival: '2026-01-05T10:30:00Z',
      actualArrival: '2026-01-05T10:25:00Z',
      distance: 1.1,
      duration: 7,
      status: 'IN_PROGRESS',
    },
    {
      id: 'WP-005',
      type: 'DELIVERY',
      deliveryId: 'DEL-009',
      name: 'Tran Thi Hoa',
      address: '88 Trang Tien Street',
      latitude: 21.0245,
      longitude: 105.8548,
      estimatedArrival: '2026-01-05T11:00:00Z',
      distance: 0.9,
      duration: 6,
      status: 'PENDING',
    },
    {
      id: 'WP-006',
      type: 'DELIVERY',
      deliveryId: 'DEL-010',
      name: 'Pham Van Khang',
      address: '99 Hang Bong Street',
      latitude: 21.0312,
      longitude: 105.8516,
      estimatedArrival: '2026-01-05T11:30:00Z',
      distance: 1.5,
      duration: 10,
      status: 'PENDING',
    },
    {
      id: 'WP-007',
      type: 'END',
      name: 'Return to Warehouse',
      address: '456 Le Duan Street, Hoan Kiem, Hanoi',
      latitude: 21.0285,
      longitude: 105.8542,
      distance: 3.2,
      duration: 15,
      status: 'PENDING',
    },
  ],
  polyline: 'a~l~Fjk~uOnzh@vlbPplIz~@{aR~|E{@hJzD~Ez@bGOnzm@',
  totalDistance: 15.3,
  totalDuration: 60,
  completedDistance: 8.7,
  remainingDistance: 6.6,
};

export const mockNearbyPoints: NearbyPoint[] = [
  {
    deliveryId: 'DEL-008',
    name: 'Le Van Cuong',
    address: '45 Phan Chu Trinh Street',
    latitude: 21.0256,
    longitude: 105.8521,
    distance: 0.3,
    eta: 2,
    status: 'IN_PROGRESS',
    isNext: true,
  },
  {
    deliveryId: 'DEL-009',
    name: 'Tran Thi Hoa',
    address: '88 Trang Tien Street',
    latitude: 21.0245,
    longitude: 105.8548,
    distance: 1.2,
    eta: 8,
    status: 'PENDING',
    isNext: false,
  },
];

export const mockTrafficConditions: TrafficConditions = {
  currentArea: 'Hoan Kiem District',
  congestionLevel: 'MODERATE',
  averageSpeed: 15.5,
  incidents: [
    {
      type: 'TRAFFIC_JAM',
      location: 'Hang Bai - Trang Tien intersection',
      severity: 'MODERATE',
      estimatedDelay: 5,
    },
  ],
  alternativeRoutes: [
    {
      id: 'ALT-001',
      description: 'Via Hang Trong Street',
      distance: 1.3,
      duration: 9,
      savings: '+0.2km, +2min',
    },
  ],
};

export const mockOfflineQueue: OfflineQueue = {
  totalItems: 3,
  pendingSync: [
    {
      id: 'QUEUE-001',
      type: 'LOCATION_UPDATE',
      priority: 'MEDIUM',
      data: {
        latitude: 21.0278,
        longitude: 105.8342,
        timestamp: '2026-01-05T10:25:00Z',
      },
      createdAt: '2026-01-05T10:25:05Z',
      retries: 0,
    },
    {
      id: 'QUEUE-002',
      type: 'LOCATION_UPDATE',
      priority: 'MEDIUM',
      data: {
        latitude: 21.0268,
        longitude: 105.8355,
        timestamp: '2026-01-05T10:26:00Z',
      },
      createdAt: '2026-01-05T10:26:05Z',
      retries: 0,
    },
    {
      id: 'QUEUE-003',
      type: 'LOCATION_UPDATE',
      priority: 'MEDIUM',
      data: {
        latitude: 21.0256,
        longitude: 105.8368,
        timestamp: '2026-01-05T10:27:00Z',
      },
      createdAt: '2026-01-05T10:27:05Z',
      retries: 0,
    },
  ],
  lastSyncAt: '2026-01-05T10:24:30Z',
};

export const mockGPSStatus: GPSStatus = {
  enabled: true,
  accuracy: 'HIGH',
  satellitesVisible: 12,
  signalStrength: 'EXCELLENT',
  lastFix: '2026-01-05T10:30:25Z',
};

export default {
  currentLocation: mockCurrentLocation,
  trackingSession: mockTrackingSession,
  locationHistory: mockLocationHistory,
  route: mockRoute,
  nearbyPoints: mockNearbyPoints,
  trafficConditions: mockTrafficConditions,
  offlineQueue: mockOfflineQueue,
  gpsStatus: mockGPSStatus,
};
