import {
  useForm,
} from "react-hook-form";

import type {
  AppointmentFormData,
} from "../types/appointment.types";

interface Props {
  complaintId?: string;

  dealerId?: string;

  onSubmit: (
    data: AppointmentFormData
  ) => Promise<void> | void;

  submitLabel?: string;
}

export default function AppointmentForm({
  complaintId = "",
  dealerId = "",
  onSubmit,
  submitLabel = "Create Appointment",
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<AppointmentFormData>({
      defaultValues: {
        complaintId,

        dealerId,

        type: "SERVICE",

        appointmentDate:
          "",

        appointmentTime:
          "",

        notes: "",
      },
    });

  const submit = async (
    data: AppointmentFormData
  ) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={
        handleSubmit(submit)
      }
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Complaint ID"
          error={
            errors.complaintId
              ?.message
          }
          {...register(
            "complaintId",
            {
              required:
                "Complaint ID is required",
            }
          )}
        />

        <Input
          label="Dealer ID"
          error={
            errors.dealerId
              ?.message
          }
          {...register(
            "dealerId",
            {
              required:
                "Dealer ID is required",
            }
          )}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Appointment Type
          </label>

          <select
            {...register(
              "type",
              {
                required: true,
              }
            )}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="SERVICE">
              Service
            </option>

            <option value="INSTALLATION">
              Installation
            </option>

            <option value="UNINSTALLATION">
              Uninstallation
            </option>

            <option value="INSPECTION">
              Inspection
            </option>

            <option value="VISIT">
              Visit
            </option>
          </select>
        </div>

        <Input
          label="Appointment Date"
          type="date"
          error={
            errors.appointmentDate
              ?.message
          }
          {...register(
            "appointmentDate",
            {
              required:
                "Appointment date is required",
            }
          )}
        />

        <Input
          label="Appointment Time"
          type="time"
          error={
            errors.appointmentTime
              ?.message
          }
          {...register(
            "appointmentTime",
            {
              required:
                "Appointment time is required",
            }
          )}
        />

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Notes
          </label>

          <textarea
            rows={4}
            {...register(
              "notes"
            )}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({
  label,
  error,
  ...props
}: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}