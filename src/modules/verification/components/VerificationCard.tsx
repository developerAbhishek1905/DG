import {
  Building2,
  CalendarDays,
  FileCheck2,
  Package,
  UserRound,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import VerificationCountdown from "./VerificationCountdown";

import type {
  VerificationRecord,
} from "../types/verification.types";

interface Props {
  verification: VerificationRecord;
}

export default function VerificationCard({
  verification,
}: Props) {
  return (
    <Card className="p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <p className="text-xs font-medium text-[#123B7A]">
            {
              verification.complaintNumber
            }
          </p>

          <h1 className="mt-1 text-xl font-bold text-gray-900">
            Closure Verification
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {
              verification.id
            }
          </p>
        </div>

        <StatusBadge
          status={
            verification.status
          }
        />
      </div>

      <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2 xl:grid-cols-5">
        <Info
          icon={UserRound}
          label="Customer"
          value={
            verification.customer
              .name
          }
        />

        <Info
          icon={Building2}
          label="Dealer"
          value={
            verification.dealer
              .name
          }
        />

        <Info
          icon={Package}
          label="Product"
          value={
            verification.productName
          }
        />

        <Info
          icon={FileCheck2}
          label="Closure"
          value={
            verification.closure
              .closureType
          }
        />

        <Info
          icon={CalendarDays}
          label="Submitted"
          value={new Date(
            verification.submittedAt
          ).toLocaleString()}
        />
      </div>

      <div className="mt-6 flex flex-col justify-between gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs text-gray-500">
            Verification SLA
          </p>

          <div className="mt-1">
            <VerificationCountdown
              deadline={
                verification.verificationDeadline
              }
              completed={[
                "VERIFIED",
                "REJECTED",
              ].includes(
                verification.status
              )}
            />
          </div>
        </div>

        <PriorityBadge
          priority={
            verification.priority
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
    VerificationRecord["status"];
}) {
  const styles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",

    IN_REVIEW:
      "border-blue-200 bg-blue-50 text-blue-700",

    VERIFIED:
      "border-green-200 bg-green-50 text-green-700",

    REJECTED:
      "border-red-200 bg-red-50 text-red-700",

    CORRECTION_REQUIRED:
      "border-purple-200 bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`h-fit rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status.replaceAll(
        "_",
        " "
      )}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority:
    VerificationRecord["priority"];
}) {
  const styles = {
    LOW:
      "text-gray-600",

    MEDIUM:
      "text-blue-600",

    HIGH:
      "text-amber-600",

    CRITICAL:
      "text-red-600",
  };

  return (
    <span
      className={`text-sm font-semibold ${styles[priority]}`}
    >
      {priority} Priority
    </span>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon
        size={17}
        className="mt-1 shrink-0 text-gray-400"
      />

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