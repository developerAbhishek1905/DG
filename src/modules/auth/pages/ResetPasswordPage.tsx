import {
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useForm,
} from "react-hook-form";

import AuthBranding from
  "../components/AuthBranding";

import {
  resetPasswordApi,
} from "../services/authApi";

interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [
    searchParams,
  ] = useSearchParams();

  const token =
    searchParams.get("token");

  const [
    success,
    setSuccess,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<FormValues>();

  const password =
    watch("password");

  const onSubmit = async (
    data: FormValues
  ) => {
    if (!token) {
      return;
    }

    await resetPasswordApi({
      token,

      password:
        data.password,

      confirmPassword:
        data.confirmPassword,
    });

    setSuccess(true);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBranding />

      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900">
            Reset Password
          </h1>

          <p className="mb-8 mt-2 text-sm text-gray-500">
            Create a new secure
            password for your account.
          </p>

          {!token ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Invalid or missing
              password reset token.
            </div>
          ) : success ? (
            <div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                Password reset
                successfully.
              </div>

              <Link
                to="/login"
                className="mt-5 block text-center text-sm font-medium text-[#123B7A]"
              >
                Continue to Login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={
                handleSubmit(
                  onSubmit
                )
              }
              className="space-y-5"
            >
              <PasswordInput
                label="New Password"
                error={
                  errors.password
                    ?.message
                }
                {...register(
                  "password",
                  {
                    required:
                      "Password is required",

                    minLength: {
                      value: 6,
                      message:
                        "Minimum 6 characters required",
                    },
                  }
                )}
              />

              <PasswordInput
                label="Confirm Password"
                error={
                  errors
                    .confirmPassword
                    ?.message
                }
                {...register(
                  "confirmPassword",
                  {
                    required:
                      "Please confirm your password",

                    validate: (
                      value
                    ) =>
                      value ===
                        password ||
                      "Passwords do not match",
                  }
                )}
              />

              <button
                disabled={
                  isSubmitting
                }
                className="w-full rounded-lg bg-[#123B7A] py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSubmitting
                  ? "Updating..."
                  : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function PasswordInput({
  label,
  error,
  ...props
}: PasswordInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="password"
        {...props}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}