// mock-data/payments.ts

import { PaymentMethod, PaymentStatus } from '@/models/Delivery/DeliveryEnum';
import { CODPayment } from '@/models/Delivery/DeliveryModel';

export interface PaymentMethodInfo {
  code: PaymentMethod;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  processingTime: string;
  instructions: string[];
}

export interface PaymentSummary {
  totalTransactions: number;
  completed: number;
  pending: number;
  failed: number;
  totalAmount: {
    completed: number;
    pending: number;
    failed: number;
    currency: string;
  };
  byMethod: {
    [key: string]: {
      count: number;
      amount: number;
    };
  };
}

export const mockPayments: CODPayment[] = [
  {
    id: 'PAY-001',
    amount: 15000000,
    currency: 'VND',
    method: PaymentMethod.VIETQR,
    status: PaymentStatus.PENDING,
    qrCodeData:
      '00020101021238570010A00000072701270006970454011512345678901250208QRIBFTTA53037045802VN5913NGUYEN VAN AN6005HANOI62140810DEL-0016304A1B2',
    qrCodeUrl: 'https://img.vietqr.io/image/970454-1234567890-compact2.png?amount=15000000&addInfo=DEL-001',
  },
  {
    id: 'PAY-002',
    amount: 5000000,
    currency: 'VND',
    method: PaymentMethod.VIETQR,
    status: PaymentStatus.PENDING,
    qrCodeData:
      '00020101021238570010A00000072701270006970454011512345678901250208QRIBFTTA53037045802VN5913LE VAN CUONG6005HANOI62140810DEL-0086304B2E4',
    qrCodeUrl: 'https://img.vietqr.io/image/970454-1234567890-compact2.png?amount=5000000&addInfo=DEL-008',
  },
  {
    id: 'PAY-003',
    amount: 8500000,
    currency: 'VND',
    method: PaymentMethod.VIETQR,
    status: PaymentStatus.COMPLETED,
    transactionId: 'VCB20260105123456',
    qrCodeData:
      '00020101021238570010A00000072701270006970454011512345678901250208QRIBFTTA53037045802VN5918TRAN THI BINH CO6005HANOI62140810DEL-0056304C3F5',
    qrCodeUrl: 'https://img.vietqr.io/image/970454-1234567890-compact2.png?amount=8500000&addInfo=DEL-005',
    paymentProof: {
      url: 'https://picsum.photos/800/600?random=10',
      capturedAt: '2026-01-05T11:25:00Z',
    },
    paidAt: '2026-01-05T11:25:00Z',
  },
  {
    id: 'PAY-004',
    amount: 12000000,
    currency: 'VND',
    method: PaymentMethod.CASH,
    status: PaymentStatus.COMPLETED,
    transactionId: 'CASH-20260104-001',
    paymentProof: {
      url: 'https://picsum.photos/800/600?random=11',
      capturedAt: '2026-01-04T15:30:00Z',
    },
    notes: 'Received exact amount in cash. Customer counted bills.',
    paidAt: '2026-01-04T15:30:00Z',
  },
  {
    id: 'PAY-005',
    amount: 6500000,
    currency: 'VND',
    method: PaymentMethod.CARD,
    status: PaymentStatus.COMPLETED,
    transactionId: 'CARD-20260104-002',
    paymentProof: {
      url: 'https://picsum.photos/800/600?random=12',
      capturedAt: '2026-01-04T16:15:00Z',
    },
    notes: 'Payment via mobile POS terminal. Receipt printed.',
    paidAt: '2026-01-04T16:15:00Z',
  },
  {
    id: 'PAY-006',
    amount: 3500000,
    currency: 'VND',
    method: PaymentMethod.COD,
    status: PaymentStatus.FAILED,
    qrCodeData:
      '00020101021238570010A00000072701270006970454011512345678901250208QRIBFTTA53037045802VN5913HOANG VAN EM6005HANOI62150810DEL-0146304D4G6',
    qrCodeUrl: 'https://img.vietqr.io/image/970454-1234567890-compact2.png?amount=3500000&addInfo=DEL-014',
    notes: 'Delivery failed - Recipient not available',
  },
];

export const mockPaymentMethods: PaymentMethodInfo[] = [
  {
    code: PaymentMethod.VIETQR,
    name: 'VietQR',
    description: 'Scan QR code with banking app',
    icon: 'qr-code',
    enabled: true,
    processingTime: 'Instant',
    instructions: [
      'Show QR code to customer',
      'Customer scans with banking app',
      'Wait for payment confirmation',
      'Enter transaction ID',
    ],
  },
  {
    code: PaymentMethod.CASH,
    name: 'Cash',
    description: 'Collect cash payment',
    icon: 'dollar-sign',
    enabled: true,
    processingTime: 'Instant',
    instructions: [
      'Collect exact amount from customer',
      'Count and verify cash',
      'Take photo of received cash',
      'Provide receipt if requested',
    ],
  },
  {
    code: PaymentMethod.CARD,
    name: 'Card Payment',
    description: 'Card payment via POS terminal',
    icon: 'credit-card',
    enabled: true,
    processingTime: '1-2 minutes',
    instructions: [
      'Connect POS terminal',
      'Enter amount',
      'Customer inserts/taps card',
      'Enter transaction ID from receipt',
    ],
  },
  {
    code: PaymentMethod.VIETQR,
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: 'trending-up',
    enabled: false,
    processingTime: '1-24 hours',
    instructions: [
      'Provide bank account details',
      'Wait for transfer confirmation',
      'Verify transaction in banking app',
      'Enter transaction ID',
    ],
  },
];

export const mockPaymentSummary: PaymentSummary = {
  totalTransactions: 6,
  completed: 3,
  pending: 2,
  failed: 1,
  totalAmount: {
    completed: 27000000,
    pending: 20000000,
    failed: 3500000,
    currency: 'VND',
  },
  byMethod: {
    VIETQR: {
      count: 1,
      amount: 8500000,
    },
    CASH: {
      count: 1,
      amount: 12000000,
    },
    CARD: {
      count: 1,
      amount: 6500000,
    },
  },
};

export default {
  payments: mockPayments,
  paymentMethods: mockPaymentMethods,
  paymentSummary: mockPaymentSummary,
};
