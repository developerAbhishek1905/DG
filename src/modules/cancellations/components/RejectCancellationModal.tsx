import {
  X,
  XCircle,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import type {
  CancellationRequest,
  RejectCancellationPayload,
} from "../types/cancellation.types";

interface Props {
  open: boolean;

  request?: CancellationRequest;

  onClose: () => void;

  onSubmit: (
    payload: RejectCancellationPayload
  ) => Promise<void> | void;
}

interface FormValues {
  reason: string;
}

export default function RejectCancellationModal({
  open,
  request,
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
    useForm<FormValues>();

  useEffect(() => {
    if (open) {
      reset({
        reason: "",
      });
    }
  }, [open, reset]);

  if (
    !open ||
    !request
  ) {
    return null;
  }

  const submit = async (
    data: FormValues
  ) => {
    await onSubmit({
      cancellationId:
        request.id,

      reason:
        data.reason,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <XCircle
              size={20}
              className="text-red-600"
            />

            <h2 className="font-semibold">
              Reject Cancellation
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
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
            <label className="mb-1 block text-sm font-medium">
              Rejection Reason *
            </label>

            <textarea
              rows={4}
              {...register(
                "reason",
                {
                  required:
                    "Rejection reason is required",
                }
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />

            {errors.reason && (
              <p className="mt-1 text-xs text-red-600">
                {
                  errors.reason
                    .message
                }
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2.5 text-sm"
            >
              Close
            </button>

            <button
              disabled={
                isSubmitting
              }
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting
                ? "Rejecting..."
                : "Reject Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}