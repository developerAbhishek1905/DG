export type ReconciliationStatus =
  | "PENDING"
  | "MATCHED"
  | "MISMATCH"
  | "RECONCILED";

export type DifferenceType =
  | "NONE"
  | "LEDGER_HIGH"
  | "LEDGER_LOW"
  | "PAYMENT_MISSING"
  | "BILL_MISSING"
  | "DUPLICATE_ENTRY"
  | "OTHER";

export interface ReconciliationDealer {
  id: string;
  name: string;
  dealerCode: string;
  phone?: string;
  city?: string;
}

export interface Reconciliation {
  id: string;

  reconciliationNumber: string;

  dealerId: string;

  dealer: ReconciliationDealer;

  periodFrom: string;
  periodTo: string;

  openingBalance: number;

  totalBillAmount: number;

  totalLedgerCredits: number;

  totalPayments: number;

  totalLedgerDebits: number;

  expectedClosingBalance: number;

  actualClosingBalance: number;

  difference: number;

  differenceType: DifferenceType;

  status: ReconciliationStatus;

  remarks?: string;

  reconciliationNote?: string;

  reconciledBy?: string;

  reconciledAt?: string;

  createdBy: string;

  createdAt: string;

  updatedAt: string;
}

export interface ReconciliationSummaryData {
  totalRecords: number;

  matchedRecords: number;

  mismatchRecords: number;

  pendingRecords: number;

  reconciledRecords: number;

  totalExpectedBalance: number;

  totalActualBalance: number;

  totalDifference: number;
}

export interface ReconcilePayload {
  reconciliationId: string;

  differenceType: DifferenceType;

  reconciliationNote: string;
}