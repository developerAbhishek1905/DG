import {
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import type {
  PendingReason,
  SetPendingPayload,
} from "../types/pending.types";

import {
  PENDING_REASON_LABELS,
} from "../services/pendingApi";

interface Props {
  open: boolean;

  complaintId: string;

  onClose: () => void;

  onSubmit: (
    payload: SetPendingPayload
  ) => Promise<void> | void;
}

interface FormValues {
  reason:
    PendingReason | "";

  remarks: string;
}

export default function PendingReasonModal({
  open,
  complaintId,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<FormValues>({
      defaultValues: {
        reason: "",
        remarks: "",
      },
    });

  useEffect(() => {
    if (open) {
      reset({
        reason: "",
        remarks: "",
      });
    }
  }, [open, reset]);

  if (!open) {
    return null;
  }

  const submit =
    async (
      data: FormValues
    ) => {
      if (!data.reason) {
        return;
      }

      await onSubmit({
        complaintId,

        reason:
          data.reason,

        remarks:
          data.remarks ||
          undefined,
      });
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Set Complaint Pending
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Complaint:{" "}
              {complaintId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Pending Reason *
            </label>

            <select
              {...register(
                "reason",
                {
                  required:
                    "Pending reason is required",
                }
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="">
                Select Reason
              </option>

              {Object.entries(
                PENDING_REASON_LABELS
              ).map(
                ([
                  value,
                  label,
                ]) => (
                  <option
                    key={
                      value
                    }
                    value={
                      value
                    }
                  >
                    {label}
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

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Remarks
            </label>

            <textarea
              rows={4}
              {...register(
                "remarks"
              )}
              placeholder="Provide additional details..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs leading-5 text-blue-700">
              Selecting Pending will start the SLA monitoring process automatically.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
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
                ? "Saving..."
                : "Set Pending"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}