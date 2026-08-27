import type {
  BillingSettings,
  NotificationSettings,
  PermissionSetting,
  ReasonOption,
  SLASettings,
  StatusOption,
} from "../types/settings.types";

const delay = (ms = 250) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

let slaSettings: SLASettings = {
  allocationSlaHours: 4,

  appointmentSlaHours: 24,

  serviceSlaHours: 48,

  verificationSlaHours: 8,

  warningBeforeHours: 2,

  enableEscalation: true,

  escalationAfterHours: 2,
};

let notificationSettings: NotificationSettings = {
  complaintCreated: true,

  dealerAllocated: true,

  appointmentScheduled: true,

  slaWarning: true,

  slaBreached: true,

  cancellationRequested: true,

  closureSubmitted: true,

  verificationCompleted: true,

  billGenerated: true,

  paymentRecorded: true,

  reconciliationMismatch: true,

  emailNotifications: true,

  inAppNotifications: true,

  pushNotifications: false,
};

let billingSettings: BillingSettings = {
  autoGenerateBill: true,

  billAfterVerification: true,

  allowManualBill: false,

  defaultTaxPercentage: 18,

  roundOffEnabled: true,

  requireBillApproval: true,

  allowBillRejection: true,

  autoPostLedger: true,
};

let statuses: StatusOption[] = [
  {
    id: "STS-001",
    module: "COMPLAINTS",
    code: "OPEN",
    label: "Open",
    active: true,
    sortOrder: 1,
  },

  {
    id: "STS-002",
    module: "COMPLAINTS",
    code: "ALLOCATED",
    label: "Allocated",
    active: true,
    sortOrder: 2,
  },

  {
    id: "STS-003",
    module: "COMPLAINTS",
    code: "IN_PROGRESS",
    label: "In Progress",
    active: true,
    sortOrder: 3,
  },

  {
    id: "STS-004",
    module: "COMPLAINTS",
    code: "CLOSURE_SUBMITTED",
    label: "Closure Submitted",
    active: true,
    sortOrder: 4,
  },

  {
    id: "STS-005",
    module: "COMPLAINTS",
    code: "CLOSED",
    label: "Closed",
    active: true,
    sortOrder: 5,
  },

  {
    id: "STS-006",
    module: "VERIFICATION",
    code: "PENDING",
    label: "Pending",
    active: true,
    sortOrder: 1,
  },

  {
    id: "STS-007",
    module: "VERIFICATION",
    code: "VERIFIED",
    label: "Verified",
    active: true,
    sortOrder: 2,
  },

  {
    id: "STS-008",
    module: "VERIFICATION",
    code: "REJECTED",
    label: "Rejected",
    active: true,
    sortOrder: 3,
  },
];

let cancellationReasons: ReasonOption[] = [
  {
    id: "CR-001",
    code: "CUSTOMER_REQUEST",
    label: "Customer Request",
    description:
      "Customer no longer requires service.",
    active: true,
    sortOrder: 1,
  },

  {
    id: "CR-002",
    code: "WRONG_COMPLAINT",
    label: "Wrong Complaint",
    active: true,
    sortOrder: 2,
  },

  {
    id: "CR-003",
    code: "CUSTOMER_UNAVAILABLE",
    label: "Customer Unavailable",
    active: true,
    sortOrder: 3,
  },

  {
    id: "CR-004",
    code: "DUPLICATE_COMPLAINT",
    label: "Duplicate Complaint",
    active: true,
    sortOrder: 4,
  },
];

let pendingReasons: ReasonOption[] = [
  {
    id: "PR-001",
    code: "PART_NOT_AVAILABLE",
    label: "Part Not Available",
    active: true,
    sortOrder: 1,
  },

  {
    id: "PR-002",
    code: "CUSTOMER_UNAVAILABLE",
    label: "Customer Unavailable",
    active: true,
    sortOrder: 2,
  },

  {
    id: "PR-003",
    code: "TECHNICIAN_DELAY",
    label: "Technician Delay",
    active: true,
    sortOrder: 3,
  },

  {
    id: "PR-004",
    code: "AWAITING_APPROVAL",
    label: "Awaiting Approval",
    active: true,
    sortOrder: 4,
  },
];

