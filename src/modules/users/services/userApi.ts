import type {
  AppUser,
  UserFormData,
} from "../types/user.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

let users: AppUser[] = [
  {
    id: "USR-001",

    name: "Abhishek Admin",

    email: "admin@dg.com",

    phone: "9876543210",

    roleId: "ROLE-001",

    roleName: "Super Admin",

    status: "ACTIVE",

    lastLogin:
      "2026-08-25T09:30:00",

    createdAt:
      "2026-01-10T10:00:00",

    updatedAt:
      "2026-08-20T10:00:00",
  },

  {
    id: "USR-002",

    name: "Rahul Sharma",

    email: "rahul@dg.com",

    phone: "9876500001",

    roleId: "ROLE-002",

    roleName: "DG Team",

    status: "ACTIVE",

    lastLogin:
      "2026-08-24T11:00:00",

    createdAt:
      "2026-02-15T09:00:00",

    updatedAt:
      "2026-08-24T11:00:00",
  },

  {
    id: "USR-003",

    name: "Amit Verma",

    email: "dealer@dg.com",

    phone: "9876500002",

    roleId: "ROLE-004",

    roleName: "Dealer",

    dealerId: "DLR-001",

    dealerName:
      "ABC Service Center",

    status: "ACTIVE",

    lastLogin:
      "2026-08-23T16:00:00",

    createdAt:
      "2026-03-12T10:00:00",

    updatedAt:
      "2026-08-23T16:00:00",
  },

  {
    id: "USR-004",

    name: "Pooja Jain",

    email: "accounts@dg.com",

    phone: "9876500003",

    roleId: "ROLE-005",

    roleName: "Accounts",

    status: "ACTIVE",

    lastLogin:
      "2026-08-24T15:00:00",

    createdAt:
      "2026-04-18T10:00:00",

    updatedAt:
      "2026-08-24T15:00:00",
  },

  {
    id: "USR-005",

    name: "Rakesh Singh",

    email: "rakesh@dg.com",

    phone: "9876500004",

    roleId: "ROLE-003",

    roleName: "Service Manager",

    status: "SUSPENDED",

    createdAt:
      "2026-05-20T10:00:00",

    updatedAt:
      "2026-08-10T10:00:00",
  },
];

export async function getUsers() {
  await delay();

  return [...users];
}

export async function getUserById(
  id: string
) {
  await delay();

  return users.find(
    (user) => user.id === id
  );
}

export async function createUser(
  data: UserFormData,
  roleName: string
) {
  await delay();

  const user: AppUser = {
    id: `USR-${String(
      users.length + 1
    ).padStart(3, "0")}`,

    name: data.name,

    email: data.email,

    phone: data.phone,

    roleId: data.roleId,

    roleName,

    dealerId:
      data.dealerId || undefined,

    status: data.status,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  };

  users = [...users, user];

  return user;
}

export async function updateUser(
  id: string,
  data: UserFormData,
  roleName: string
) {
  await delay();

  const index = users.findIndex(
    (user) => user.id === id
  );

  if (index === -1) {
    return undefined;
  }

  users[index] = {
    ...users[index],

    name: data.name,

    email: data.email,

    phone: data.phone,

    roleId: data.roleId,

    roleName,

    dealerId:
      data.dealerId || undefined,

    status: data.status,

    updatedAt:
      new Date().toISOString(),
  };

  return users[index];
}

export async function deleteUser(
  id: string
) {
  await delay();

  const exists = users.some(
    (user) => user.id === id
  );

  if (!exists) return false;

  users = users.filter(
    (user) => user.id !== id
  );

  return true;
}

export async function changeUserStatus(
  id: string,
  status: AppUser["status"]
) {
  await delay();

  const user = users.find(
    (item) => item.id === id
  );

  if (!user) return undefined;

  user.status = status;

  user.updatedAt =
    new Date().toISOString();

  return user;
}