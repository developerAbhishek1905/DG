import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListChecks,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import type {
  PendingComplaint,
} from "../types/pending.types";

interface Props {
  complaints: PendingComplaint[];
}

export default function SLAStats({
  complaints,
}: Props) {
  const active =
    complaints.filter(
      (item) =>
        item.status ===
        "PENDING"
    );

  const safe =
    active.filter(
      (item) =>
        item.slaStatus ===
        "SAFE"
    ).length;

  const warning =
    active.filter(
      (item) =>
        item.slaStatus ===
        "WARNING"
    ).length;

  const breached =
    active.filter(
      (item) =>
        item.slaStatus ===
        "BREACHED"
    ).length;

  const stats = [
    {
      label:
        "Total Pending",

      value:
        active.length,

      icon:
        ListChecks,
    },

    {
      label:
        "Within SLA",

      value: safe,

      icon:
        CheckCircle2,
    },

    {
      label:
        "SLA Warning",

      value: warning,

      icon: Clock3,
    },

    {
      label:
        "SLA Breached",

      value:
        breached,

      icon:
        AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(
        (stat) => {
          const Icon =
            stat.icon;

          return (
            <Card
              key={
                stat.label
              }
              className="p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {
                      stat.label
                    }
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {
                      stat.value
                    }
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                  <Icon
                    size={21}
                  />
                </div>
              </div>
            </Card>
          );
        }
      )}
    </div>
  );
}