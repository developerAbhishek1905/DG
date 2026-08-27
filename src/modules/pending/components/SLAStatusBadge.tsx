import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import type {
  SLAStatus,
} from "../types/pending.types";

interface Props {
  status: SLAStatus;
}

export default function SLAStatusBadge({
  status,
}: Props) {
  const config = {
    SAFE: {
      label: "Within SLA",

      icon:
        ShieldCheck,

      classes:
        "border-green-200 bg-green-50 text-green-700",
    },

    WARNING: {
      label:
        "SLA Warning",

      icon: Clock3,

      classes:
        "border-amber-200 bg-amber-50 text-amber-700",
    },

    BREACHED: {
      label:
        "SLA Breached",

      icon:
        AlertTriangle,

      classes:
        "border-red-200 bg-red-50 text-red-700",
    },

    RESOLVED: {
      label: "Resolved",

      icon:
        CheckCircle2,

      classes:
        "border-blue-200 bg-blue-50 text-blue-700",
    },
  };

  const item =
    config[status];

  const Icon =
    item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${item.classes}`}
    >
      <Icon size={13} />

      {item.label}
    </span>
  );
}