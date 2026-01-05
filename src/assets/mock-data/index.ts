// /**
//  * VoltRide Driver App - Mock Data Index
//  *
//  * Central export point for all mock data
//  * Use this for easy importing in development
//  *
//  * All data is properly typed using models from:
//  * - DriverModel (Driver interface)
//  * - TripModel (Trip interface)
//  * - DeliveryModel (DeliveryPoint, Package, etc.)
//  * - TrackingModel (LocationPoint, TrackingSession)
//  */

// import { mockDriver } from './driver';
// import { mockAssignedTrips, mockCurrentTrip, mockCompletedTrips } from './trips';
// import { mockDeliveries } from './deliveries';
// import { mockPayments, mockPaymentMethods, mockPaymentSummary } from './payments';
// import { mockPerformance } from './performance';
// import {
//   mockCurrentLocation,
//   mockTrackingSession,
//   mockLocationHistory,
//   mockRoute,
//   mockNearbyPoints,
//   mockTrafficConditions,
//   mockOfflineQueue,
//   mockGPSStatus,
// } from './locations';

// // Re-export individual modules
// export { mockDriver } from './driver';
// export { mockAssignedTrips, mockCurrentTrip, mockCompletedTrips } from './trips';
// export { mockDeliveries } from './deliveries';
// export { mockPayments, mockPaymentMethods, mockPaymentSummary } from './payments';
// export { mockPerformance } from './performance';
// export {
//   mockCurrentLocation,
//   mockTrackingSession,
//   mockLocationHistory,
//   mockRoute,
//   mockNearbyPoints,
//   mockTrafficConditions,
//   mockOfflineQueue,
//   mockGPSStatus,
// } from './locations';

// // Export types from models
// export type { Driver, Vehicle, DriverDocument } from '../models/Driver/DriverModel';
// export type { Trip, TripRoute, TripTimeline } from '../models/Trip/TripModel';
// export type { DeliveryPoint, Package, ProofOfDelivery, CODPayment } from '../models/Delivery/DeliveryModel';
// export type { LocationPoint, TrackingSession, TrackingEvent } from '../models/Tracking/TrackingModel';
// export type { PerformanceMetrics } from './performance';
// export type { PaymentMethodInfo, PaymentSummary } from './payments';
// export type { RouteInfo, Waypoint, NearbyPoint } from './locations';

// // Export enums
// export { DriverType, DriverStatus, VehicleType } from '../models/Driver/DriverEnum';
// export { TripStatus, TripType, TripPriority } from '../models/Trip/TripEnum';
// export { DeliveryStatus, DeliveryPointType, PaymentMethod, PaymentStatus, FailureReason } from '../models/Delivery/DeliveryEnum';
// export { LocationAccuracy, TrackingEventType } from '../models/Tracking/TrackingEnum';

// // Export combined data object
// export const mockData = {
//   driver: mockDriver,
//   trips: {
//     assigned: mockAssignedTrips,
//     current: mockCurrentTrip,
//     completed: mockCompletedTrips,
//   },
//   deliveries: mockDeliveries,
//   payments: {
//     transactions: mockPayments,
//     methods: mockPaymentMethods,
//     summary: mockPaymentSummary,
//   },
//   performance: mockPerformance,
//   locations: {
//     current: mockCurrentLocation,
//     session: mockTrackingSession,
//     history: mockLocationHistory,
//     route: mockRoute,
//     nearby: mockNearbyPoints,
//     traffic: mockTrafficConditions,
//     queue: mockOfflineQueue,
//     gps: mockGPSStatus,
//   },
// };

// // Export helper functions
// export const getMockDriver = () => mockDriver;

// export const getMockTrips = (status?: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED') => {
//   if (status === 'ASSIGNED') return mockAssignedTrips;
//   if (status === 'IN_PROGRESS') return mockCurrentTrip ? [mockCurrentTrip] : [];
//   if (status === 'COMPLETED') return mockCompletedTrips;
//   return [...mockAssignedTrips, ...(mockCurrentTrip ? [mockCurrentTrip] : []), ...mockCompletedTrips];
// };

// export const getMockDelivery = (deliveryId: string) => {
//   return mockDeliveries.find((d) => d.id === deliveryId);
// };

// export const getMockPayment = (paymentId: string) => {
//   return mockPayments.find((p) => p.id === paymentId);
// };

// export const getMockPerformance = (period?: 'daily' | 'weekly' | 'monthly' | 'lifetime') => {
//   if (!period) return mockPerformance;
//   return mockPerformance[period];
// };

// export const getMockRoute = () => mockRoute;

// export const getMockCurrentLocation = () => mockCurrentLocation;

// // Export default
// export default mockData;

// /**
//  * Usage Examples:
//  *
//  * // Import all mock data
//  * import mockData from '@/mock-data';
//  *
//  * // Import specific modules (typed)
//  * import { mockDriver, mockAssignedTrips } from '@/mock-data';
//  *
//  * // Import types
//  * import type { Driver, Trip, DeliveryPoint } from '@/mock-data';
//  *
//  * // Import enums
//  * import { TripStatus, DeliveryStatus } from '@/mock-data';
//  *
//  * // Use helper functions
//  * import { getMockDriver, getMockTrips } from '@/mock-data';
//  * const driver = getMockDriver();
//  * const assignedTrips = getMockTrips('ASSIGNED');
//  *
//  * // Type-safe access
//  * const driverName: string = mockDriver.firstName + ' ' + mockDriver.lastName;
//  * const tripStatus: TripStatus = mockCurrentTrip.status;
//  */
