import StatusBadge from "../../../components/ui/StatusBadge";
import type { PaymentStatus } from "../types/payment.types";

interface Props {
  status: PaymentStatus;
}

export default function PaymentStatusBadge({ status }: Props) {
  return <StatusBadge status={status} />;
}
