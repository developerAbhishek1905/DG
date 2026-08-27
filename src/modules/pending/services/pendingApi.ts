import type {
  PendingActionPayload,
  PendingComplaint,
  PendingReason,
  SetPendingPayload,
  SLAStatus,
} from "../types/pending.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const PENDING_REASON_LABELS: Record<
  PendingReason,
  string
> = {
  WAITING_FOR_CUSTOMER:
    "Waiting for Customer",

  PRODUCT_INSPECTION_PENDING:
    "Product Inspection Pending",

  SPARE_PARTS_NOT_AVAILABLE:
    "Spare Parts Not Available",

  DEALER_UNAVAILABLE:
    "Dealer Unavailable",

  CUSTOMER_RESCHEDULE_REQUEST:
    "Customer Requested Reschedule",

  TECHNICAL_SUPPORT_REQUIRED:
    "Technical Support Required",

  OTHER: "Other",
};

function calculateSLAStatus(
  deadline: string
): SLAStatus {
  const now =
    new Date().getTime();

  const end =
    new Date(
      deadline
    ).getTime();

  const remaining =
    end - now;

  if (remaining <= 0) {
    return "BREACHED";
  }

  const warningLimit =
    2 * 60 * 60 * 1000;

  if (
    remaining <=
    warningLimit
  ) {
    return "WARNING";
  }

  return "SAFE";
}

let pendingComplaints: PendingComplaint[] =
  [
    {
      id: "PND-001",

      complaintId:
        "CMP-001",

      complaintNumber:
        "CMP-2026-0001",

      customer: {
        id: "CUS-001",

        name:
          "Rahul Sharma",

        phone:
          "9876543210",

        city: "Indore",
      },

      dealer: {
        id: "DLR-002",

        name:
          "FastFix Appliances",

        dealerCode:
          "DLR-002",

        phone:
          "9876500001",
      },

      productName:
        "Air Conditioner",

      reason:
        "WAITING_FOR_CUSTOMER",

      reasonLabel:
        "Waiting for Customer",

      remarks:
        "Customer requested callback after office hours.",

      pendingSince:
        "2026-08-25T09:00:00",

      slaDeadline:
        "2026-08-25T20:30:00",

      slaStatus: "SAFE",

      status: "PENDING",

      reminderCount: 1,

      lastReminderAt:
        "2026-08-25T12:00:00",

      createdAt:
        "2026-08-25T09:00:00",

      updatedAt:
        "2026-08-25T12:00:00",
    },

    {
      id: "PND-002",

      complaintId:
        "CMP-002",

      complaintNumber:
        "CMP-2026-0002",

      customer: {
        id: "CUS-002",

        name:
          "Priya Verma",

        phone:
          "9988776655",

        city: "Indore",
      },

      dealer: {
        id: "DLR-001",

        name:
          "ABC Service Center",

        dealerCode:
          "DLR-001",

        phone:
          "9876500000",
      },

      productName:
        "Washing Machine",

      reason:
        "SPARE_PARTS_NOT_AVAILABLE",

      reasonLabel:
        "Spare Parts Not Available",

      remarks:
        "Drain motor required.",

      pendingSince:
        "2026-08-24T10:00:00",

      slaDeadline:
        "2026-08-25T15:00:00",

      slaStatus:
        "WARNING",

      status:
        "PENDING",

      reminderCount: 2,

      lastReminderAt:
        "2026-08-25T13:00:00",

      createdAt:
        "2026-08-24T10:00:00",

      updatedAt:
        "2026-08-25T13:00:00",
    },

    {
      id: "PND-003",

      complaintId:
        "CMP-003",

      complaintNumber:
        "CMP-2026-0003",

      customer: {
        id: "CUS-003",

        name:
          "Amit Jain",

        phone:
          "9898989898",

        city: "Bhopal",
      },

      dealer: {
        id: "DLR-003",

        name:
          "Reliable Electronics",

        dealerCode:
          "DLR-003",

        phone:
          "9876500002",
      },

      productName:
        "Refrigerator",

      reason:
        "PRODUCT_INSPECTION_PENDING",

      reasonLabel:
        "Product Inspection Pending",

      remarks:
        "Technical diagnosis pending.",

      pendingSince:
        "2026-08-23T08:00:00",

      slaDeadline:
        "2026-08-24T18:00:00",

      slaStatus:
        "BREACHED",

      status:
        "PENDING",

      reminderCount: 4,

      lastReminderAt:
        "2026-08-25T10:00:00",

      createdAt:
        "2026-08-23T08:00:00",

      updatedAt:
        "2026-08-25T10:00:00",
    },
  ];

