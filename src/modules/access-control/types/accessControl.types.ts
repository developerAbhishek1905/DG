export type RoleStatus =
  | "ACTIVE"
  | "INACTIVE";

export type DataScope =
  | "ALL"
  | "REGION"
  | "DEALER"
  | "ASSIGNED"
  | "OWN";

export interface Permission {
  id: string;

  key: string;

  module: string;

  action: string;

  label: string;

  description?: string;
}

export interface Role {
  id: string;

  name: string;

  code: string;

  description?: string;

  permissions: string[];

  scopes?: Record<
    string,
    DataScope
  >;

  isSystemRole: boolean;

  status: RoleStatus;

  usersCount?: number;

  createdAt: string;

  updatedAt: string;
}

export interface RoleFormData {
  name: string;

  code: string;

  description?: string;

  permissions: string[];

  scopes?: Record<
    string,
    DataScope
  >;

  status: RoleStatus;
}