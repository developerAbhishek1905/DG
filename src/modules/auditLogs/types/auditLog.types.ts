export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "LOGIN"
  | "LOGOUT"
  | "APPROVE"
  | "REJECT"
  | "ASSIGN"
  | "REASSIGN"
  | "VERIFY"
  | "CANCEL"
  | "PAYMENT"
  | "EXPORT"
  | "STATUS_CHANGE";

export type AuditModule =
  | "AUTH"
  | "COMPLAINTS"
  | "DEALERS"
  | "ALLOCATION"
  | "APPOINTMENTS"
  | "PENDING_SLA"
  | "CANCELLATIONS"
  | "CLOSURES"
  | "VERIFICATION"
  | "BILLING"
  | "LEDGER"
  | "PAYMENTS"
  | "RECONCILIATION"
  | "REPORTS"
  | "USERS"
  | "ROLES_PERMISSIONS"
  | "SETTINGS"
  | "SYSTEM";

export interface AuditUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditChange {
  field: string;
  oldValue?: string | number | boolean | null;
  newValue?: string | number | boolean | null;
}

export interface AuditLog {
  id: string;

  user: AuditUser;

  action: AuditAction;

  module: AuditModule;

  description: string;

  entityId?: string;

  entityType?: string;

  ipAddress?: string;

  userAgent?: string;

  createdAt: string;

  changes?: AuditChange[];
}

export interface AuditLogFilters {
  search: string;

  action: AuditAction | "ALL";

  module: AuditModule | "ALL";

  userId: string;

  dateFrom: string;

  dateTo: string;
}

export interface AuditLogState {
  logs: AuditLog[];

  loading: boolean;

  error: string | null;

  selectedLog: AuditLog | null;

  filters: AuditLogFilters;
}