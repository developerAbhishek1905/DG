import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import PermissionMatrix from "./PermissionMatrix";

import type {
  Permission,
  Role,
  RoleFormData,
} from "../types/accessControl.types";
import { usePermission } from "../../../hooks/usePermission";

interface Props {
  role?: Role;

  permissions: Permission[];

  onSubmit: (data: RoleFormData) => Promise<void> | void;

  submitLabel?: string;
}

export default function RoleForm({
  role,
  permissions,
  onSubmit,
  submitLabel = "Save Role",
}: Props) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions ?? [],
  );

  const { hasPermission } = usePermission();

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    defaultValues: {
      name: role?.name ?? "",

      code: role?.code ?? "",

      description: role?.description ?? "",

      permissions: role?.permissions ?? [],

      status: role?.status ?? "ACTIVE",
    },
  });

  useEffect(() => {
    if (!role) return;

    reset({
      name: role.name,

      code: role.code,

      description: role.description ?? "",

      permissions: role.permissions,

      status: role.status,
    });

    setSelectedPermissions(role.permissions);
  }, [role, reset]);

  const submit = async (data: RoleFormData) => {
    await onSubmit({
      ...data,

      code: data.code.trim().toUpperCase().replace(/\s+/g, "_"),

      permissions: selectedPermissions,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-7">
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-gray-900">Role Information</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input
            label="Role Name"
            error={errors.name?.message}
            {...register("name", {
              required: "Role name is required",
            })}
          />

          {/* <Input
            label="Role Code"
            disabled={role?.isSystemRole}
            error={errors.code?.message}
            {...register("code", {
              required: "Role code is required",
            })}
          /> */}

          {/* <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={3}
              {...register("description")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div> */}

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
            </select>
          </div>
        </div>
      </section>

      {hasPermission("roles.permissions.manage") && (
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>

          <p className="mt-1 text-sm text-gray-500">
            Select what users assigned to this role can access.
          </p>
        </div>

        <PermissionMatrix
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          onChange={setSelectedPermissions}
        />
      </div>
      )} 

      <div className="flex justify-end">
        <button
          disabled={isSubmitting}
          className="rounded-lg bg-[#123B7A] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
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
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-100"
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
