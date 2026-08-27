import type {
  AreaStatus,
} from "../types/area.types";

interface Props {
  status: AreaStatus;
}

export default function AreaStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        status ===
        "ACTIVE"
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status ===
      "ACTIVE"
        ? "Active"
        : "Inactive"}
    </span>
  );
}