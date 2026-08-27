import type {
  Permission,
} from "../types/accessControl.types";

interface Props {
  permission: Permission;

  checked: boolean;

  onChange: () => void;
}

export default function PermissionCheckbox({
  permission,
  checked,
  onChange,
}: Props) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1"
      />

      <div>
        <p className="text-sm font-medium text-gray-800">
          {permission.label}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {permission.key}
        </p>

        {permission.description && (
          <p className="mt-1 text-xs text-gray-500">
            {
              permission.description
            }
          </p>
        )}
      </div>
    </label>
  );
}
