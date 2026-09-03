
import { Check, Minus } from "lucide-react";

import type { Permission } from "../types/accessControl.types";

interface Props {
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

const ACTIONS = [
  "access",
  "view",
  "create",
  "update",
  "delete",
  "assign",
  "reassign",
  "confirm",
  "reschedule",
  "resolve",
  "escalate",
  "cancel",
  "verify",
  "manage",
  "permissions",
  "reminder",
  "review",
  "correction",
  "history",
  "export",
  "import"
];

export default function PermissionMatrix({
  permissions,
  selectedPermissions,
  onChange,
  disabled = false,
}: Props) {
  // Get all modules
  const modules = Array.from(
    new Set(permissions.map((permission) => permission.module)),
  );

  // Toggle single permission
  const togglePermission = (permissionKey: string) => {
    if (disabled) return;

    if (selectedPermissions.includes(permissionKey)) {
      onChange(selectedPermissions.filter((key) => key !== permissionKey));
    } else {
      onChange([...selectedPermissions, permissionKey]);
    }
  };

  // Select / unselect entire module
  const toggleModule = (module: string) => {
    if (disabled) return;

    const modulePermissions = permissions.filter(
      (permission) => permission.module === module,
    );

    const keys = modulePermissions.map((permission) => permission.key);

    const allSelected = keys.every((key) => selectedPermissions.includes(key));

    if (allSelected) {
      onChange(selectedPermissions.filter((key) => !keys.includes(key)));
    } else {
      onChange(Array.from(new Set([...selectedPermissions, ...keys])));
    }
  };

  // Select / unselect whole action column
  const toggleAction = (action: string) => {
    if (disabled) return;

    const actionPermissions = permissions.filter(
      (permission) => permission.action === action,
    );

    const keys = actionPermissions.map((permission) => permission.key);

    const allSelected = keys.every((key) => selectedPermissions.includes(key));

    if (allSelected) {
      onChange(selectedPermissions.filter((key) => !keys.includes(key)));
    } else {
      onChange(Array.from(new Set([...selectedPermissions, ...keys])));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-250 border-collapse">
          {/* HEADER */}

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="sticky left-0 z-10 min-w-55 bg-gray-50 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Module
              </th>

              {ACTIONS.map((action) => (
                <th
                  key={action}
                  className="min-w-25 px-3 py-4 text-center"
                >
                  <button
                    type="button"
                    onClick={() => toggleAction(action)}
                    className="text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-[#123B7A]"
                  >
                    {action}
                  </button>
                </th>
              ))}

              <th className="min-w-27.5 px-3 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                All
              </th>
            </tr>
          </thead>

          {/* BODY */}

          <tbody className="divide-y divide-gray-100">
            {modules.map((module) => {
              const modulePermissions = permissions.filter(
                (permission) => permission.module === module,
              );

              const moduleKeys = modulePermissions.map(
                (permission) => permission.key,
              );

              const allSelected =
                moduleKeys.length > 0 &&
                moduleKeys.every((key) => selectedPermissions.includes(key));

              return (
                <tr key={module} className="transition hover:bg-gray-50">
                  {/* MODULE */}

                  <td className="sticky left-0 z-10 bg-white px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {module}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {modulePermissions.length} permissions
                      </p>
                    </div>
                  </td>

                  {/* ACTIONS */}

                  {ACTIONS.map((action) => {
                    const permission = modulePermissions.find(
                      (item) => item.action === action,
                    );

                    // Permission doesn't exist
                    if (!permission) {
                      return (
                        <td key={action} className="px-3 py-4 text-center">
                          <Minus size={16} className="mx-auto text-gray-300" />
                        </td>
                      );
                    }

                    const checked = selectedPermissions.includes(
                      permission.key,
                    );

                    return (
                      <td key={action} className="px-3 py-4 text-center">
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => togglePermission(permission.key)}
                          title={permission.label}
                          className={`
                                mx-auto flex h-6 w-6 items-center justify-center
                                rounded-md border transition

                                ${
                                  checked
                                    ? "border-[#123B7A] bg-[#123B7A] text-white"
                                    : "border-gray-300 bg-white hover:border-[#123B7A]"
                                }

                                ${
                                  disabled
                                    ? "cursor-not-allowed opacity-60"
                                    : "cursor-pointer"
                                }
                              `}
                        >
                          {checked && <Check size={15} strokeWidth={3} />}
                        </button>
                      </td>
                    );
                  })}

                  {/* SELECT ALL MODULE */}

                  <td className="px-3 py-4 text-center">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleModule(module)}
                      className={`
                          mx-auto flex h-6 w-6 items-center justify-center
                          rounded-md border transition

                          ${
                            allSelected
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-gray-300 bg-white"
                          }
                        `}
                      title={`Select all ${module} permissions`}
                    >
                      {allSelected && <Check size={15} strokeWidth={3} />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
