import {
  AlertTriangle,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import type {
  Appointment,
  RescheduleAppointmentPayload,
} from "../types/appointment.types";

interface Props {
  open: boolean;

  appointment?: Appointment;

  onClose: () => void;

  onSubmit: (
    payload: RescheduleAppointmentPayload
  ) => Promise<void> | void;
}

interface FormValues {
  appointmentDate: string;

  appointmentTime: string;

  reason: string;
}

const reasons = [
  "Customer unavailable",
  "Dealer unavailable",
  "Spare parts unavailable",
  "Technical issue",
  "Customer requested reschedule",
  "Weather / travel issue",
  "Other",
];

export default function RescheduleModal({
  open,
  appointment,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<FormValues>();

  useEffect(() => {
    if (
      !open ||
      !appointment
    ) {
      return;
    }

    reset({
      appointmentDate:
        appointment.appointmentDate,

      appointmentTime:
        appointment.appointmentTime,

      reason: "",
    });
  }, [
    open,
    appointment,
    reset,
  ]);

  if (
    !open ||
    !appointment
  ) {
    return null;
  }

  const originalDate =
    new Date(
      `${appointment.appointmentDate}T00:00:00`
    );

  const maximumDate =
    new Date(originalDate);

  maximumDate.setDate(
    maximumDate.getDate() +
      7
  );

  const maxDateString =
    maximumDate
      .toISOString()
      .split("T")[0];

  const selectedDate =
    watch(
      "appointmentDate"
    );

  const submit = async (
    data: FormValues
  ) => {
    await onSubmit({
      appointmentId:
        appointment.id,

      appointmentDate:
        data.appointmentDate,

      appointmentTime:
        data.appointmentTime,

      reason: data.reason,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Reschedule Appointment
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {
                appointment.complaintNumber
              }
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit(
              submit
            )
          }
          className="space-y-5 p-6"
        >
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-medium text-amber-900">
                Maximum reschedule:
                7 days
              </p>

              <p className="mt-1 text-xs text-amber-700">
                Appointment cannot
                be moved beyond{" "}
                {maxDateString}.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Date
            </label>

            <input
              type="date"
              min={
                appointment.appointmentDate
              }
              max={
                maxDateString
              }
              {...register(
                "appointmentDate",
                {
                  required:
                    "New date is required",

                  validate: (
                    value
                  ) =>
                    value <=
                      maxDateString ||
                    "Maximum reschedule is 7 days",
                }
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />

            {errors.appointmentDate && (
              <p className="mt-1 text-xs text-red-600">
                {
                  errors
                    .appointmentDate
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Time
            </label>

            <input
              type="time"
              {...register(
                "appointmentTime",
                {
                  required:
                    "New time is required",
                }
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />

            {errors.appointmentTime && (
              <p className="mt-1 text-xs text-red-600">
                {
                  errors
                    .appointmentTime
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Reason
            </label>

            <select
              {...register(
                "reason",
                {
                  required:
                    "Reschedule reason is required",
                }
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="">
                Select Reason
              </option>

              {reasons.map(
                (reason) => (
                  <option
                    key={reason}
                    value={reason}
                  >
                    {reason}
                  </option>
                )
              )}
            </select>

            {errors.reason && (
              <p className="mt-1 text-xs text-red-600">
                {
                  errors.reason
                    .message
                }
              </p>
            )}
          </div>

          {selectedDate && (
            <p className="text-xs text-gray-500">
              New appointment:
              {" "}
              {selectedDate}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting
                ? "Rescheduling..."
                : "Confirm Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}