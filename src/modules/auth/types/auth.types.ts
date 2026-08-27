export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SERVICE_MANAGER"
  | "DEALER"
  | "TECHNICIAN"
  | "ACCOUNTS"
  | "VIEWER";

export type Permission = string;

export interface AuthUser {
  id: string;
  name: string;
  email: string;

  role: UserRole;

  permissions: Permission[];

  avatar?: string;

  dealerId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: AuthUser | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  loading: boolean;

  error: string | null;
}