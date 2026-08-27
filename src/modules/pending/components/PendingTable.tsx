import {
  BellRing,
  Eye,
  MoreHorizontal,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import PendingReasonBadge from "./PendingReasonBadge";
import SLACountdown from "./SLACountdown";
import SLAStatusBadge from "./SLAStatusBadge";

import type {
  PendingComplaint,
} from "../types/pending.types";

interface Props {
  complaints: PendingComplaint[];

  onReminder?: (
    id: string
  ) => void;

  onAction?: (
    complaint: PendingComplaint
  ) => void;
}

export default function PendingTable({
  complaints,
  onReminder,
  onAction,
}: Props) {
  const navigate =
    useNavigate();

  if (!complaints.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No pending complaints found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Complaint",
                "Customer",
                "Dealer",
                "Reason",
                "Pending Since",
                "SLA Deadline",
                "Remaining",
                "SLA Status",
                "Reminders",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {complaints.map(
              (item) => (
                <tr
                  key={
                    item.id
                  }
                  className={
                    item.slaStatus ===
                    "BREACHED"
                      ? "bg-red-50/30"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/complaints/${item.complaintId}`
                        )
                      }
                      className="font-medium text-[#123B7A] hover:underline"
                    >
                      {
                        item.complaintNumber
                      }
                    </button>

                    <p className="mt-1 text-xs text-gray-400">
                      {item.id}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {
                        item.customer
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {
                        item.customer
                          .phone
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {
                        item.dealer
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        item.dealer
                          .dealerCode
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <PendingReasonBadge
                      reason={
                        item.reason
                      }
                    />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {new Date(
                      item.pendingSince
                    ).toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {new Date(
                      item.slaDeadline
                    ).toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    {item.status ===
                    "PENDING" ? (
                      <SLACountdown
                        deadline={
                          item.slaDeadline
                        }
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <SLAStatusBadge
                      status={
                        item.slaStatus
                      }
                    />
                  </td>

                  <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">
                    {
                      item.reminderCount
                    }
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          navigate(
                            `/complaints/${item.complaintId}`
                          )
                        }
                        title="View Complaint"
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye
                          size={17}
                        />
                      </button>

                      {onReminder &&
                        item.status ===
                          "PENDING" && (
                          <button
                            onClick={() =>
                              onReminder(
                                item.id
                              )
                            }
                            title="Send Reminder"
                            className="rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <BellRing
                              size={17}
                            />
                          </button>
                        )}

                      {onAction &&
                        item.status ===
                          "PENDING" && (
                          <button
                            onClick={() =>
                              onAction(
                                item
                              )
                            }
                            title="DG Action"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                          >
                            <MoreHorizontal
                              size={17}
                            />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}