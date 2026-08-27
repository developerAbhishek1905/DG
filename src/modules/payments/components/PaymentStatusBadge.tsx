import type {
  PaymentStatus,
} from "../types/payment.types";

interface Props {
  status: PaymentStatus;
}

export default function PaymentStatusBadge({
  status,
}: Props) {
  const styles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",

    PROCESSING:
      "border-blue-200 bg-blue-50 text-blue-700",

    SUCCESS:
      "border-green-200 bg-green-50 text-green-700",

    FAILED:
      "border-red-200 bg-red-50 text-red-700",

    CANCELLED:
      "border-gray-200 bg-gray-50 text-gray-600",

    REVERSED:
      "border-purple-200 bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}