export interface SLASettings {
  allocationSlaHours: number;

  appointmentSlaHours: number;

  serviceSlaHours: number;

  verificationSlaHours: number;

  warningBeforeHours: number;

  enableEscalation: boolean;

  escalationAfterHours: number;
}

export interface NotificationSettings {
  complaintCreated: boolean;

  dealerAllocated: boolean;

  appointmentScheduled: boolean;

  slaWarning: boolean;

  slaBreached: boolean;

  cancellationRequested: boolean;

  closureSubmitted: boolean;

  verificationCompleted: boolean;

  billGenerated: boolean;

  paymentRecorded: boolean;

  reconciliationMismatch: boolean;

  emailNotifications: boolean;

  inAppNotifications: boolean;

  pushNotifications: boolean;
}

export interface BillingSettings {
  autoGenerateBill: boolean;

  billAfterVerification: boolean;

  allowManualBill: boolean;

  defaultTaxPercentage: number;

  roundOffEnabled: boolean;

  requireBillApproval: boolean;

  allowBillRejection: boolean;

  autoPostLedger: boolean;
}

export interface StatusOption {
  id: string;

  module: string;

  code: string;

  label: string;

  active: boolean;

  sortOrder: number;
}

export interface ReasonOption {
  id: string;

  code: string;

  label: string;

  description?: string;

  active: boolean;

  sortOrder: number;
}

export interface PermissionSetting {
  module: string;

  action: string;

  enabled: boolean;

  defaultAllowed: boolean;
}

export interface SettingsState {
  sla: SLASettings | null;

  notifications: NotificationSettings | null;

  billing: BillingSettings | null;

  statuses: StatusOption[];

  cancellationReasons: ReasonOption[];

  pendingReasons: ReasonOption[];

  permissions: PermissionSetting[];

  loading: boolean;

  saving: boolean;

  error: string | null;
}