import type {
  Notification,
  NotificationResponse,
} from "../types/notification.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

let notifications: Notification[] = [
  {
    id: "NOT-001",

    title: "New Complaint Created",

    message:
      "Complaint CMP-2026-1248 has been registered and requires dealer allocation.",

    type: "COMPLAINT",

    priority: "HIGH",

    isRead: false,

    createdAt:
      "2026-08-26T09:30:00",

    actionUrl:
      "/complaints/CMP-001",

    entityId:
      "CMP-001",

    entityType:
      "COMPLAINT",
  },

  {
    id: "NOT-002",

    title: "Dealer Allocated",

    message:
      "FastFix Appliances has been allocated to complaint CMP-2026-1247.",

    type: "ALLOCATION",

    priority: "MEDIUM",

    isRead: false,

    createdAt:
      "2026-08-26T09:15:00",

    actionUrl:
      "/complaints/CMP-002",

    entityId:
      "CMP-002",

    entityType:
      "COMPLAINT",
  },

  {
    id: "NOT-003",

    title: "Appointment Scheduled",

    message:
      "Customer appointment has been scheduled for complaint CMP-2026-1246.",

    type: "APPOINTMENT",

    priority: "MEDIUM",

    isRead: false,

    createdAt:
      "2026-08-26T08:55:00",

    actionUrl:
      "/appointments/APT-001",

    entityId:
      "APT-001",

    entityType:
      "APPOINTMENT",
  },

  {
    id: "NOT-004",

    title: "SLA Warning",

    message:
      "Complaint CMP-2026-1239 has less than 2 hours remaining before SLA breach.",

    type: "SLA",

    priority: "HIGH",

    isRead: false,

    createdAt:
      "2026-08-26T08:35:00",

    actionUrl:
      "/pending/sla",

    entityId:
      "CMP-039",

    entityType:
      "COMPLAINT",
  },

  {
    id: "NOT-005",

    title: "SLA Breached",

    message:
      "Complaint CMP-2026-1221 has exceeded its SLA target.",

    type: "SLA",

    priority: "CRITICAL",

    isRead: false,

    createdAt:
      "2026-08-26T08:10:00",

    actionUrl:
      "/pending/sla",

    entityId:
      "CMP-021",

    entityType:
      "COMPLAINT",
  },

  {
    id: "NOT-006",

    title: "Cancellation Request",

    message:
      "Dealer has submitted a cancellation request for complaint CMP-2026-1218.",

    type: "CANCELLATION",

    priority: "HIGH",

    isRead: true,

    createdAt:
      "2026-08-26T07:45:00",

    actionUrl:
      "/cancellations/CAN-001",

    entityId:
      "CAN-001",

    entityType:
      "CANCELLATION",
  },

  {
    id: "NOT-007",

    title: "Closure Submitted",

    message:
      "Service closure has been submitted and is waiting for verification.",

    type: "CLOSURE",

    priority: "MEDIUM",

    isRead: true,

    createdAt:
      "2026-08-26T07:20:00",

    actionUrl:
      "/verification",

    entityId:
      "CLS-001",

    entityType:
      "CLOSURE",
  },

  {
    id: "NOT-008",

    title: "Verification Required",

    message:
      "Complaint CMP-2026-1198 is waiting for closure verification.",

    type: "VERIFICATION",

    priority: "HIGH",

    isRead: false,

    createdAt:
      "2026-08-26T06:55:00",

    actionUrl:
      "/verification/CMP-198",

    entityId:
      "CMP-198",

    entityType:
      "COMPLAINT",
  },

  {
    id: "NOT-009",

    title: "Bill Generated",

    message:
      "Bill BILL-2026-0584 has been generated for ABC Service Center.",

    type: "BILLING",

    priority: "LOW",

    isRead: true,

    createdAt:
      "2026-08-25T18:20:00",

    actionUrl:
      "/billing/BILL-001",

    entityId:
      "BILL-001",

    entityType:
      "BILL",
  },

  {
    id: "NOT-010",

    title: "Payment Recorded",

    message:
      "₹10,000 payment has been recorded for ABC Service Center.",

    type: "PAYMENT",

    priority: "LOW",

    isRead: true,

    createdAt:
      "2026-08-25T17:45:00",

    actionUrl:
      "/payments/PAY-001",

    entityId:
      "PAY-001",

    entityType:
      "PAYMENT",
  },

  {
    id: "NOT-011",

    title: "Reconciliation Difference",

    message:
      "A ₹2,500 difference was detected during dealer reconciliation.",

    type: "RECONCILIATION",

    priority: "HIGH",

    isRead: false,

    createdAt:
      "2026-08-25T16:30:00",

    actionUrl:
      "/reconciliation/REC-001",

    entityId:
      "REC-001",

    entityType:
      "RECONCILIATION",
  },

  {
    id: "NOT-012",

    title: "System Update",

    message:
      "Complaint management system maintenance is scheduled for tonight.",

    type: "SYSTEM",

    priority: "LOW",

    isRead: true,

    createdAt:
      "2026-08-25T15:00:00",
  },
];

export async function getNotifications(): Promise<NotificationResponse> {
  await delay();

  return {
    notifications: [...notifications],

    total: notifications.length,

    unreadCount:
      notifications.filter(
        (notification) =>
          !notification.isRead
      ).length,
  };
}

export async function markNotificationRead(
  id: string
): Promise<Notification> {
  await delay(150);

  const notification =
    notifications.find(
      (item) =>
        item.id === id
    );

  if (!notification) {
    throw new Error(
      "Notification not found"
    );
  }

  notification.isRead = true;

  return {
    ...notification,
  };
}

export async function markAllNotificationsRead() {
  await delay(200);

  notifications =
    notifications.map(
      (notification) => ({
        ...notification,
        isRead: true,
      })
    );

  return true;
}

export async function deleteNotification(
  id: string
) {
  await delay(150);

  notifications =
    notifications.filter(
      (notification) =>
        notification.id !== id
    );

  return true;
}

export async function clearNotifications() {
  await delay(200);

  notifications = [];

  return true;
}