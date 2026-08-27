import {
  PERMISSIONS,
  PERMISSION_LIST,
} from "../constants/permission.constants";

import type {
  Permission,
  Role,
  RoleFormData,
} from "../types/accessControl.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

let roles: Role[] = [
  {
    id: "ROLE-001",

    name: "Super Admin",

    code:
      "SUPER_ADMIN",

    description:
      "Full access to the entire application.",

    permissions:
      Object.values(
        PERMISSIONS
      ),

    scopes: {
      complaints: "ALL",
      dealers: "ALL",
      users: "ALL",
    },

    isSystemRole: true,

    status: "ACTIVE",

    usersCount: 1,

    createdAt:
      "2026-01-01T10:00:00",

    updatedAt:
      "2026-08-20T10:00:00",
  },

  {
    id: "ROLE-002",

    name: "DG Team",

    code: "DG_TEAM",

    description:
      "Complaint management and DG verification.",

    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,

      PERMISSIONS.COMPLAINT_VIEW,
      PERMISSIONS.COMPLAINT_CREATE,
      PERMISSIONS.COMPLAINT_UPDATE,
      PERMISSIONS.COMPLAINT_ASSIGN,
      PERMISSIONS.COMPLAINT_REASSIGN,
      PERMISSIONS.COMPLAINT_CANCEL,
      PERMISSIONS.COMPLAINT_VERIFY,

      PERMISSIONS.DEALER_VIEW,

      PERMISSIONS.APPOINTMENT_VIEW,

      PERMISSIONS.REPORT_VIEW,
    ],

    scopes: {
      complaints: "ALL",
      dealers: "ALL",
    },

    isSystemRole: true,

    status: "ACTIVE",

    usersCount: 4,

    createdAt:
      "2026-01-01T10:00:00",

    updatedAt:
      "2026-08-20T10:00:00",
  },

  {
    id: "ROLE-003",

    name:
      "Service Manager",

    code:
      "SERVICE_MANAGER",

    description:
      "Manage service operations and dealers.",

    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,

      PERMISSIONS.COMPLAINT_VIEW,
      PERMISSIONS.COMPLAINT_UPDATE,
      PERMISSIONS.COMPLAINT_ASSIGN,

      PERMISSIONS.DEALER_VIEW,
      PERMISSIONS.DEALER_UPDATE,
      PERMISSIONS.DEALER_PERFORMANCE_VIEW,

      PERMISSIONS.APPOINTMENT_VIEW,
      PERMISSIONS.APPOINTMENT_CREATE,
      PERMISSIONS.APPOINTMENT_UPDATE,

      PERMISSIONS.REPORT_VIEW,
    ],

    scopes: {
      complaints: "ALL",
      dealers: "ALL",
    },

    isSystemRole: true,

    status: "ACTIVE",

    usersCount: 3,

    createdAt:
      "2026-01-01T10:00:00",

    updatedAt:
      "2026-08-20T10:00:00",
  },

  {
    id: "ROLE-004",

    name: "Dealer",

    code: "DEALER",

    description:
      "Dealer access for assigned service operations.",

    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,

      PERMISSIONS.COMPLAINT_VIEW,
      PERMISSIONS.COMPLAINT_UPDATE_STATUS,

      PERMISSIONS.DEALER_VIEW,
      PERMISSIONS.DEALER_PERFORMANCE_VIEW,

      PERMISSIONS.APPOINTMENT_VIEW,
      PERMISSIONS.APPOINTMENT_CREATE,
      PERMISSIONS.APPOINTMENT_UPDATE,

      PERMISSIONS.BILLING_VIEW,

      PERMISSIONS.PAYMENT_VIEW,
    ],

    scopes: {
      complaints: "DEALER",
      dealers: "OWN",
    },

    isSystemRole: true,

    status: "ACTIVE",

    usersCount: 15,

    createdAt:
      "2026-01-01T10:00:00",

    updatedAt:
      "2026-08-20T10:00:00",
  },

  {
    id: "ROLE-005",

    name: "Accounts",

    code: "ACCOUNTS",

    description:
      "Billing, ledger and payment operations.",

    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,

      PERMISSIONS.BILLING_VIEW,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_UPDATE,

      PERMISSIONS.LEDGER_VIEW,

      PERMISSIONS.PAYMENT_VIEW,
      PERMISSIONS.PAYMENT_CREATE,
      PERMISSIONS.PAYMENT_VERIFY,

      PERMISSIONS.RECONCILIATION_VIEW,
      PERMISSIONS.RECONCILIATION_MANAGE,

      PERMISSIONS.REPORT_VIEW,
    ],

    isSystemRole: true,

    status: "ACTIVE",

    usersCount: 2,

    createdAt:
      "2026-01-01T10:00:00",

    updatedAt:
      "2026-08-20T10:00:00",
  },
];

export async function getRoles() {
  await delay();

  return [...roles];
}

export async function getRoleById(
  id: string
) {
  await delay();

  return roles.find(
    (role) => role.id === id
  );
}

export async function getPermissions(): Promise<
  Permission[]
> {
  await delay();

  return PERMISSION_LIST;
}

export async function createRole(
  data: RoleFormData
) {
  await delay();

  const role: Role = {
    id: `ROLE-${String(
      roles.length + 1
    ).padStart(3, "0")}`,

    ...data,

    isSystemRole: false,

    usersCount: 0,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  };

  roles = [...roles, role];

  return role;
}

export async function updateRole(
  id: string,
  data: RoleFormData
) {
  await delay();

  const index =
    roles.findIndex(
      (role) =>
        role.id === id
    );

  if (index === -1) {
    return undefined;
  }

  roles[index] = {
    ...roles[index],

    ...data,

    updatedAt:
      new Date().toISOString(),
  };

  return roles[index];
}

export async function updateRolePermissions(
  id: string,
  permissions: string[]
) {
  await delay();

  const role =
    roles.find(
      (item) =>
        item.id === id
    );

  if (!role) {
    return undefined;
  }

  role.permissions =
    permissions;

  role.updatedAt =
    new Date().toISOString();

  return role;
}

export async function deleteRole(
  id: string
) {
  await delay();

  const role =
    roles.find(
      (item) =>
        item.id === id
    );

  if (
    !role ||
    role.isSystemRole
  ) {
    return false;
  }

  roles =
    roles.filter(
      (item) =>
        item.id !== id
    );

  return true;
}