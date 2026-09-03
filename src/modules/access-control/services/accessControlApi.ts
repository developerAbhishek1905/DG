import api from "../../../services/api/axios";
import {
//   PERMISSIONS,
  PERMISSION_LIST,
} from "../constants/permission.constants";

import type {
  Permission,
  Role,
  RoleFormData,
} from "../types/accessControl.types";

const ROLE_API = "/roles";


// const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// let roles: Role[] = [
//   {
//     id: "ROLE-001",

//     name: "Super Admin",

//     code: "SUPER_ADMIN",

//     description: "Full access to the entire application.",

//     permissions: Object.values(PERMISSIONS),

//     scopes: {
//       complaints: "ALL",
//       dealers: "ALL",
//       users: "ALL",
//     },

//     isSystemRole: true,

//     status: "ACTIVE",

//     usersCount: 1,

//     createdAt: "2026-01-01T10:00:00",

//     updatedAt: "2026-08-20T10:00:00",
//   },

//   {
//     id: "ROLE-002",

//     name: "DG Team",

//     code: "DG_TEAM",

//     description: "Complaint management and DG verification.",

//     permissions: [
//       PERMISSIONS.DASHBOARD_VIEW,

//       PERMISSIONS.COMPLAINT_VIEW,
//       PERMISSIONS.COMPLAINT_CREATE,
//       PERMISSIONS.COMPLAINT_UPDATE,
//       PERMISSIONS.COMPLAINT_ASSIGN,
//       PERMISSIONS.COMPLAINT_REASSIGN,
//       PERMISSIONS.COMPLAINT_CANCEL,
//       PERMISSIONS.COMPLAINT_VERIFY,

//       PERMISSIONS.DEALER_VIEW,

//       PERMISSIONS.APPOINTMENT_VIEW,

//       PERMISSIONS.REPORT_VIEW,
//     ],

//     scopes: {
//       complaints: "ALL",
//       dealers: "ALL",
//     },

//     isSystemRole: true,

//     status: "ACTIVE",

//     usersCount: 4,

//     createdAt: "2026-01-01T10:00:00",

//     updatedAt: "2026-08-20T10:00:00",
//   },

//   {
//     id: "ROLE-003",

//     name: "Service Manager",

//     code: "SERVICE_MANAGER",

//     description: "Manage service operations and dealers.",

//     permissions: [
//       PERMISSIONS.DASHBOARD_VIEW,

//       PERMISSIONS.COMPLAINT_VIEW,
//       PERMISSIONS.COMPLAINT_UPDATE,
//       PERMISSIONS.COMPLAINT_ASSIGN,

//       PERMISSIONS.DEALER_VIEW,
//       PERMISSIONS.DEALER_UPDATE,
//       PERMISSIONS.DEALER_PERFORMANCE_VIEW,

//       PERMISSIONS.APPOINTMENT_VIEW,
//       PERMISSIONS.APPOINTMENT_CREATE,
//       PERMISSIONS.APPOINTMENT_UPDATE,

//       PERMISSIONS.REPORT_VIEW,
//     ],

//     scopes: {
//       complaints: "ALL",
//       dealers: "ALL",
//     },

//     isSystemRole: true,

//     status: "ACTIVE",

//     usersCount: 3,

//     createdAt: "2026-01-01T10:00:00",

//     updatedAt: "2026-08-20T10:00:00",
//   },

//   {
//     id: "ROLE-004",

//     name: "Dealer",

//     code: "DEALER",

//     description: "Dealer access for assigned service operations.",

//     permissions: [
//       PERMISSIONS.DASHBOARD_VIEW,

//       PERMISSIONS.COMPLAINT_VIEW,
//       PERMISSIONS.COMPLAINT_UPDATE_STATUS,

//       PERMISSIONS.DEALER_VIEW,
//       PERMISSIONS.DEALER_PERFORMANCE_VIEW,

//       PERMISSIONS.APPOINTMENT_VIEW,
//       PERMISSIONS.APPOINTMENT_CREATE,
//       PERMISSIONS.APPOINTMENT_UPDATE,

