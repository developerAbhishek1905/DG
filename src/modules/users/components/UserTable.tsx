import { useState } from "react";
import { Edit, Eye, EyeOff, KeyRound, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import type { AppUser } from "../types/user.types";

import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import { usePermission } from "../../../hooks/usePermission";
import { setUserPassword } from "../services/userApi";

interface Props {
  users: AppUser[];

  onDelete?: (id: string) => void | Promise<unknown>;
}

export default function UserTable({ users, onDelete }: Props) {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const [pwUser, setPwUser] = useState<AppUser | null>(null);
  const [newPw, setNewPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [shown, setShown] = useState<Record<string, boolean>>({});

  const handleDelete = async (user: AppUser) => {
    if (!onDelete || !window.confirm(`Delete ${user.name}?`)) return;
    try {
      await onDelete(user.id);
      toast.success("User deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  const handleSetPassword = async () => {
    if (!pwUser) return;
    if (newPw.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setSavingPw(true);
      await setUserPassword(pwUser.id, newPw);
      toast.success(`Password updated for ${pwUser.name}`);
      setPwUser(null);
      setNewPw("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPw(false);
    }
  };

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
                // "Dealer",
                "Status",
                // "Last Login",
                "Password",
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
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <button
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="font-medium text-[#123B7A] hover:underline"
                  >
                    {user.name}
                  </button>

                  <p className="mt-1 text-xs text-gray-500">{user.email}</p>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {user.phone ?? "-"}
                </td>

                <td className="px-5 py-4">
                  <UserRoleBadge roleName={user?.role?.name} />
                </td>

                {/* <td className="px-5 py-4 text-sm text-gray-600">
                  {user.dealerName ?? "-"}
                </td> */}

                <td className="px-5 py-4">
                  <UserStatusBadge status={user.status} />
                </td>

                <td className="px-5 py-4 text-sm text-gray-700">
                  {user.password ? (
                    <span className="inline-flex items-center gap-2 font-mono">
                      {shown[user.id] ? user.password : "••••••••"}
                      <button
                        onClick={() =>
                          setShown((c) => ({ ...c, [user.id]: !c[user.id] }))
                        }
                        className="text-gray-400 hover:text-gray-700"
                      >
                        {shown[user.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Not available – set password
                    </span>
                  )}
                </td>

                {/* <td className="px-5 py-4 text-sm text-gray-500">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : "Never"}
                </td> */}

                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    {hasPermission("users.view") && (
                      <button
                        onClick={() => navigate(`/users/${user.id}`)}
                        className="rounded-lg p-2 transition bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                      >
                        <Eye size={17} />
                      </button>
                    )}

                    {hasPermission("users.update") && (
                      <button
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                        className="rounded-lg p-2 transition bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Edit size={17} />
                      </button>
                    )}

                    {hasPermission("users.update") && (
                      <button
                        title="Set password"
                        onClick={() => {
                          setPwUser(user);
                          setNewPw("");
                        }}
                        className="rounded-lg p-2 transition bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                      >
                        <KeyRound size={17} />
                      </button>
                    )}

                    {hasPermission("users.delete") && onDelete && (
                      <button
                        onClick={() => handleDelete(user)}
                        className="rounded-lg p-2 transition bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pwUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Set password
            </h3>
            <p className="mt-1 text-sm text-gray-500">{pwUser.name}</p>
            <input
              type="text"
              autoFocus
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="New password (min 6 characters)"
              className="mt-4 w-full rounded-lg border px-3 py-2 text-sm"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setPwUser(null)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSetPassword}
                disabled={savingPw}
                className="rounded-lg bg-[#123B7A] px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {savingPw ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
