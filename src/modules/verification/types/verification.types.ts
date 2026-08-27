export type VerificationStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "CORRECTION_REQUIRED";

export type VerificationPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type VerificationSLAStatus =
  | "SAFE"
  | "WARNING"
  | "BREACHED"
  | "COMPLETED";

export type VerificationDecision =
  | "VERIFY"
  | "REJECT"
  | "CORRECTION";

export interface VerificationCustomer {
  id: string;
  name: string;
  phone: string;
  city: string;
}

export interface VerificationDealer {
  id: string;
  name: string;
  dealerCode: string;
  phone?: string;
}

export interface VerificationProof {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface VerificationClosureSummary {
  closureId: string;

  closureType:
    | "VISIT"
    | "PART"
    | "SERVICE"
    | "INSTALLATION"
    | "UNINSTALLATION";

  submittedAt: string;

  submittedBy: string;

  remarks?: string;

  proofs: VerificationProof[];

  workSummary: string;

  amount?: number;
}

export interface VerificationRecord {
  id: string;

  complaintId: string;
  complaintNumber: string;

  customer: VerificationCustomer;

  dealer: VerificationDealer;

  productName: string;

  closure: VerificationClosureSummary;

  status: VerificationStatus;

  priority: VerificationPriority;

  submittedAt: string;

  verificationDeadline: string;

  slaStatus: VerificationSLAStatus;

  assignedVerifier?: string;

  verifiedBy?: string;
  verifiedAt?: string;

  verificationRemarks?: string;

  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;

  correctionRequestedBy?: string;
  correctionRequestedAt?: string;
  correctionReason?: string;

  correctionCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface VerifyComplaintPayload {
  verificationId: string;

  remarks?: string;

  customerConfirmation?: boolean;

  proofVerified: boolean;

  workVerified: boolean;
}

export interface RejectVerificationPayload {
  verificationId: string;

  reason: string;

  remarks?: string;
}

export interface CorrectionRequestPayload {
  verificationId: string;

  reason: string;

  requiredCorrections: string[];

  remarks?: string;
}