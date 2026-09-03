import { ArrowLeft, Edit, KeyRound } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/ui/Card";

import RoleBadge from "../components/RoleBadge";

import { useRoleDetails } from "../hooks/useRoles";
import { usePermission } from "../../../hooks/usePermission";

export default function RoleDetailsPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const { id } = useParams();

  const { role, loading } = useRoleDetails(id);

  if (loading) {
    return <div>Loading role...</div>;
  }

  if (!role) {
    return <div>Role not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/roles")}
          className="inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft size={17} />
          Back to Roles
        </button>

        <div className="flex gap-2">
          {hasPermission("roles.permissions.manage") && (
            <button
              onClick={() => navigate(`/roles/${role.id}/permissions`)}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
            >
              <KeyRound size={17} />
              Permissions
            </button>
          )}

          {hasPermission("roles.update") && (
            <button
              onClick={() => navigate(`/roles/${role.id}/edit`)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-sm text-white"
            >
              <Edit size={17} />
              Edit
            </button>
          )}
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between">
          <div>
            <RoleBadge name={role.name} system={role.isSystemRole} />

            <p className="mt-3 text-sm text-gray-500">
              {role.description ?? "No description"}
            </p>
          </div>

          <span
            className={
              role.status === "ACTIVE"
                ? "text-sm font-medium text-green-600"
                : "text-sm text-gray-500"
            }
          >
            {role.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 border-t pt-5 md:grid-cols-3">
          <Info label="Role Code" value={role.code} />

          <Info label="Users" value={String(role.usersCount ?? 0)} />

          <Info label="Permissions" value={String(role.permissions.length)} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold">Assigned Permissions</h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {role.permissions.map((permission) => (
            <span
              key={permission}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs text-blue-700"
            >
              {permission}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
