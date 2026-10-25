import {
  Store,
  CheckCircle2,
  PauseCircle,
  AlertTriangle,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import type {
  Dealer,
} from "../types/dealer.types";

interface Props {
  dealers: Dealer[];
}

export default function DealerStats({
  dealers,
}: Props) {
  const active =
    dealers.filter(
      (dealer) =>
        dealer.status === "ACTIVE"
    ).length;

  const inactive =
    dealers.filter(
      (dealer) =>
        dealer.status === "INACTIVE"
    ).length;

  const suspended =
    dealers.filter(
      (dealer) =>
        dealer.status === "SUSPENDED"
    ).length;

  const stats = [
    {
      label: "Total Dealers",
      value: dealers.length,
      icon: Store,
    },
    {
      label: "Active Dealers",
      value: active,
      icon: CheckCircle2,
    },
    {
      label: "Inactive Dealers",
      value: inactive,
      icon: PauseCircle,
    },
    {
      label: "Suspended",
      value: suspended,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

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