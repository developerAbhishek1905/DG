export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REVERSED";

export type PaymentMethod =
  | "BANK_TRANSFER"
  | "UPI"
  | "NEFT"
  | "RTGS"
  | "IMPS"
  | "CHEQUE"
  | "CASH"
  | "OTHER";

export interface PaymentDealer {
  id: string;
  name: string;
  dealerCode: string;
  phone?: string;
  city?: string;
}

export interface Payment {
  id: string;

  paymentNumber: string;

  dealerId: string;

  dealer: PaymentDealer;

  amount: number;

  paymentMethod: PaymentMethod;

  status: PaymentStatus;

  transactionReference?: string;

  bankReference?: string;

  chequeNumber?: string;

  paymentDate: string;

  remarks?: string;

  ledgerTransactionId?: string;

  recordedBy: string;

  approvedBy?: string;

  approvedAt?: string;

  failureReason?: string;

  createdAt: string;

  updatedAt: string;
}

export interface RecordPaymentPayload {
  dealerId: string;

  amount: number;

  paymentMethod: PaymentMethod;

  transactionReference?: string;

  bankReference?: string;

  chequeNumber?: string;

  paymentDate: string;

  remarks?: string;
}

export interface PaymentSummaryData {
  totalPayments: number;

  successfulPayments: number;

  pendingPayments: number;

  failedPayments: number;

  totalPaidAmount: number;

  pendingAmount: number;
}