//       PERMISSIONS.BILLING_VIEW,

//       PERMISSIONS.PAYMENT_VIEW,
//     ],

//     scopes: {
//       complaints: "DEALER",
//       dealers: "OWN",
//     },

//     isSystemRole: true,

//     status: "ACTIVE",

//     usersCount: 15,

//     createdAt: "2026-01-01T10:00:00",

//     updatedAt: "2026-08-20T10:00:00",
//   },

//   {
//     id: "ROLE-005",

//     name: "Accounts",

//     code: "ACCOUNTS",

//     description: "Billing, ledger and payment operations.",

//     permissions: [
//       PERMISSIONS.DASHBOARD_VIEW,

//       PERMISSIONS.BILLING_VIEW,
//       PERMISSIONS.BILLING_CREATE,
//       PERMISSIONS.BILLING_UPDATE,

//       PERMISSIONS.LEDGER_VIEW,

//       PERMISSIONS.PAYMENT_VIEW,
//       PERMISSIONS.PAYMENT_CREATE,
//       PERMISSIONS.PAYMENT_VERIFY,

//       PERMISSIONS.RECONCILIATION_VIEW,
//       PERMISSIONS.RECONCILIATION_MANAGE,

//       PERMISSIONS.REPORT_VIEW,
//     ],

//     isSystemRole: true,

//     status: "ACTIVE",

//     usersCount: 2,

//     createdAt: "2026-01-01T10:00:00",

//     updatedAt: "2026-08-20T10:00:00",
//   },
// ];

// export async function getRoles() {
//   await delay();

//   return [...roles];
// }

export async function getRoles(): Promise<Role[]> {
  const response = await api.get(ROLE_API);
  return response.data?.data ?? response.data;
}

export async function getRoleById(
  id: string
): Promise<Role | undefined> {
  const response = await api.get(`${ROLE_API}/${id}`);

  return response.data?.data ?? response.data;
}

/**
 * GET PERMISSIONS
 *
 * Aapne permissions ki separate backend API share nahi ki hai,
 * isliye filhal local permission list use kar rahe hain.
 */
export async function getPermissions(): Promise<Permission[]> {
  return PERMISSION_LIST;
}

/**
 * CREATE ROLE
 *
 * POST /api/v1/roles
 */
export async function createRole(
  data: RoleFormData
): Promise<Role> {
  const response = await api.post(ROLE_API, {
    name: data.name,
    description: data.description,
    status: data.status,
    permissions: data.permissions,
  });

  return response.data?.data ?? response.data;
}

/**
 * UPDATE COMPLETE ROLE
 *
 * PUT /api/v1/roles/:id
 */
export async function updateRole(
  id: string,
  data: RoleFormData
): Promise<Role> {
  const response = await api.put(`${ROLE_API}/${id}`, {
    name: data.name,
    description: data.description,
    status: data.status,
    permissions: data.permissions,
  });

  return response.data?.data ?? response.data;
}

/**
 * UPDATE ONLY ROLE STATUS
 *
 * PUT /api/v1/roles/:id
 *
 * Example:
 * {
 *   status: "INACTIVE"
 * }
 */
export async function updateRoleStatus(
  id: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<Role> {
  const response = await api.put(`${ROLE_API}/${id}`, {
    status,
  });

  return response.data?.data ?? response.data;
}

/**
 * UPDATE ONLY ROLE PERMISSIONS
 *
 * PUT /api/v1/roles/:id
 */
export async function updateRolePermissions(
  id: string,
  permissions: string[]
): Promise<Role> {
  const response = await api.put(`${ROLE_API}/${id}`, {
    permissions,
  });

  return response.data?.data ?? response.data;
}


/**
 * DELETE ROLE
 *
 * DELETE /api/v1/roles/:id
 */
export async function deleteRole(
  id: string
): Promise<boolean> {
  await api.delete(`${ROLE_API}/${id}`);

  return true;
}
