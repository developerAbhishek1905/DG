import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../../../components/ui/Card";

import UserRoleBadge from "../components/UserRoleBadge";
import UserStatusBadge from "../components/UserStatusBadge";

import {
  useUserDetails,
} from "../hooks/useUsers";

export default function UserDetailsPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const {
    user,
    loading,
  } =
    useUserDetails(id);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        User not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            navigate("/users")
          }
          className="inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft
            size={17}
          />

          Back
        </button>

        <button
          onClick={() =>
            navigate(
              `/users/${user.id}/edit`
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white"
        >
          <Edit size={17} />

          Edit User
        </button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {user.id}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <UserRoleBadge
              roleName={
                user.roleName
              }
            />

            <UserStatusBadge
              status={
                user.status
              }
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 md:grid-cols-2 lg:grid-cols-4">
          <Info
            icon={Mail}
            label="Email"
            value={
              user.email
            }
          />

          <Info
            icon={Phone}
            label="Phone"
            value={
              user.phone ??
              "-"
            }
          />

          <Info
            icon={Shield}
            label="Role"
            value={
              user.roleName
            }
          />

          <Info
            icon={Shield}
            label="Dealer"
            value={
              user.dealerName ??
              user.dealerId ??
              "-"
            }
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900">
          Account Information
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Detail
            label="Created At"
            value={new Date(
              user.createdAt
            ).toLocaleString()}
          />

          <Detail
            label="Updated At"
            value={new Date(
              user.updatedAt
            ).toLocaleString()}
          />

          <Detail
            label="Last Login"
            value={
              user.lastLogin
                ? new Date(
                    user.lastLogin
                  ).toLocaleString()
                : "Never"
            }
          />
        </div>
      </Card>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon
        size={18}
        className="mt-1 text-gray-400"
      />

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}