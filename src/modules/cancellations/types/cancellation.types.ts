export type CancellationStatus =
  | "PENDING"
  | "VERIFIED"
  | "APPROVED"
  | "REJECTED"
  | "REASSIGNED";

export type CancellationReasonType =
  | "CUSTOMER_REQUEST"
  | "CUSTOMER_UNAVAILABLE"
  | "WRONG_COMPLAINT"
  | "DUPLICATE_COMPLAINT"
  | "DEALER_UNAVAILABLE"
  | "OUT_OF_SERVICE_AREA"
  | "PRODUCT_NOT_SUPPORTED"
  | "SERVICE_NOT_REQUIRED"
  | "OTHER";

export type VerificationStatus =
  | "NOT_VERIFIED"
  | "VERIFIED"
  | "FAILED";

export interface CancellationCustomer {
  id: string;
  name: string;
  phone: string;
  city: string;
}

export interface CancellationDealer {
  id: string;
  name: string;
  dealerCode: string;
  phone?: string;
}

export interface CustomerVerificationData {
  status: VerificationStatus;

  verifiedBy?: string;

  verifiedAt?: string;

  customerConfirmedCancellation?: boolean;

  verificationMethod?:
    | "CALL"
    | "OTP"
    | "EMAIL"
    | "MANUAL";

  remarks?: string;
}

export interface CancellationRequest {
  id: string;

  complaintId: string;
  complaintNumber: string;

  customer: CancellationCustomer;

  dealer?: CancellationDealer;

  productName: string;

  reason: CancellationReasonType;

  reasonLabel: string;

  description?: string;

  requestedBy: string;

  requestedByRole:
    | "DEALER"
    | "DG_TEAM"
    | "ADMIN"
    | "CUSTOMER";

  requestedAt: string;

  status: CancellationStatus;

  verification: CustomerVerificationData;

  approvalRemarks?: string;

  rejectionReason?: string;

  approvedBy?: string;

  approvedAt?: string;

  rejectedBy?: string;

  rejectedAt?: string;

  reassignedDealer?: CancellationDealer;

  createdAt: string;

  updatedAt: string;
}

export interface CreateCancellationPayload {
  complaintId: string;

  reason: CancellationReasonType;

  description?: string;
}

export interface VerifyCustomerPayload {
  cancellationId: string;

  customerConfirmedCancellation: boolean;

  verificationMethod:
    | "CALL"
    | "OTP"
    | "EMAIL"
    | "MANUAL";

  remarks?: string;
}

export interface ApproveCancellationPayload {
  cancellationId: string;

  remarks?: string;

  reassignAfterApproval?: boolean;
}

export interface RejectCancellationPayload {
  cancellationId: string;

  reason: string;
}

export interface ReassignCancellationPayload {
  cancellationId: string;

  dealerId: string;

  remarks?: string;
}