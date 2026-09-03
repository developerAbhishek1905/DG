import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../types/auth.types";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    const result = await login(data);

    if (!result.success) {
      return;
    }

    const from =
      (
        location.state as {
          from?: string;
        } | null
      )?.from ?? "/dashboard";

    navigate(from, {
      replace: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="email"
            placeholder="admin@dg.com"
            {...register("email", {
              required: "Email is required",

              pattern: {
                value: /^\S+@\S+\.\S+$/,

                message: "Enter a valid email",
              },
            })}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Password
        </label>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",

              minLength: {
                value: 6,

                message: "Password must contain at least 6 characters",
              },
            })}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="rounded border-gray-300"
          />
          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="text-sm font-medium text-[#123B7A] hover:underline"
        >
          Forgot password?
        </Link>
      </div> */}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#123B7A] py-3 text-sm font-semibold text-white transition hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
