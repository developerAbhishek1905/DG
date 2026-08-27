export type NotificationType =
  | "COMPLAINT"
  | "ALLOCATION"
  | "APPOINTMENT"
  | "SLA"
  | "CANCELLATION"
  | "CLOSURE"
  | "VERIFICATION"
  | "BILLING"
  | "PAYMENT"
  | "RECONCILIATION"
  | "SYSTEM";

export type NotificationPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface Notification {
  id: string;

  title: string;

  message: string;

  type: NotificationType;

  priority: NotificationPriority;

  isRead: boolean;

  createdAt: string;

  /**
   * Route opened when notification is clicked.
   *
   * Example:
   * /complaints/CMP-001
   */
  actionUrl?: string;

  /**
   * Optional related entity information.
   */
  entityId?: string;

  entityType?: string;
}

export interface NotificationFilters {
  search: string;

  type: NotificationType | "ALL";

  status:
    | "ALL"
    | "READ"
    | "UNREAD";
}

export interface NotificationState {
  notifications: Notification[];

  loading: boolean;

  error: string | null;

  filters: NotificationFilters;
}

export interface NotificationResponse {
  notifications: Notification[];

  total: number;

  unreadCount: number;
}   