export async function getPendingComplaints() {
  await delay();

  pendingComplaints =
    pendingComplaints.map(
      (item) => ({
        ...item,

        slaStatus:
          item.status ===
          "RESOLVED"
            ? "RESOLVED"
            : calculateSLAStatus(
                item.slaDeadline
              ),
      })
    );

  return [
    ...pendingComplaints,
  ];
}

export async function getPendingComplaintById(
  id: string
) {
  await delay();

  return pendingComplaints.find(
    (item) =>
      item.id === id
  );
}

export async function setComplaintPending(
  payload: SetPendingPayload
) {
  await delay();

  const now =
    new Date();

  const deadline =
    new Date(now);

  deadline.setHours(
    deadline.getHours() + 24
  );

  const pending: PendingComplaint =
    {
      id: `PND-${String(
        pendingComplaints.length +
          1
      ).padStart(3, "0")}`,

      complaintId:
        payload.complaintId,

      complaintNumber:
        payload.complaintId,

      customer: {
        id: "CUS-MOCK",
        name:
          "Mock Customer",
        phone:
          "9999999999",
        city: "Indore",
      },

      dealer: {
        id: "DLR-MOCK",

        name:
          "Mock Dealer",

        dealerCode:
          "DLR-MOCK",

        phone:
          "9999999998",
      },

      productName:
        "Mock Product",

      reason:
        payload.reason,

      reasonLabel:
        PENDING_REASON_LABELS[
          payload.reason
        ],

      remarks:
        payload.remarks,

      pendingSince:
        now.toISOString(),

      slaDeadline:
        deadline.toISOString(),

      slaStatus: "SAFE",

      status: "PENDING",

      reminderCount: 0,

      createdAt:
        now.toISOString(),

      updatedAt:
        now.toISOString(),
    };

  pendingComplaints = [
    pending,
    ...pendingComplaints,
  ];

  return pending;
}

export async function updatePendingAction(
  payload: PendingActionPayload
) {
  await delay();

  const pending =
    pendingComplaints.find(
      (item) =>
        item.id ===
        payload.pendingId
    );

  if (!pending) {
    throw new Error(
      "Pending complaint not found"
    );
  }

  switch (payload.action) {
    case "RESOLVE":
      pending.status =
        "RESOLVED";

      pending.slaStatus =
        "RESOLVED";
      break;

    case "REASSIGN":
      pending.status =
        "REASSIGNED";
      break;

    case "ESCALATE":
      pending.status =
        "ESCALATED";
      break;

    case "CANCEL":
      pending.status =
        "CANCELLED";
      break;

    case "CONTINUE": {
      const newDeadline =
        new Date();

      newDeadline.setHours(
        newDeadline.getHours() +
          24
      );

      pending.slaDeadline =
        newDeadline.toISOString();

      pending.slaStatus =
        "SAFE";

      pending.status =
        "PENDING";
      break;
    }
  }

  pending.updatedAt =
    new Date().toISOString();

  return pending;
}

export async function sendPendingReminder(
  id: string
) {
  await delay();

  const pending =
    pendingComplaints.find(
      (item) =>
        item.id === id
    );

  if (!pending) {
    throw new Error(
      "Pending complaint not found"
    );
  }

  pending.reminderCount +=
    1;

  pending.lastReminderAt =
    new Date().toISOString();

  pending.updatedAt =
    new Date().toISOString();

  return pending;
}