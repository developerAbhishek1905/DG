import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useRoles,
} from "../../access-control/hooks/useRoles";

import UserForm from "../components/UserForm";

import {
  createUser,
} from "../services/userApi";

import type {
  UserFormData,
} from "../types/user.types";

export default function CreateUserPage() {
  const navigate =
    useNavigate();

  const {
    roles,
  } = useRoles();

  const handleCreate =
    async (
      data: UserFormData
    ) => {
      const role =
        roles.find(
          (item) =>
            item.id ===
            data.roleId
        );

      if (!role) {
        alert(
          "Invalid role selected"
        );

        return;
      }

      const user =
        await createUser(
          data,
          role.name
        );

      navigate(
        `/users/${user.id}`
      );
    };

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate("/users")
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft size={17} />

        Back to Users
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create User
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new application
          user and assign a role.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <UserForm
          roles={roles}
          onSubmit={
            handleCreate
          }
          submitLabel="Create User"
        />
      </div>
    </div>
  );
}