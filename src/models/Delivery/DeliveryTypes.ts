// src/models/Delivery/DeliveryRequest.ts

import { FailureReason } from './DeliveryEnum';

export interface StartDeliveryRequest {
  deliveryPointId: string;
  startTime: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export interface CreatePODRequest {
  deliveryPointId: string;
  photos: Array<{
    uri: string;
    type: 'PACKAGE' | 'LOCATION' | 'RECIPIENT' | 'OTHER';
    localPath?: string;
  }>;
  signature?: {
    uri: string;
    localPath?: string;
  };
  notes?: string;
  recipientInfo?: {
    name: string;
    phoneNumber: string;
    idNumber?: string;
  };
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: string;
}

export interface CompleteDeliveryRequest {
  deliveryPointId: string;
  proofOfDeliveryId: string;
  completedAt: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface FailDeliveryRequest {
  deliveryPointId: string;
  failureReason: FailureReason;
  notes: string;
  failedAt: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ProcessCODPaymentRequest {
  deliveryPointId: string;
  paymentMethod: string;
  amount: number;
  transactionId?: string;
  paymentProof?: {
    uri: string;
    localPath?: string;
  };
  notes?: string;
}

export interface ScanRecipientQRRequest {
  deliveryPointId: string;
  qrData: string;
}

// src/models/Delivery/DeliveryResponse.ts

import { ApiResponse } from '@/types/api';
import { CODPayment, DeliveryPoint, ProofOfDelivery, Recipient } from './DeliveryModel';

export interface DeliveryPointResponse extends ApiResponse<DeliveryPoint> {}

export interface StartDeliveryResponse extends ApiResponse<DeliveryPoint> {
  success: boolean;
  message?: string;
}

export interface CreatePODResponse extends ApiResponse<ProofOfDelivery> {
  success: boolean;
  message?: string;
}

export interface CompleteDeliveryResponse extends ApiResponse<DeliveryPoint> {
  success: boolean;
  message?: string;
}

export interface FailDeliveryResponse extends ApiResponse<DeliveryPoint> {
  success: boolean;
  supportTicketId?: string;
  message?: string;
}

export interface CODPaymentResponse extends ApiResponse<CODPayment> {
  success: boolean;
  qrCodeUrl?: string;
  message?: string;
}

export interface ScanRecipientQRResponse extends ApiResponse<Recipient> {
  success: boolean;
  recipientInfo: Recipient;
  message?: string;
}
