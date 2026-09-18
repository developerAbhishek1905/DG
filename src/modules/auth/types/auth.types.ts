export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SERVICE_MANAGER"
  | "DEALER"
  | "TECHNICIAN"
  | "ACCOUNTS"
  | "VIEWER";

export type Permission = string;

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;

//   role: UserRole;

//   permissions: Permission[];

//   avatar?: string;

//   dealerId?: string;
// }

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;

  roleId: string;

  role: {
    id: string;
    name: string;
    code: string;
    permissions: string[];
  };

  dealerId?: string;

  dealer?: {
    _id: string;
    headCode?: string;
    technicianFirmName?: string;
    technicianName?: string;
    mobileNumber?: string;

    billingType:
      | "FIXED"
      | "PARTIAL_PAYMENT"
      | "PROFIT_SHARING";

    billingPercentage: number;

    cancellationBillingEnabled?: boolean;
    cancellationCharge?: number;
  };

  status: string;
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
    token: string;
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

  token: string | null;

  isAuthenticated: boolean;

  loading: boolean;

  error: string | null;
}