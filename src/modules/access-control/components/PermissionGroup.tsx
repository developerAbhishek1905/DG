import PermissionCheckbox from "./PermissionCheckbox";

import type {
  Permission,
} from "../types/accessControl.types";

interface Props {
  module: string;

  permissions: Permission[];

  selectedPermissions: string[];

  onToggle: (
    permissionKey: string
  ) => void;

  onToggleAll: (
    modulePermissions: Permission[]
  ) => void;
}

export default function PermissionGroup({
  module,
  permissions,
  selectedPermissions,
  onToggle,
  onToggleAll,
}: Props) {
  const allSelected =
    permissions.every(
      (permission) =>
        selectedPermissions.includes(
          permission.key
        )
    );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            {module}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {permissions.length}{" "}
            permissions
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onToggleAll(
              permissions
            )
          }
          className="text-xs font-medium text-[#123B7A]"
        >
          {allSelected
            ? "Remove All"
            : "Select All"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {permissions.map(
          (permission) => (
            <PermissionCheckbox
              key={
                permission.id
              }
              permission={
                permission
              }
              checked={selectedPermissions.includes(
                permission.key
              )}
              onChange={() =>
                onToggle(
                  permission.key
                )
              }
            />
          )
        )}
      </div>
    </div>
  );
}