import {
  Edit,
  Eye,
  KeyRound,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  Role,
} from "../types/accessControl.types";

import RoleBadge from "./RoleBadge";

interface Props {
  roles: Role[];

  onDelete?: (
    id: string
  ) => void;
}

export default function RoleTable({
  roles,
  onDelete,
}: Props) {
  const navigate =
    useNavigate();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Role",
                "Code",
                "Users",
                "Permissions",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <RoleBadge
                    name={
                      role.name
                    }
                    system={
                      role.isSystemRole
                    }
                  />
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {role.code}
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {role.usersCount ??
                    0}
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {
                    role.permissions
                      .length
                  }
                </td>

                <td className="px-5 py-4">
                  <span
                    className={
                      role.status ===
                      "ACTIVE"
                        ? "text-sm font-medium text-green-600"
                        : "text-sm font-medium text-gray-500"
                    }
                  >
                    {role.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        navigate(
                          `/roles/${role.id}`
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/roles/${role.id}/edit`
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Edit
                        size={17}
                      />
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/roles/${role.id}/permissions`
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-purple-50 hover:text-purple-600"
                    >
                      <KeyRound
                        size={17}
                      />
                    </button>

                    {!role.isSystemRole &&
                      onDelete && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete ${role.name}?`
                              )
                            ) {
                              onDelete(
                                role.id
                              );
                            }
                          }}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}