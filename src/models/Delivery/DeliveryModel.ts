// src/models/Delivery/DeliveryModel.ts

import { DeliveryPointType, DeliveryStatus, FailureReason, PaymentMethod, PaymentStatus } from './DeliveryEnum';

export interface Address {
  street: string;
  city: string;
  district: string;
  ward: string;
  state?: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  additionalInfo?: string;
}

export interface Recipient {
  name: string;
  phoneNumber: string;
  email?: string;
  idNumber?: string; // From QR scan
  signature?: string; // Base64 or URL
}

export interface Package {
  id: string;
  trackingNumber: string;
  description: string;
  weight: number; // in kg
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  value?: number;
  specialInstructions?: string;
  isFragile: boolean;
  requiresSignature: boolean;
}

export interface ProofOfDelivery {
  id: string;
  deliveryPointId: string;
  photos: Array<{
    id: string;
    url: string;
    type: 'PACKAGE' | 'LOCATION' | 'RECIPIENT' | 'OTHER';
    capturedAt: string;
    localPath?: string; // For offline mode
  }>;
  signature?: {
    url: string;
    capturedAt: string;
    localPath?: string;
  };
  notes?: string;
  recipientInfo?: Recipient;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    capturedAt: string;
  };
  timestamp: string;
  isSynced: boolean;
}

export interface CODPayment {
  id: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  qrCodeData?: string; // VietQR data
  qrCodeUrl?: string; // VietQR image URL
  transactionId?: string;
  paymentProof?: {
    url: string;
    capturedAt: string;
  };
  paidAt?: string;
  notes?: string;
}

export interface DeliveryPoint {
  id: string;
  tripId: string;
  sequence: number; // Order in trip
  type: DeliveryPointType;
  status: DeliveryStatus;
  address: Address;
  recipient: Recipient;
  packages: Package[];
  scheduledTime?: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  completedAt?: string;
  proofOfDelivery?: ProofOfDelivery;
  codPayment?: CODPayment;
  failureReason?: FailureReason;
  failureNotes?: string;
  supportTicketId?: string;
  requiresCOD: boolean;
  isHighPriority: boolean;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryState {
  // Data
  currentDelivery: DeliveryPoint | null;
  deliveries: DeliveryPoint[];

  // POD capture state
  capturedPhotos: string[];
  capturedSignature: string | null;
  capturedNotes: string | null;
  recipientInfo: Recipient | null;

  // Loading states
  isLoading: boolean;
  isCapturing: boolean;
  isCompleting: boolean;
  isFailingDelivery: boolean;

  // Error
  error: string | null;
}

// Helper functions
export const getDeliveryStatusColor = (status: DeliveryStatus): string => {
  switch (status) {
    case DeliveryStatus.PENDING:
      return '#8E8E93'; // Gray
    case DeliveryStatus.IN_PROGRESS:
      return '#007AFF'; // Blue
    case DeliveryStatus.SUCCESS:
      return '#34C759'; // Green
    case DeliveryStatus.FAILED:
      return '#FF3B30'; // Red
    case DeliveryStatus.REQUIRES_SUPPORT:
      return '#FF9500'; // Orange
    case DeliveryStatus.CANCELLED:
      return '#8E8E93'; // Gray
    default:
      return '#8E8E93';
  }
};

export const canStartDelivery = (delivery: DeliveryPoint): boolean => {
  return delivery.status === DeliveryStatus.PENDING;
};

export const canCompleteDelivery = (delivery: DeliveryPoint, pod?: ProofOfDelivery): boolean => {
  if (delivery.status !== DeliveryStatus.IN_PROGRESS) return false;

  // Check if POD is captured
  if (!pod || !pod.photos || pod.photos.length === 0) return false;

  // Check if COD payment is required and completed
  if (delivery.requiresCOD && delivery.codPayment?.status !== PaymentStatus.COMPLETED) {
    return false;
  }

  return true;
};

export const requiresPayment = (delivery: DeliveryPoint): boolean => {
  return delivery.requiresCOD && delivery.codPayment?.status !== PaymentStatus.COMPLETED;
};

export const getTotalPackageWeight = (delivery: DeliveryPoint): number => {
  return delivery.packages.reduce((total, pkg) => total + pkg.weight, 0);
};

export const getDeliveryTypeLabel = (type: DeliveryPointType): string => {
  switch (type) {
    case DeliveryPointType.PICKUP:
      return 'Pick Up';
    case DeliveryPointType.DROPOFF:
      return 'Drop Off';
    case DeliveryPointType.RETURN:
      return 'Return';
    default:
      return 'Unknown';
  }
};
