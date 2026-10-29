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
  dealer: {
    id: string;
    name: string;
    dealerCode: string;
    firmName?: string;
    phone?: string;
    city?: string;
  };

  totalDebit: number;
  totalCredit: number;
  outstanding: number;

  approvedAmount?: number;
  pendingAmount?: number;

  // New overview API fields
  unpaidBillsCount?: number;
  unpaidBillsAmount?: number;
  currentOutstanding?: number;
  creditAmount?: number;
  securityDeposit?: number;
  openingBalanceType?: "DR" | "CR";



openingBalance: number;


creditLimit: number;

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

export interface PaymentComplaintBill {
  _id: string;
  ledgerId: string;
  complaintId: string;
  complaintNumber: string;
  amount: number;
}

export interface DealerPayment {
  _id: string;
  paymentNumber: string;
  dealerId: string;

  additionalAmount: number;
  selectedBillsTotal: number;

  complaintBills: PaymentComplaintBill[];

  openingOutstanding: number;
  closingOutstanding: number;

  paymentDate: string;

  paymentMode:
    | "CASH"
    | "UPI"
    | "BANK_TRANSFER"
    | "CHEQUE";

  transactionReference: string;
  remark: string;

  status: "COMPLETED" | "REVERSED";

  createdBy: {
    _id: string;
    name: string;
    email?: string;
  } | null;

  createdAt: string;
  updatedAt: string;
}

export interface DealerPaymentsResponse {
  success: boolean;
  message: string;
  data: DealerPayment[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DealerPaymentFilters {
  dealerId: string;
  search?: string;
  paymentMode?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}