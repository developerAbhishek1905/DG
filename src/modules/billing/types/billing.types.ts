export type BillingStatus =
  | "DRAFT"
  | "GENERATED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PAID";

export type RateType =
  | "VISIT"
  | "SERVICE"
  | "PART"
  | "INSTALLATION"
  | "UNINSTALLATION";

export interface BillingDealer {
  id: string;
  name: string;
  dealerCode: string;
}

export interface BillingCustomer {
  id: string;
  name: string;
  city: string;
}

export interface BillingLineItem {
  id: string;

  description: string;

  quantity: number;

  rate: number;

  amount: number;

  taxPercentage?: number;

  taxAmount?: number;

  totalAmount: number;
}

export interface Bill {
  id: string;

  billNumber: string;

  complaintId: string;

  complaintNumber: string;

  closureId: string;

  verificationId: string;

  dealer: BillingDealer;

  customer: BillingCustomer;

  closureType: RateType;

  lineItems: BillingLineItem[];

  subtotal: number;

  taxAmount: number;

  totalAmount: number;

  status: BillingStatus;

  generatedAt: string;

  generatedBy: string;

  approvedAt?: string;

  approvedBy?: string;

  rejectedAt?: string;

  rejectedBy?: string;

  rejectionReason?: string;

  remarks?: string;

  createdAt: string;

  updatedAt: string;
}

export interface RateMaster {
  id: string;

  code: string;

  closureType: RateType;

  serviceName: string;

  productCategory?: string;

  city?: string;

  baseRate: number;

  taxPercentage: number;

  effectiveFrom: string;

  effectiveTo?: string;

  active: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface RateFormData {
  code: string;

  closureType: RateType;

  serviceName: string;

  productCategory?: string;

  city?: string;

  baseRate: number;

  taxPercentage: number;

  effectiveFrom: string;

  effectiveTo?: string;

  active: boolean;
}

export interface GenerateBillPayload {
  complaintId: string;

  closureId: string;

  verificationId: string;
}

export interface ApproveBillPayload {
  billId: string;

  remarks?: string;
}

export interface RejectBillPayload {
  billId: string;

  reason: string;
}

export type LedgerStatus =
  | "PENDING"
  | "APPROVED"
  | "BILLED"
  | "REVERSED"
  | "CANCELLED";

export type BillingType =
  | "OPENING_BALANCE"
  | "FIXED"
  | "PARTIAL_PAYMENT"
  | "PROFIT_SHARING"
  | "CANCELLATION"
  | "ADJUSTMENT";

export type TransactionType =
  | "OPENING_BALANCE"
  | "CLOSURE"
  | "CANCELLATION"
  | "ADJUSTMENT";

export interface LedgerDealer {
  _id: string;
  headCode?: string;
  technicianFirmName?: string;
  technicianName?: string;
  mobileNumber?: string;
  email?: string;
  billingType?: string;
  billingPercentage?: number;
}

export interface LedgerComplaint {
  _id: string;
  complaintNumber: string;
  customerName?: string;
  phone?: string;
  status?: string;
}

export interface DealerLedger {
  _id: string;

  dealerId:
    | LedgerDealer
    | string;

  dealerCode?: string;
  dealerName?: string;

  complaintId?:
    | LedgerComplaint
    | string
    | null;

  complaintNumber?: string;

  transactionType: TransactionType;

  billingType: BillingType;

  productId?: number;
  productName?: string;

  categoryId?: string | null;
  category?: string;

  serviceDescription?: string;

  baseAmount: number;
  percentage: number;
  serviceRate: number;
  amount: number;

  entryType:
    | "DEBIT"
    | "CREDIT";

  calculation?: {
    fixedRate?: number;
    customerAmount?: number;
    profitAmount?: number;
    percentage?: number;
  };

  description?: string;
  remarks?: string;

  status: LedgerStatus;

  billingDate?: string;

  billedBy?: string | null;

  approvedAt?: string | null;
  approvedBy?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface LedgerFilters {
  search?: string;
  dealerId?: string;
  status?: string;
  billingType?: string;
  transactionType?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface LedgerSummary {
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export interface LedgerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LedgerListResponse {
  data: DealerLedger[];

  summary: LedgerSummary;

  pagination: LedgerPagination;
}