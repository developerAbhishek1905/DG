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