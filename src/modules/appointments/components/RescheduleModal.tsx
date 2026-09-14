import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type {
  Appointment,
  RescheduleAppointmentPayload,
} from "../types/appointment.types";

interface Props {
  open: boolean;
  appointment?: Appointment;
  onClose: () => void;
  onSubmit: (payload: RescheduleAppointmentPayload) => Promise<void> | void;
}

interface FormValues {
  appointmentDate: string;
  appointmentTime: string;
}

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

    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  /* =========================
     DATE HELPERS
  ========================= */

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = new Date();

  const maximumDate = new Date();

  maximumDate.setDate(maximumDate.getDate() + 7);

  const todayString = formatDateForInput(today);

  const maxDateString = formatDateForInput(maximumDate);

  /* =========================
     RESET FORM
  ========================= */

  useEffect(() => {
    if (!open || !appointment) {
      return;
    }

    reset({
      appointmentDate: appointment.appointmentDate || todayString,

      appointmentTime: appointment.appointmentTime || "",
    });
  }, [open, appointment, reset, todayString]);

  if (!open || !appointment) {
    return null;
  }

  const selectedDate = watch("appointmentDate");

  /* =========================
     SUBMIT
  ========================= */

  const submit = async (data: FormValues) => {
    await onSubmit({
      appointmentId: appointment._id,

      appointmentDate: data.appointmentDate,

      appointmentTime: data.appointmentTime,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* =========================
            HEADER
        ========================= */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Reschedule Appointment
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {appointment.complaintNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <form onSubmit={handleSubmit(submit)} className="space-y-5 p-6">
          {/* INFO */}

          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-medium text-amber-900">
                Reschedule within 7 days
              </p>

              <p className="mt-1 text-xs text-amber-700">
                You can select any date from today until {maxDateString}.
              </p>
            </div>
          </div>

          {/* =========================
              DATE
          ========================= */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Appointment Date
            </label>

            <input
              type="date"
              min={todayString}
              max={maxDateString}
              {...register("appointmentDate", {
                required: "New date is required",

                validate: {
                  minimumDate: (value) =>
                    value >= todayString || "Past date is not allowed",

                  maximumDate: (value) =>
                    value <= maxDateString ||
                    "You can reschedule only within 7 days",
                },
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
            />

            {errors.appointmentDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.appointmentDate.message}
              </p>
            )}
          </div>

          {/* =========================
              TIME
          ========================= */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Appointment Time
            </label>

            <input
              type="time"
              {...register("appointmentTime", {
                required: "New time is required",
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
            />

            {errors.appointmentTime && (
              <p className="mt-1 text-xs text-red-600">
                {errors.appointmentTime.message}
              </p>
            )}
          </div>

          {/* PREVIEW */}

          {selectedDate && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-700">New appointment</p>

              <p className="mt-1 text-sm font-semibold text-[#123B7A]">
                {selectedDate}
              </p>
            </div>
          )}

          {/* =========================
              FOOTER
          ========================= */}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
