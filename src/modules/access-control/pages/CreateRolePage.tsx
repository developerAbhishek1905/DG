import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import RoleForm from "../components/RoleForm";

import {
  useRoles,
} from "../hooks/useRoles";

import {
  createRole,
} from "../services/accessControlApi";

import type {
  RoleFormData,
} from "../types/accessControl.types";

export default function CreateRolePage() {
  const navigate =
    useNavigate();

  const {
    permissions,
  } = useRoles();

  const handleCreate =
    async (
      data: RoleFormData
    ) => {
      const role =
        await createRole(
          data
        );

      navigate(
        `/roles/${role.id}`
      );
    };

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate("/roles")
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft size={17} />

        Back to Roles
      </button>

      <div>
        <h1 className="text-2xl font-bold">
          Create Role
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Define role access and
          permissions.
        </p>
      </div>

      <RoleForm
        permissions={
          permissions
        }
        onSubmit={
          handleCreate
        }
        submitLabel="Create Role"
      />
    </div>
  );
}