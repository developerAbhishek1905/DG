import { ArrowLeft } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import RoleForm from "../components/RoleForm";

import { useRoleDetails, useRoles } from "../hooks/useRoles";

import { updateRole } from "../services/accessControlApi";

import type { RoleFormData } from "../types/accessControl.types";

export default function EditRolePage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { role, loading } = useRoleDetails(id);

  const { permissions } = useRoles();

  if (loading) {
    return <div>Loading role...</div>;
  }

  if (!role || !id) {
    return <div>Role not found.</div>;
  }

  const handleUpdate = async (data: RoleFormData) => {
    await updateRole(id, data);

    navigate(`/roles/${id}`);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/roles/${id}`)}
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <h1 className="text-2xl font-bold">Edit Role</h1>

      <RoleForm
        role={role}
        permissions={permissions}
        onSubmit={handleUpdate}
        submitLabel="Update Role"
      />
    </div>
  );
}
