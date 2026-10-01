import { useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAppSelector } from "../../../app/hooks";
import { changePassword } from "../services/profileApi";

export default function UserProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
console.log(user)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!newPassword) {
      toast.error("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success(
        response?.message || "Password changed successfully",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Change password error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your account information and manage your password.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ================================================
            PROFILE INFORMATION
        ================================================= */}

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Profile Information
            </h2>
          </div>

          <div className="p-6">
            {/* Avatar */}

            <div className="mb-6 flex items-center gap-4">
              <div
                className="
                  flex h-16 w-16
                  items-center justify-center
                  rounded-full bg-[#123B7A]
                  text-xl font-bold text-white
                "
              >
                {initials}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.name || "User"}
                </h3>

                <p className="text-sm text-gray-500">
                  {user?.role?.name || "User"}
                </p>
              </div>
            </div>

            {/* Name */}

            <ProfileItem
              icon={<User size={18} />}
              label="Name"
              value={user?.name || "-"}
            />

            {/* Email */}

            <ProfileItem
              icon={<Mail size={18} />}
              label="Email"
              value={user?.email || "-"}
            />

            {/* Role */}

            <ProfileItem
              icon={<ShieldCheck size={18} />}
              label="Role"
              value={user?.role?.name || "-"}
            />
          </div>
        </div>

        {/* ================================================
            CHANGE PASSWORD
        ================================================= */}

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <LockKeyhole size={19} className="text-[#123B7A]" />

              <h2 className="text-base font-semibold text-gray-900">
                Change Password
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="space-y-5 p-6"
          >
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrentPassword}
              onToggle={() =>
                setShowCurrentPassword((prev) => !prev)
              }
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPassword}
              onToggle={() =>
                setShowNewPassword((prev) => !prev)
              }
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((prev) => !prev)
              }
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="
                  rounded-lg bg-[#123B7A]
                  px-5 py-2.5
                  text-sm font-medium text-white
                  transition
                  hover:bg-[#0f3268]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   PROFILE ITEM
======================================================== */

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ProfileItem({
  icon,
  label,
  value,
}: ProfileItemProps) {
  return (
    <div className="flex items-center gap-3 border-t border-gray-100 py-4 first:border-0">
      <div
        className="
          flex h-9 w-9
          items-center justify-center
          rounded-lg bg-gray-100
          text-gray-500
        "
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-500">{label}</p>

        <p className="text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================================
   PASSWORD INPUT
======================================================== */

interface PasswordInputProps {
  label: string;
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

function PasswordInput({
  label,
  value,
  show,
  onChange,
  onToggle,
}: PasswordInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
          className="
            w-full rounded-lg border border-gray-300
            px-3 py-2.5 pr-10
            text-sm outline-none
            transition
            focus:border-[#123B7A]
            focus:ring-2 focus:ring-blue-100
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute right-3 top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-gray-600
          "
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}