// src/models/Delivery/DeliveryEnum.ts

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REQUIRES_SUPPORT = 'REQUIRES_SUPPORT',
  CANCELLED = 'CANCELLED',
}

export enum DeliveryPointType {
  PICKUP = 'PICKUP',
  DROPOFF = 'DROPOFF',
  RETURN = 'RETURN',
}

export enum PODType {
  PHOTO = 'PHOTO',
  SIGNATURE = 'SIGNATURE',
  QR_CODE = 'QR_CODE',
  NOTE = 'NOTE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  ONLINE = 'ONLINE',
  COD = 'COD',
  VIETQR = 'VIETQR',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum FailureReason {
  RECIPIENT_NOT_AVAILABLE = 'RECIPIENT_NOT_AVAILABLE',
  WRONG_ADDRESS = 'WRONG_ADDRESS',
  REFUSED_DELIVERY = 'REFUSED_DELIVERY',
  DAMAGED_GOODS = 'DAMAGED_GOODS',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
  OTHER = 'OTHER',
}
