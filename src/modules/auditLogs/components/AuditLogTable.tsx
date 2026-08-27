import {
  Eye,
} from "lucide-react";

import {
  useAppDispatch,
} from "../../../app/hooks";

import {
  setSelectedAuditLog,
} from "../store/auditLogSlice";

import type {
  AuditAction,
  AuditLog,
} from "../types/auditLog.types";

interface Props {
  logs: AuditLog[];
  loading?: boolean;
}

const actionStyles: Record<
  AuditAction,
  string
> = {
  CREATE:
    "bg-green-50 text-green-700",

  UPDATE:
    "bg-blue-50 text-blue-700",

  DELETE:
    "bg-red-50 text-red-700",

  VIEW:
    "bg-gray-100 text-gray-700",

  LOGIN:
    "bg-indigo-50 text-indigo-700",

  LOGOUT:
    "bg-gray-100 text-gray-600",

  APPROVE:
    "bg-green-50 text-green-700",

  REJECT:
    "bg-red-50 text-red-700",

  ASSIGN:
    "bg-purple-50 text-purple-700",

  REASSIGN:
    "bg-purple-50 text-purple-700",

  VERIFY:
    "bg-emerald-50 text-emerald-700",

  CANCEL:
    "bg-red-50 text-red-700",

  PAYMENT:
    "bg-cyan-50 text-cyan-700",

  EXPORT:
    "bg-amber-50 text-amber-700",

  STATUS_CHANGE:
    "bg-orange-50 text-orange-700",
};

export default function AuditLogTable({
  logs,
  loading = false,
}: Props) {
  const dispatch =
    useAppDispatch();

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">
          Loading audit logs...
        </p>
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-900">
          No audit logs found
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Try changing the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">

          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Date & Time
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                User
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Action
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Module
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Description
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Entity
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                IP Address
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {logs.map(
              (log) => {
                const date =
                  new Date(
                    log.createdAt
                  );

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      <div>
                        {date.toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-400">
                        {date.toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {log.user.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {log.user.role}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${actionStyles[log.action]}`}
                      >
                        {log.action.replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {log.module.replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </td>

                    <td className="max-w-[320px] px-5 py-4">
                      <p className="truncate text-sm text-gray-600">
                        {log.description}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {log.entityId ? (
                        <>
                          <p className="text-sm font-medium text-gray-800">
                            {log.entityId}
                          </p>

                          <p className="text-xs text-gray-400">
                            {log.entityType}
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-400">
                          —
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {log.ipAddress ??
                        "—"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            setSelectedAuditLog(
                              log
                            )
                          )
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
                        title="View details"
                      >
                        <Eye
                          size={17}
                        />
                      </button>
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