import {
  CalendarDays,
  Clock3,
  History,
  User,
  X,
} from "lucide-react";

import type {
  ComplaintActivity,
} from "../services/complaintActivity.service";

interface Props {
  open: boolean;

  loading: boolean;

  activities: ComplaintActivity[];

  complaintNumber?: string;

  onClose: () => void;
}

export default function ComplaintActivityModal({
  open,
  loading,
  activities,
  complaintNumber,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <History
                size={20}
                className="text-[#123B7A]"
              />

              <h2 className="text-lg font-bold text-gray-900">
                Complaint Activity
              </h2>
            </div>

            {complaintNumber && (
              <p className="mt-1 text-sm text-gray-500">
                {complaintNumber}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Loading activity...
              </p>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-12 text-center">
              <History
                size={36}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm font-medium text-gray-600">
                No activity found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Complaint activity will
                appear here.
              </p>
            </div>
          ) : (
            <div className="relative">
              {activities.map(
                (activity, index) => (
                  <div
                    key={
                      activity._id
                    }
                    className="relative flex gap-4 pb-7"
                  >
                    {/* Timeline */}

                    <div className="relative flex flex-col items-center">
                      <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#123B7A]">
                        <History
                          size={16}
                        />
                      </div>

                      {index !==
                        activities.length -
                          1 && (
                        <div className="absolute top-9 h-full w-px bg-gray-200" />
                      )}
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {
                              activity.title
                            }
                          </h3>

                          {activity.description && (
                            <p className="mt-1 text-sm text-gray-500">
                              {
                                activity.description
                              }
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                          {
                            activity.activityType
                          }
                        </span>
                      </div>

                      {/* STATUS CHANGE */}

                      {(activity.previousStatus ||
                        activity.newStatus) && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {activity.previousStatus && (
                            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                              {
                                activity.previousStatus
                              }
                            </span>
                          )}

                          {activity.previousStatus &&
                            activity.newStatus && (
                              <span className="text-xs text-gray-400">
                                →
                              </span>
                            )}

                          {activity.newStatus && (
                            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-[#123B7A]">
                              {
                                activity.newStatus
                              }
                            </span>
                          )}
                        </div>
                      )}

                      {/* REASON */}

                      {activity.reason && (
                        <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2">
                          <p className="text-xs font-medium text-amber-700">
                            Reason
                          </p>

                          <p className="mt-0.5 text-sm text-amber-800">
                            {
                              activity.reason
                            }
                          </p>
                        </div>
                      )}

                      {/* APPOINTMENT */}

                      {(activity.appointmentDate ||
                        activity.appointmentTime) && (
                        <div className="mt-3 flex flex-wrap gap-4">
                          {activity.appointmentDate && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <CalendarDays
                                size={14}
                              />

                              {formatDate(
                                activity.appointmentDate,
                              )}
                            </div>
                          )}

                          {activity.appointmentTime && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock3
                                size={14}
                              />

                              {
                                activity.appointmentTime
                              }
                            </div>
                          )}
                        </div>
                      )}

                      {/* DEALER */}

                      {activity.dealerName && (
                        <p className="mt-3 text-xs text-gray-500">
                          Dealer:{" "}
                          <span className="font-medium text-gray-700">
                            {
                              activity.dealerName
                            }
                          </span>
                        </p>
                      )}

                      {/* TECHNICIAN */}

                      {activity.technicianName && (
                        <p className="mt-1 text-xs text-gray-500">
                          Technician:{" "}
                          <span className="font-medium text-gray-700">
                            {
                              activity.technicianName
                            }
                          </span>
                        </p>
                      )}

                      {/* USER / DATE */}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <User
                            size={13}
                          />

                          {activity.performedByName ||
                            "System"}

                          {activity.performedByRole && (
                            <span>
                              (
                              {
                                activity.performedByRole
                              }
                              )
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400">
                          {formatDateTime(
                            activity.activityAt,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B2854]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(
  value: string,
) {
  if (!value) return "-";

  return new Date(
    value,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function formatDateTime(
  value: string,
) {
  if (!value) return "-";

  return new Date(
    value,
  ).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",
    },
  );
}