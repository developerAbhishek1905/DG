import { AlertTriangle, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

import StatusBadge from "../../../components/ui/StatusBadge";
import type { SLAStatus } from "../types/pending.types";

interface Props {
  status: SLAStatus;
}

const CONFIG = {
  SAFE: { label: "Within SLA", icon: ShieldCheck, tone: "success" },
  WARNING: { label: "SLA Warning", icon: Clock3, tone: "warning" },
  BREACHED: { label: "SLA Breached", icon: AlertTriangle, tone: "danger" },
  RESOLVED: { label: "Resolved", icon: CheckCircle2, tone: "success" },
} as const;

export default function SLAStatusBadge({ status }: Props) {
  const item = CONFIG[status];

  return <StatusBadge tone={item.tone} label={item.label} icon={item.icon} />;
}
