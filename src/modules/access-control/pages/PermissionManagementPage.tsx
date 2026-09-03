import { ArrowLeft, Save } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import PermissionMatrix from "../components/PermissionMatrix";

import { useRoleDetails, useRoles } from "../hooks/useRoles";

import { updateRolePermissions } from "../services/accessControlApi";

export default function PermissionManagementPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { role, loading } = useRoleDetails(id);

  const { permissions } = useRoles();

  const [selected, setSelected] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role) {
      setSelected(role.permissions);
    }
  }, [role]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!role || !id) {
    return <div>Role not found.</div>;
  }

  const savePermissions = async () => {
    try {
      setSaving(true);

      await updateRolePermissions(id, selected);

      navigate(`/roles/${id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => navigate(`/roles/${id}`)}
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <h1 className="text-2xl font-bold">Permission Management</h1>

          <p className="mt-1 text-sm text-gray-500">
            Role: <strong>{role.name}</strong>
          </p>
        </div>

        <button
          onClick={savePermissions}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          <Save size={17} />

          {saving ? "Saving..." : "Save Permissions"}
        </button>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-blue-700">
          Selected <strong>{selected.length}</strong> of{" "}
          <strong>{permissions.length}</strong> available permissions.
        </p>
      </div>

      <PermissionMatrix
        permissions={permissions}
        selectedPermissions={selected}
        onChange={setSelected}
      />
    </div>
  );
}