let permissionSettings: PermissionSetting[] = [
  {
    module: "Complaints",
    action: "view",
    enabled: true,
    defaultAllowed: true,
  },

  {
    module: "Complaints",
    action: "create",
    enabled: true,
    defaultAllowed: false,
  },

  {
    module: "Billing",
    action: "approve",
    enabled: true,
    defaultAllowed: false,
  },

  {
    module: "Payments",
    action: "create",
    enabled: true,
    defaultAllowed: false,
  },

  {
    module: "Audit Logs",
    action: "view",
    enabled: true,
    defaultAllowed: false,
  },
];

export async function getSLASettings() {
  await delay();

  return {
    ...slaSettings,
  };
}

export async function updateSLASettings(
  data: SLASettings
) {
  await delay();

  slaSettings = {
    ...data,
  };

  return {
    ...slaSettings,
  };
}

export async function getNotificationSettings() {
  await delay();

  return {
    ...notificationSettings,
  };
}

export async function updateNotificationSettings(
  data: NotificationSettings
) {
  await delay();

  notificationSettings = {
    ...data,
  };

  return {
    ...notificationSettings,
  };
}

export async function getBillingSettings() {
  await delay();

  return {
    ...billingSettings,
  };
}

export async function updateBillingSettings(
  data: BillingSettings
) {
  await delay();

  billingSettings = {
    ...data,
  };

  return {
    ...billingSettings,
  };
}

export async function getStatusSettings() {
  await delay();

  return statuses.map(
    (item) => ({
      ...item,
    })
  );
}

export async function updateStatus(
  id: string,
  data: Partial<StatusOption>
) {
  await delay();

  const index =
    statuses.findIndex(
      (item) =>
        item.id === id
    );

  if (index === -1) {
    throw new Error(
      "Status not found"
    );
  }

  statuses[index] = {
    ...statuses[index],
    ...data,
  };

  return {
    ...statuses[index],
  };
}

export async function getCancellationReasons() {
  await delay();

  return cancellationReasons.map(
    (item) => ({
      ...item,
    })
  );
}

export async function getPendingReasons() {
  await delay();

  return pendingReasons.map(
    (item) => ({
      ...item,
    })
  );
}

export async function createCancellationReason(
  data: Omit<ReasonOption, "id">
) {
  await delay();

  const reason: ReasonOption = {
    id: `CR-${Date.now()}`,
    ...data,
  };

  cancellationReasons.push(
    reason
  );

  return reason;
}

export async function createPendingReason(
  data: Omit<ReasonOption, "id">
) {
  await delay();

  const reason: ReasonOption = {
    id: `PR-${Date.now()}`,
    ...data,
  };

  pendingReasons.push(
    reason
  );

  return reason;
}

export async function updateCancellationReason(
  id: string,
  data: Partial<ReasonOption>
) {
  await delay();

  const index =
    cancellationReasons.findIndex(
      (item) =>
        item.id === id
    );

  if (index === -1) {
    throw new Error(
      "Reason not found"
    );
  }

  cancellationReasons[index] = {
    ...cancellationReasons[index],
    ...data,
  };

  return {
    ...cancellationReasons[index],
  };
}

export async function updatePendingReason(
  id: string,
  data: Partial<ReasonOption>
) {
  await delay();

  const index =
    pendingReasons.findIndex(
      (item) =>
        item.id === id
    );

  if (index === -1) {
    throw new Error(
      "Reason not found"
    );
  }

  pendingReasons[index] = {
    ...pendingReasons[index],
    ...data,
  };

  return {
    ...pendingReasons[index],
  };
}

export async function getPermissionSettings() {
  await delay();

  return permissionSettings.map(
    (item) => ({
      ...item,
    })
  );
}

export async function updatePermissionSettings(
  data: PermissionSetting[]
) {
  await delay();

  permissionSettings =
    data.map(
      (item) => ({
        ...item,
      })
    );

  return permissionSettings;
}