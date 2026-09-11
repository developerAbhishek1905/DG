import {
  useEffect,
  useState,
} from "react";

import type {
  AppointmentStatus,
} from "../types/appointment.types";

interface Props {
  open: boolean;

  status: AppointmentStatus | null;

  onClose: () => void;

  onSubmit: (data: {
    appointmentDate?: string;
    appointmentTime?: string;
    pendingReason?: string;
    cancellationReason?: string;
  }) => void;

  loading?: boolean;
}

const pendingReasons = [
  {
    value: "WAITING_FOR_CUSTOMER",
    label: "Waiting for customer",
  },
  {
    value: "PRODUCT_INSPECTION_PENDING",
    label: "Product inspection & pending",
  },
  {
    value: "SPARE_PARTS_NOT_AVAILABLE",
    label: "Spare parts not available",
  },
];

const customerCancellationReasons = [
  {
    value: "CUSTOMER_NOT_AVAILABLE",
    label: "Customer not available",
  },
  {
    value: "PHONE_NOT_PICKED",
    label: "Phone not picked",
  },
  {
    value: "CUSTOMER_REQUESTED_CALLBACK",
    label: "Customer requested callback",
  },
  {
    value: "CUSTOMER_BOUGHT_ANOTHER_PRODUCT",
    label: "Customer bought another product",
  },
  {
    value: "WRONG_LOCATION_SHARED",
    label: "Wrong location shared",
  },
  {
    value: "ADDRESS_NOT_AVAILABLE",
    label: "Address not available",
  },
  {
    value: "NOT_INTERESTED",
    label: "Not interested",
  },
];

const technicalCancellationReasons = [
  {
    value: "ISSUE_ALREADY_RESOLVED",
    label: "Issue already resolved",
  },
  {
    value: "WRONG_PRODUCT",
    label: "Wrong product",
  },
  {
    value: "PRODUCT_REPLACED",
    label: "Product replaced",
  },
  {
    value: "LOCAL_TECHNICIAN_ATTENDED",
    label: "Local technician attended",
  },
  {
    value: "DUPLICATE_COMPLAINT",
    label: "Duplicate complaint",
  },
  {
    value: "SERVICE_NOT_REQUIRED",
    label: "Service not required",
  },
  {
    value: "HIGH_REPAIR_COST",
    label: "High repair cost",
  },
];

export default function StatusUpdateModal({
  open,
  status,
  onClose,
  onSubmit,
  loading = false,
}: Props) {
  const [appointmentDate, setAppointmentDate] =
    useState("");

  const [appointmentTime, setAppointmentTime] =
    useState("");

  const [pendingReason, setPendingReason] =
    useState("");

  const [
    cancellationReason,
    setCancellationReason,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      setAppointmentDate("");
      setAppointmentTime("");
      setPendingReason("");
      setCancellationReason("");
    }
  }, [open]);

  if (!open || !status) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Today / Tomorrow
  |--------------------------------------------------------------------------
  */

  const today = new Date();

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1,
  );

  const formatDateForInput = (
    date: Date,
  ) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      date.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayString =
    formatDateForInput(today);

  const tomorrowString =
    formatDateForInput(tomorrow);

  const handleSubmit = () => {
    if (
      status ===
      "APPOINTMENT_SCHEDULED"
    ) {
      if (
        !appointmentDate ||
        !appointmentTime
      ) {
        return;
      }

      onSubmit({
        appointmentDate,
        appointmentTime,
      });

      return;
    }

    if (status === "PENDING") {
      if (!pendingReason) {
        return;
      }

      onSubmit({
        pendingReason,
      });

      return;
    }

    if (status === "CANCELLED") {
      if (!cancellationReason) {
        return;
      }

      onSubmit({
        cancellationReason,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {status ===
                "APPOINTMENT_SCHEDULED" &&
                "Schedule Appointment"}

              {status === "PENDING" &&
                "Pending Reason"}

              {status ===
                "CANCELLED" &&
                "Cancel Complaint"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Please provide the required details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* ================================================================
            APPOINTMENT SCHEDULED
        ================================================================= */}

        {status ===
          "APPOINTMENT_SCHEDULED" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Appointment Date
              </label>

              <input
                type="date"
                value={appointmentDate}
                min={todayString}
                max={tomorrowString}
                onChange={(e) =>
                  setAppointmentDate(
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#123B7A]"
              />

              <p className="mt-1 text-xs text-gray-400">
                Only today or tomorrow can be selected.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Appointment Time
              </label>

              <input
                type="time"
                value={appointmentTime}
                onChange={(e) =>
                  setAppointmentTime(
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#123B7A]"
              />
            </div>
          </div>
        )}

        {/* ================================================================
            PENDING
        ================================================================= */}

        {status === "PENDING" && (
          <div className="space-y-2">
            {pendingReasons.map(
              (reason) => (
                <label
                  key={reason.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    pendingReason ===
                    reason.value
                      ? "border-[#123B7A] bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="pendingReason"
                    value={reason.value}
                    checked={
                      pendingReason ===
                      reason.value
                    }
                    onChange={(e) =>
                      setPendingReason(
                        e.target.value,
                      )
                    }
                  />

                  <span className="text-sm text-gray-700">
                    {reason.label}
                  </span>
                </label>
              ),
            )}
          </div>
        )}

        {/* ================================================================
            CANCELLED
        ================================================================= */}

        {status === "CANCELLED" && (
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Customer Related Reasons
              </h3>

              <div className="space-y-2">
                {customerCancellationReasons.map(
                  (reason) => (
                    <label
                      key={reason.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                        cancellationReason ===
                        reason.value
                          ? "border-[#123B7A] bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason.value}
                        checked={
                          cancellationReason ===
                          reason.value
                        }
                        onChange={(e) =>
                          setCancellationReason(
                            e.target
                              .value,
                          )
                        }
                      />

                      <span className="text-sm text-gray-700">
                        {
                          reason.label
                        }
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Technical / Product Related Reasons
              </h3>

              <div className="space-y-2">
                {technicalCancellationReasons.map(
                  (reason) => (
                    <label
                      key={reason.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                        cancellationReason ===
                        reason.value
                          ? "border-[#123B7A] bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason.value}
                        checked={
                          cancellationReason ===
                          reason.value
                        }
                        onChange={(e) =>
                          setCancellationReason(
                            e.target
                              .value,
                          )
                        }
                      />

                      <span className="text-sm text-gray-700">
                        {
                          reason.label
                        }
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}

        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}