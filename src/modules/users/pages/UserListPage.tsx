import { Plus } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../app/hooks";

import UserFilters from "../components/UserFilters";
import UserStats from "../components/UserStats";
import UserTable from "../components/UserTable";

import { useUsers } from "../hooks/useUsers";
import { useRoles } from "../../access-control";
import { usePermission } from "../../../hooks/usePermission";

export default function UserListPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const { users, loading, deleteUser } = useUsers();

  const { roles } = useRoles();

  const { search, status, roleId } = useAppSelector((state) => state.users);

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone?.includes(query);

    const matchesStatus = status === "ALL" || user.status === status;

    const matchesRole = roleId === "ALL" || user.roleId === roleId;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage application users and access.
          </p>
        </div>

        {hasPermission("users.create") && (
          <button
            onClick={() => navigate("/users/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
          >
            <Plus size={18} />
            Add User
          </button>
        )}
      </div>

      <UserStats users={users} />

      <UserFilters roles={roles} />

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
          Loading users...
        </div>
      ) : (
        <UserTable users={filteredUsers} onDelete={deleteUser} />
      )}
    </div>
  );
}
