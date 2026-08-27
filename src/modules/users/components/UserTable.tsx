import {
  Edit,
  Eye,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  AppUser,
} from "../types/user.types";

import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";

interface Props {
  users: AppUser[];

  onDelete?: (
    id: string
  ) => void;
}

export default function UserTable({
  users,
  onDelete,
}: Props) {
  const navigate =
    useNavigate();

  if (!users.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "User",
                "Phone",
                "Role",
                "Dealer",
                "Status",
                "Last Login",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/users/${user.id}`
                      )
                    }
                    className="font-medium text-[#123B7A] hover:underline"
                  >
                    {user.name}
                  </button>

                  <p className="mt-1 text-xs text-gray-500">
                    {user.email}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {user.phone ??
                    "-"}
                </td>

                <td className="px-5 py-4">
                  <UserRoleBadge
                    roleName={
                      user.roleName
                    }
                  />
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {user.dealerName ??
                    "-"}
                </td>

                <td className="px-5 py-4">
                  <UserStatusBadge
                    status={
                      user.status
                    }
                  />
                </td>

                <td className="px-5 py-4 text-sm text-gray-500">
                  {user.lastLogin
                    ? new Date(
                        user.lastLogin
                      ).toLocaleString()
                    : "Never"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        navigate(
                          `/users/${user.id}`
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/users/${user.id}/edit`
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Edit
                        size={17}
                      />
                    </button>

                    {onDelete && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete ${user.name}?`
                            )
                          ) {
                            onDelete(
                              user.id
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