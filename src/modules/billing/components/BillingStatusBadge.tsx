import type {
  BillingStatus,
} from "../types/billing.types";

interface Props {
  status: BillingStatus;
}

export default function BillingStatusBadge({
  status,
}: Props) {
  const styles = {
    DRAFT:
      "border-gray-200 bg-gray-50 text-gray-700",

    GENERATED:
      "border-blue-200 bg-blue-50 text-blue-700",

    UNDER_REVIEW:
      "border-amber-200 bg-amber-50 text-amber-700",

    APPROVED:
      "border-green-200 bg-green-50 text-green-700",

    REJECTED:
      "border-red-200 bg-red-50 text-red-700",

    PAID:
      "border-purple-200 bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status.replaceAll(
        "_",
        " "
      )}
    </span>
  );
}