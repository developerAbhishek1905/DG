import { useEffect } from "react";

import { useForm } from "react-hook-form";

import type { Role } from "../../access-control/types/accessControl.types";

import type { AppUser, UserFormData } from "../types/user.types";

interface Props {
  user?: AppUser;

  roles: Role[];

  onSubmit: (data: UserFormData) => Promise<void> | void;

  submitLabel?: string;
}

export default function UserForm({
  user,
  roles,
  onSubmit,
  submitLabel = "Save User",
}: Props) {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    defaultValues: {
      name: user?.name ?? "",

      email: user?.email ?? "",

      phone: user?.phone ?? "",

      roleId: user?.roleId ?? "",

      dealerId: user?.dealerId ?? "",

      status: user?.status ?? "ACTIVE",

      password: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      roleId: user.roleId,
      dealerId: user.dealerId ?? "",
      status: user.status,
      password: "",
    });
  }, [user, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <section>
        <h3 className="text-base font-semibold text-gray-900">
          User Information
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Full Name"
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
            })}
          />

          <Input
            label="Email Address"
            type="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
            })}
          />

          <Input label="Phone Number" {...register("phone")} />

          {!user && (
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",

                minLength: {
                  value: 6,

                  message: "Minimum 6 characters required",
                },
              })}
            />
          )}
        </div>
      </section>

      <section className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-semibold text-gray-900">
          Access Configuration
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>

            <select
              {...register("roleId", {
                required: "Role is required",
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="">Select Role</option>

              {roles
                .filter((role) => role.status === "ACTIVE")
                .map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
            </select>

            {errors.roleId && (
              <p className="mt-1 text-xs text-red-600">
                {errors.roleId.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              {...register("status")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="ACTIVE">Active</option>

              <option value="INACTIVE">Inactive</option>

              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* <Input
            label="Dealer ID (optional)"
            placeholder="DLR-001"
            {...register("dealerId")}
          /> */}
        </div>
      </section>

      <div className="flex justify-end border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
