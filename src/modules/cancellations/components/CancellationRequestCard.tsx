import {
  CalendarDays,
  Package,
  UserRound,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import CancellationReason from "./CancellationReason";

import type {
  CancellationRequest,
} from "../types/cancellation.types";

interface Props {
  request: CancellationRequest;
}

export default function CancellationRequestCard({
  request,
}: Props) {
  return (
    <Card className="p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <p className="text-xs font-medium text-[#123B7A]">
            {
              request.complaintNumber
            }
          </p>

          <h2 className="mt-1 text-xl font-bold text-gray-900">
            Cancellation Request
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Request ID:{" "}
            {request.id}
          </p>
        </div>

        <StatusBadge
          status={
            request.status
          }
        />
      </div>

      <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          icon={UserRound}
          label="Requested By"
          value={
            request.requestedBy
          }
        />

        <Info
          label="Role"
          value={
            request.requestedByRole
          }
        />

        <Info
          icon={Package}
          label="Product"
          value={
            request.productName
          }
        />

        <Info
          icon={CalendarDays}
          label="Requested At"
          value={new Date(
            request.requestedAt
          ).toLocaleString()}
        />
      </div>

      <div className="mt-6">
        <CancellationReason
          reason={
            request.reason
          }
          description={
            request.description
          }
        />
      </div>
    </Card>
  );
}

function StatusBadge({
  status,
}: {
  status:
    CancellationRequest["status"];
}) {
  const styles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",

    VERIFIED:
      "border-blue-200 bg-blue-50 text-blue-700",

    APPROVED:
      "border-green-200 bg-green-50 text-green-700",

    REJECTED:
      "border-red-200 bg-red-50 text-red-700",

    REASSIGNED:
      "border-purple-200 bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`inline-flex h-fit rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      {Icon && (
        <Icon
          size={17}
          className="mt-1 shrink-0 text-gray-400"
        />
      )}

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}