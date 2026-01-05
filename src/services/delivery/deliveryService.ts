// src/services/delivery/deliveryService.ts

import {
  CODPaymentResponse,
  CompleteDeliveryRequest,
  CompleteDeliveryResponse,
  CreatePODRequest,
  CreatePODResponse,
  DeliveryPointResponse,
  FailDeliveryRequest,
  FailDeliveryResponse,
  ProcessCODPaymentRequest,
  ScanRecipientQRRequest,
  ScanRecipientQRResponse,
  StartDeliveryRequest,
  StartDeliveryResponse,
} from '@/models/Delivery/DeliveryTypes';
import { baseApi } from '../baseApi';

export class DeliveryService {
  private static readonly BASE_PATH = '/deliveries';

  /**
   * Get delivery point by ID
   */
  static async getDeliveryPointById(deliveryPointId: string): Promise<DeliveryPointResponse> {
    try {
      const response = await baseApi.get<DeliveryPointResponse>(`${this.BASE_PATH}/${deliveryPointId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Start delivery
   */
  static async startDelivery(data: StartDeliveryRequest): Promise<StartDeliveryResponse> {
    try {
      const response = await baseApi.post<StartDeliveryResponse>(
        `${this.BASE_PATH}/${data.deliveryPointId}/start`,
        data,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create proof of delivery
   */
  static async createProofOfDelivery(data: CreatePODRequest): Promise<CreatePODResponse> {
    try {
      const formData = new FormData();

      // Add photos
      data.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, {
          uri: photo.uri,
          type: 'image/jpeg',
          name: `photo_${index}.jpg`,
        } as any);
        formData.append(`photoTypes[${index}]`, photo.type);
      });

      // Add signature if present
      if (data.signature) {
        formData.append('signature', {
          uri: data.signature.uri,
          type: 'image/png',
          name: 'signature.png',
        } as any);
      }

      // Add other data
      if (data.notes) formData.append('notes', data.notes);
      if (data.recipientInfo) {
        formData.append('recipientName', data.recipientInfo.name);
        formData.append('recipientPhone', data.recipientInfo.phoneNumber);
        if (data.recipientInfo.idNumber) formData.append('recipientIdNumber', data.recipientInfo.idNumber);
      }

      formData.append('latitude', data.location.latitude.toString());
      formData.append('longitude', data.location.longitude.toString());
      formData.append('accuracy', data.location.accuracy.toString());
      formData.append('timestamp', data.timestamp);

      const response = await baseApi.post<CreatePODResponse>(
        `${this.BASE_PATH}/${data.deliveryPointId}/pod`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Complete delivery
   */
  static async completeDelivery(data: CompleteDeliveryRequest): Promise<CompleteDeliveryResponse> {
    try {
      const response = await baseApi.post<CompleteDeliveryResponse>(
        `${this.BASE_PATH}/${data.deliveryPointId}/complete`,
        data,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fail delivery
   */
  static async failDelivery(data: FailDeliveryRequest): Promise<FailDeliveryResponse> {
    try {
      const response = await baseApi.post<FailDeliveryResponse>(`${this.BASE_PATH}/${data.deliveryPointId}/fail`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Process COD payment
   */
  static async processCODPayment(data: ProcessCODPaymentRequest): Promise<CODPaymentResponse> {
    try {
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('paymentMethod', data.paymentMethod);

      if (data.transactionId) formData.append('transactionId', data.transactionId);
      if (data.notes) formData.append('notes', data.notes);

      if (data.paymentProof) {
        formData.append('paymentProof', {
          uri: data.paymentProof.uri,
          type: 'image/jpeg',
          name: 'payment_proof.jpg',
        } as any);
      }

      const response = await baseApi.post<CODPaymentResponse>(
        `${this.BASE_PATH}/${data.deliveryPointId}/cod-payment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Scan recipient QR code
   */
  static async scanRecipientQR(data: ScanRecipientQRRequest): Promise<ScanRecipientQRResponse> {
    try {
      const response = await baseApi.post<ScanRecipientQRResponse>(
        `${this.BASE_PATH}/${data.deliveryPointId}/scan-qr`,
        { qrData: data.qrData },
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handler
   */
  private static handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}
