export type LedgerTransactionType =
  | "BILL_CREDIT"
  | "PAYMENT_DEBIT"
  | "ADJUSTMENT_CREDIT"
  | "ADJUSTMENT_DEBIT"
  | "REVERSAL"
  | "OPENING_BALANCE";

export type LedgerTransactionStatus =
  | "POSTED"
  | "PENDING"
  | "REVERSED";

export type LedgerReferenceType =
  | "BILL"
  | "PAYMENT"
  | "ADJUSTMENT"
  | "OPENING";

export interface LedgerDealer {
  id: string;
  name: string;
  dealerCode: string;
  phone?: string;
  city?: string;
}

export interface LedgerTransaction {
  id: string;

  transactionNumber: string;

  dealerId: string;

  dealer: LedgerDealer;

  transactionType: LedgerTransactionType;

  referenceType: LedgerReferenceType;

  referenceId?: string;

  referenceNumber?: string;

  complaintId?: string;

  complaintNumber?: string;

  description: string;

  credit: number;

  debit: number;

  balance: number;

  status: LedgerTransactionStatus;

  transactionDate: string;

  createdBy: string;

  remarks?: string;

  createdAt: string;

  updatedAt: string;
}

export interface DealerLedgerSummary {
  dealer: LedgerDealer;

  openingBalance: number;

  totalCredits: number;

  totalDebits: number;

  totalPaid: number;

  outstandingAmount: number;

  pendingPaymentAmount: number;

  lastTransactionAt?: string;
}

export interface LedgerOverviewStats {
  totalDealers: number;

  totalOutstanding: number;

  totalCredits: number;

  totalPayments: number;

  overdueOutstanding: number;
}

export interface CreateAdjustmentPayload {
  dealerId: string;

  adjustmentType:
    | "CREDIT"
    | "DEBIT";

  amount: number;

  reason: string;

  remarks?: string;
}