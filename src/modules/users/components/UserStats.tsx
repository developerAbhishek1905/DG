import {
  CheckCircle2,
  ShieldAlert,
  UserRoundX,
  Users,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import type {
  AppUser,
} from "../types/user.types";

interface Props {
  users: AppUser[];
}

export default function UserStats({
  users,
}: Props) {
  const active =
    users.filter(
      (user) =>
        user.status === "ACTIVE"
    ).length;

  const inactive =
    users.filter(
      (user) =>
        user.status === "INACTIVE"
    ).length;

  const suspended =
    users.filter(
      (user) =>
        user.status ===
        "SUSPENDED"
    ).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
    },

    {
      label: "Active Users",
      value: active,
      icon: CheckCircle2,
    },

    {
      label: "Inactive Users",
      value: inactive,
      icon: UserRoundX,
    },

    {
      label: "Suspended",
      value: suspended,
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon =
          stat.icon;

        return (
          <Card
            key={stat.label}
            className="p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                <Icon size={21} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}