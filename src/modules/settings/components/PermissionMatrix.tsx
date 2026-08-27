import type {
  PermissionSetting,
} from "../types/settings.types";

interface Props {
  permissions: PermissionSetting[];

  onChange: (
    permissions: PermissionSetting[]
  ) => void;
}

export default function PermissionMatrix({
  permissions,
  onChange,
}: Props) {
  const update = (
    index: number,
    field:
      | "enabled"
      | "defaultAllowed",
    value: boolean
  ) => {
    const updated =
      permissions.map(
        (
          permission,
          currentIndex
        ) =>
          currentIndex ===
          index
            ? {
                ...permission,
                [field]:
                  value,
              }
            : permission
      );

    onChange(updated);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Module
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Action
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                Enabled
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                Default Allowed
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {permissions.map(
              (
                permission,
                index
              ) => (
                <tr
                  key={`${permission.module}-${permission.action}`}
                >
                  <td className="px-5 py-4 text-sm font-medium text-gray-800">
                    {
                      permission.module
                    }
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      permission.action
                    }
                  </td>

                  <td className="px-5 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={
                        permission.enabled
                      }
                      onChange={(
                        event
                      ) =>
                        update(
                          index,
                          "enabled",
                          event.target
                            .checked
                        )
                      }
                    />
                  </td>

                  <td className="px-5 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={
                        permission.defaultAllowed
                      }
                      disabled={
                        !permission.enabled
                      }
                      onChange={(
                        event
                      ) =>
                        update(
                          index,
                          "defaultAllowed",
                          event.target
                            .checked
                        )
                      }
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}