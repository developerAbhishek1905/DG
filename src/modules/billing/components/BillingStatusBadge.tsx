import StatusBadge from "../../../components/ui/StatusBadge";
import type { BillingStatus } from "../types/billing.types";

interface Props {
  status: BillingStatus;
}

export default function BillingStatusBadge({ status }: Props) {
  return <StatusBadge status={status} />;
}
