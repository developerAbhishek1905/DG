import {
  CheckCircle2,
  Eye,
  FileWarning,
  XCircle,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import VerificationCountdown from "./VerificationCountdown";

import type {
  VerificationRecord,
} from "../types/verification.types";

interface Props {
  records: VerificationRecord[];

  onVerify?: (
    id: string
  ) => void;

  onReject?: (
    id: string
  ) => void;

  onCorrection?: (
    id: string
  ) => void;
}

export default function VerificationTable({
  records,
  onVerify,
  onReject,
  onCorrection,
}: Props) {
  const navigate =
    useNavigate();

  if (!records.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No verification records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1350px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Complaint",
                "Customer",
                "Dealer",
                "Closure",
                "Proofs",
                "Priority",
                "Submitted",
                "Remaining",
                "SLA",
                "Status",
                "Actions",
              ].map(
                (heading) => (
                  <th
                    key={
                      heading
                    }
                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {records.map(
              (record) => {
                const finished =
                  [
                    "VERIFIED",
                    "REJECTED",
                  ].includes(
                    record.status
                  );

                return (
                  <tr
                    key={
                      record.id
                    }
                    className={
                      record.slaStatus ===
                      "BREACHED"
                        ? "bg-red-50/30"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/verification/${record.id}`
                          )
                        }
                        className="font-medium text-[#123B7A] hover:underline"
                      >
                        {
                          record.complaintNumber
                        }
                      </button>

                      <p className="mt-1 text-xs text-gray-400">
                        {
                          record.id
                        }
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {
                          record.customer
                            .name
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {
                          record.customer
                            .phone
                        }
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">
                        {
                          record.dealer
                            .name
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {
                          record.dealer
                            .dealerCode
                        }
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {
                          record.closure
                            .closureType
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-700">
                      {
                        record.closure
                          .proofs
                          .length
                      }
                    </td>

                    <td className="px-5 py-4">
                      <PriorityBadge
                        priority={
                          record.priority
                        }
                      />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {new Date(
                        record.submittedAt
                      ).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <VerificationCountdown
                        deadline={
                          record.verificationDeadline
                        }
                        completed={
                          finished
                        }
                      />
                    </td>

                    <td className="px-5 py-4">
                      <SLAStatusBadge
                        status={
                          record.slaStatus
                        }
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          record.status
                        }
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            navigate(
                              `/verification/${record.id}`
                            )
                          }
                          title="View"
                          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye
                            size={17}
                          />
                        </button>

                        {!finished &&
                          onVerify && (
                            <button
                              onClick={() =>
                                onVerify(
                                  record.id
                                )
                              }
                              title="Verify"
                              className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle2
                                size={17}
                              />
                            </button>
                          )}

                        {!finished &&
                          onCorrection && (
                            <button
                              onClick={() =>
                                onCorrection(
                                  record.id
                                )
                              }
                              title="Request Correction"
                              className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                            >
                              <FileWarning
                                size={17}
                              />
                            </button>
                          )}

                        {!finished &&
                          onReject && (
                            <button
                              onClick={() =>
                                onReject(
                                  record.id
                                )
                              }
                              title="Reject"
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            >
                              <XCircle
                                size={17}
                              />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
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
      "bg-gray-50 text-gray-600 border-gray-200",

    MEDIUM:
      "bg-blue-50 text-blue-700 border-blue-200",

    HIGH:
      "bg-amber-50 text-amber-700 border-amber-200",

    CRITICAL:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function SLAStatusBadge({
  status,
}: {
  status:
    VerificationRecord["slaStatus"];
}) {
  const styles = {
    SAFE:
      "bg-green-50 text-green-700 border-green-200",

    WARNING:
      "bg-amber-50 text-amber-700 border-amber-200",

    BREACHED:
      "bg-red-50 text-red-700 border-red-200",

    COMPLETED:
      "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
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
      "bg-gray-50 text-gray-700 border-gray-200",

    IN_REVIEW:
      "bg-blue-50 text-blue-700 border-blue-200",

    VERIFIED:
      "bg-green-50 text-green-700 border-green-200",

    REJECTED:
      "bg-red-50 text-red-700 border-red-200",

    CORRECTION_REQUIRED:
      "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status.replaceAll(
        "_",
        " "
      )}
    </span>
  );
}