import type {
  AuditLog,
} from "../types/auditLog.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const auditLogs: AuditLog[] = [
  {
    id: "AUD-001",

    user: {
      id: "USR-001",
      name: "Abhishek Sahu",
      email: "abhishek@example.com",
      role: "Super Admin",
    },

    action: "CREATE",

    module: "COMPLAINTS",

    description:
      "Created complaint CMP-2026-1248.",

    entityId: "CMP-2026-1248",

    entityType: "COMPLAINT",

    ipAddress: "192.168.1.10",

    userAgent:
      "Chrome / macOS",

    createdAt:
      "2026-08-26T10:30:00",

    changes: [
      {
        field: "status",
        oldValue: null,
        newValue: "OPEN",
      },
    ],
  },

  {
    id: "AUD-002",

    user: {
      id: "USR-002",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "Service Manager",
    },

    action: "ASSIGN",

    module: "ALLOCATION",

    description:
      "Allocated FastFix Appliances to complaint CMP-2026-1248.",

    entityId: "CMP-2026-1248",

    entityType: "COMPLAINT",

    ipAddress: "192.168.1.14",

    userAgent:
      "Chrome / Windows",

    createdAt:
      "2026-08-26T10:15:00",

    changes: [
      {
        field: "dealer",
        oldValue: null,
        newValue: "FastFix Appliances",
      },

      {
        field: "status",
        oldValue: "OPEN",
        newValue: "ALLOCATED",
      },
    ],
  },

  {
    id: "AUD-003",

    user: {
      id: "USR-003",
      name: "Priya Verma",
      email: "priya@example.com",
      role: "Operations Executive",
    },

    action: "UPDATE",

    module: "APPOINTMENTS",

    description:
      "Rescheduled appointment APT-2026-0218.",

    entityId: "APT-2026-0218",

    entityType: "APPOINTMENT",

    ipAddress: "192.168.1.18",

    userAgent:
      "Edge / Windows",

    createdAt:
      "2026-08-26T09:55:00",

    changes: [
      {
        field: "appointmentDate",
        oldValue:
          "2026-08-26 11:00",
        newValue:
          "2026-08-27 14:00",
      },
    ],
  },

  {
    id: "AUD-004",

    user: {
      id: "USR-004",
      name: "Amit Jain",
      email: "amit@example.com",
      role: "Verifier",
    },

    action: "VERIFY",

    module: "VERIFICATION",

    description:
      "Verified closure for complaint CMP-2026-1198.",

    entityId: "CMP-2026-1198",

    entityType: "COMPLAINT",

    ipAddress: "192.168.1.20",

    userAgent:
      "Chrome / Windows",

    createdAt:
      "2026-08-26T09:30:00",

    changes: [
      {
        field: "verificationStatus",
        oldValue: "PENDING",
        newValue: "VERIFIED",
      },
    ],
  },

  {
    id: "AUD-005",

    user: {
      id: "USR-005",
      name: "Neha Patel",
      email: "neha@example.com",
      role: "Finance Manager",
    },

    action: "APPROVE",

    module: "BILLING",

    description:
      "Approved bill BILL-2026-0584 for ₹1,416.",

    entityId: "BILL-2026-0584",

    entityType: "BILL",

    ipAddress: "192.168.1.22",

    userAgent:
      "Chrome / macOS",

    createdAt:
      "2026-08-26T09:10:00",

    changes: [
      {
        field: "status",
        oldValue: "PENDING",
        newValue: "APPROVED",
      },
    ],
  },

  {
    id: "AUD-006",

    user: {
      id: "USR-005",
      name: "Neha Patel",
      email: "neha@example.com",
      role: "Finance Manager",
    },

    action: "PAYMENT",

    module: "PAYMENTS",

    description:
      "Recorded ₹10,000 dealer payment.",

    entityId: "PAY-2026-0326",

    entityType: "PAYMENT",

    ipAddress: "192.168.1.22",

    userAgent:
      "Chrome / macOS",

    createdAt:
      "2026-08-26T08:45:00",

    changes: [
      {
        field: "paymentStatus",
        oldValue: null,
        newValue: "SUCCESS",
      },
    ],
  },

  {
    id: "AUD-007",

    user: {
      id: "USR-001",
      name: "Abhishek Sahu",
      email: "abhishek@example.com",
      role: "Super Admin",
    },

    action: "UPDATE",

    module: "ROLES_PERMISSIONS",

    description:
      "Updated permissions for Service Manager role.",

    entityId: "ROLE-002",

    entityType: "ROLE",

    ipAddress: "192.168.1.10",

    userAgent:
      "Chrome / macOS",

    createdAt:
      "2026-08-26T08:20:00",

    changes: [
      {
        field: "complaint.delete",
        oldValue: false,
        newValue: true,
      },

      {
        field: "billing.approve",
        oldValue: true,
        newValue: false,
      },
    ],
  },

  {
    id: "AUD-008",

    user: {
      id: "USR-006",
      name: "Vikas Singh",
      email: "vikas@example.com",
      role: "Admin",
    },

    action: "REJECT",

    module: "CANCELLATIONS",

    description:
      "Rejected cancellation request CAN-2026-0091.",

    entityId: "CAN-2026-0091",

    entityType: "CANCELLATION",

    ipAddress: "192.168.1.28",

    userAgent:
      "Firefox / Windows",

    createdAt:
      "2026-08-26T08:00:00",

    changes: [
      {
        field: "status",
        oldValue: "PENDING",
        newValue: "REJECTED",
      },
    ],
  },

  {
    id: "AUD-009",

    user: {
      id: "USR-001",
      name: "Abhishek Sahu",
      email: "abhishek@example.com",
      role: "Super Admin",
    },

    action: "LOGIN",

    module: "AUTH",

    description:
      "User logged into the application.",

    ipAddress: "192.168.1.10",

    userAgent:
      "Chrome / macOS",

    createdAt:
      "2026-08-26T07:45:00",
  },

  {
    id: "AUD-010",

    user: {
      id: "USR-007",
      name: "Rohit Mehta",
      email: "rohit@example.com",
      role: "Report Manager",
    },

    action: "EXPORT",

    module: "REPORTS",

    description:
      "Exported Complaint Report as Excel.",

    entityType: "REPORT",

    ipAddress: "192.168.1.32",

    userAgent:
      "Chrome / Windows",

    createdAt:
      "2026-08-26T07:20:00",
  },
];

export async function getAuditLogs(): Promise<AuditLog[]> {
  await delay();

  return auditLogs.map(
    (log) => ({
      ...log,

      user: {
        ...log.user,
      },

      changes:
        log.changes?.map(
          (change) => ({
            ...change,
          })
        ),
    })
  );
}

export async function getAuditLogById(
  id: string
): Promise<AuditLog> {
  await delay(150);

  const log =
    auditLogs.find(
      (item) =>
        item.id === id
    );

  if (!log) {
    throw new Error(
      "Audit log not found"
    );
  }

  return {
    ...log,

    user: {
      ...log.user,
    },

    changes:
      log.changes?.map(
        (change) => ({
          ...change,
        })
      ),
  };
}