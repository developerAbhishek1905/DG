export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";


  export interface UserRole {
  id: string;
  name: string;
  code: string;
  permissions: string[];
}
export interface AppUser {
  id: string;

  name: string;
  email: string;
  phone?: string;

  roleId: string;
  role: UserRole;

  dealerId?: string;
  dealerName?: string;

  status: UserStatus;

  lastLogin?: string;

  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;

  roleId: string;

  dealerId?: string;

  status: UserStatus;

  password?: string;
}