import type {
  ForgotPasswordPayload,
  LoginCredentials,
  LoginResponse,
  ResetPasswordPayload,
} from "../types/auth.types";

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const loginApi = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  await delay(700);

  if (
    credentials.email !== "admin@dg.com" ||
    credentials.password !== "123456"
  ) {
    throw new Error(
      "Invalid email or password"
    );
  }

  return {
    success: true,

    message: "Login successful",

    data: {
      accessToken:
        "mock-access-token-123456",

      user: {
        id: "1",

        name: "DG Admin",

        email: "admin@dg.com",

        role: "SUPER_ADMIN",

        permissions: [
          "dashboard.view",

          "complaints.view",
          "complaints.create",
          "complaints.update",
          "complaints.delete",
          "complaints.assign",
          "complaints.schedule",
          "complaints.cancel",
          "complaints.close",

          "dealers.view",
          "dealers.create",
          "dealers.update",
          "dealers.delete",
          "dealers.performance.view",

          "appointments.view",
          "appointments.create",
          "appointments.update",

          "billing.view",

          "payments.view",

          "reconciliation.view",

          "reports.view",

          "settings.view",
        ],
      },
    },
  };
};

export const forgotPasswordApi = async (
  payload: ForgotPasswordPayload
) => {
  await delay(700);

  console.log(
    "Password reset requested:",
    payload.email
  );

  return {
    success: true,
    message:
      "Password reset instructions have been sent to your email.",
  };
};

export const resetPasswordApi = async (
  payload: ResetPasswordPayload
) => {
  await delay(700);

  console.log(
    "Password reset:",
    payload
  );

  return {
    success: true,
    message:
      "Your password has been reset successfully.",
  };
};