import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { DealerLeave } from "../types/dealer.types";

interface Props {
  leaves?: DealerLeave[];
}

export default function LeaveHistoryCard({
  leaves = [],
}: Props) {
  const sortedLeaves = [...leaves].sort(
    (a, b) =>
      new Date(b.from).getTime() -
      new Date(a.from).getTime(),
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays
            size={18}
            className="text-[#123B7A]"
          />

          <h2 className="text-sm font-semibold text-gray-900">
            Leave History
          </h2>
        </div>

        <span className="text-xs text-gray-500">
          {leaves.length}{" "}
          {leaves.length === 1 ? "Leave" : "Leaves"}
        </span>
      </div>

      {/* EMPTY */}

      {!sortedLeaves.length ? (
        <div className="px-5 py-10 text-center">
          <CalendarDays
            size={28}
            className="mx-auto mb-2 text-gray-300"
          />

          <p className="text-sm text-gray-500">
            No leave history found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  From
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  To
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Duration
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Reason
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {sortedLeaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                    {formatDate(leave.from)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                    {formatDate(leave.to)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                    {getLeaveDuration(
                      leave.from,
                      leave.to,
                    )}
                  </td>

                  <td className="max-w-[300px] px-5 py-4">
                    <p
                      title={leave.reason}
                      className="truncate text-sm text-gray-600"
                    >
                      {leave.reason || "-"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <LeaveStatusBadge
                      status={leave.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ========================================
   LEAVE STATUS
======================================== */

function LeaveStatusBadge({
  status,
}: {
  status: DealerLeave["status"];
}) {
  const config = {
    SCHEDULED: {
      label: "Scheduled",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
      icon: Clock3,
    },

    ACTIVE: {
      label: "On Leave",
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
      icon: CalendarDays,
    },

    COMPLETED: {
      label: "Completed",
      className:
        "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle2,
    },

    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${current.className}`}
    >
      <Icon size={12} />

      {current.label}
    </span>
  );
}

/* ========================================
   FORMAT DATE
======================================== */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

/* ========================================
   LEAVE DURATION
======================================== */

function getLeaveDuration(
  from: string,
  to: string,
) {
  const start = new Date(from);
  const end = new Date(to);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const milliseconds =
    end.getTime() - start.getTime();

  const days =
    Math.floor(
      milliseconds / (1000 * 60 * 60 * 24),
    ) + 1;

  return `${days} ${days === 1 ? "Day" : "Days"}`;
}