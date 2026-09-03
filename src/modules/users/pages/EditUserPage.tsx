import { ArrowLeft } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import UserForm from "../components/UserForm";

import { useUserDetails } from "../hooks/useUsers";

import { updateUser } from "../services/userApi";

import type { UserFormData } from "../types/user.types";
import { useRoles } from "../../access-control";

export default function EditUserPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { roles } = useRoles();

  const { user, loading } = useUserDetails(id);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading user...
      </div>
    );
  }

  if (!user || !id) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        User not found.
      </div>
    );
  }

  const handleUpdate = async (data: UserFormData) => {
    const role = roles.find((item) => item.id === data.roleId);

    if (!role) {
      alert("Invalid role");

      return;
    }

    await updateUser(id, data, role.name);

    navigate(`/users/${id}`);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/users/${id}`)}
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft size={17} />
        Back to User
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update account and access configuration.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <UserForm
          user={user}
          roles={roles}
          onSubmit={handleUpdate}
          submitLabel="Update User"
        />
      </div>
    </div>
  );
}
