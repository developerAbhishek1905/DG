import api from "../../../services/api/axios";
import type { AppUser, UserFormData } from "../types/user.types";


// const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsers(): Promise<AppUser[]> {
  const response = await api.get("/users");

  // Depending on backend response structure
  return (
    response.data?.data ??
    response.data?.users ??
    response.data ??
    []
  );
}

export async function getUserById(id: string): Promise<AppUser | undefined> {
  const response = await api.get(`/users/${id}`);

  return (
    response.data?.data ??
    response.data?.user ??
    response.data
  );
}

export async function createUser(
  data: UserFormData,
  _roleName?: string
): Promise<AppUser> {
  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    roleId: data.roleId,
    status: data.status,
    ...(data.dealerId && {
      dealerId: data.dealerId,
    }),
  };

  const response = await api.post("/users", payload);

  return (
    response.data?.data ??
    response.data?.user ??
    response.data
  );
}

export async function updateUser(
  id: string,
  data: UserFormData,
  _roleName?: string
): Promise<AppUser> {
  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    roleId: data.roleId,
    status: data.status,
    ...(data.dealerId && {
      dealerId: data.dealerId,
    }),
  };

  const response = await api.put(`/users/${id}`, payload);

  return (
    response.data?.data ??
    response.data?.user ??
    response.data
  );
}


export async function deleteUser(id: string): Promise<boolean> {
  await api.delete(`/users/${id}`);

  return true;
}

export async function changeUserStatus(
  id: string,
  status: AppUser["status"]
): Promise<AppUser> {
  const response = await api.put(`/users/${id}`, {
    status,
  });

  return (
    response.data?.data ??
    response.data?.user ??
    response.data
  );
}
