import {
  CheckCircle2,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import type {
  ApproveCancellationPayload,
  CancellationRequest,
} from "../types/cancellation.types";

interface Props {
  open: boolean;

  request?: CancellationRequest;

  onClose: () => void;

  onSubmit: (
    payload: ApproveCancellationPayload
  ) => Promise<void> | void;
}

interface FormValues {
  remarks: string;

  reassignAfterApproval: boolean;
}

export default function ApproveCancellationModal({
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
      isSubmitting,
    },
  } =
    useForm<FormValues>();

  useEffect(() => {
    if (open) {
      reset({
        remarks: "",

        reassignAfterApproval:
          false,
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

      remarks:
        data.remarks ||
        undefined,

      reassignAfterApproval:
        data.reassignAfterApproval,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={20}
              className="text-green-600"
            />

            <div>
              <h2 className="font-semibold text-gray-900">
                Approve Cancellation
              </h2>

              <p className="text-xs text-gray-500">
                {
                  request.complaintNumber
                }
              </p>
            </div>
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
          {request.verification
            .status !==
            "VERIFIED" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Customer verification must be completed before cancellation approval.
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Approval Remarks
            </label>

            <textarea
              rows={4}
              {...register(
                "remarks"
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>

          {request.reason ===
            "DEALER_UNAVAILABLE" && (
            <label className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <input
                type="checkbox"
                {...register(
                  "reassignAfterApproval"
                )}
                className="mt-1"
              />

              <div>
                <p className="text-sm font-medium text-blue-800">
                  Reassign complaint
                </p>

                <p className="mt-1 text-xs text-blue-600">
                  Instead of permanently closing the service request, send it for dealer reassignment.
                </p>
              </div>
            </label>
          )}

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              disabled={
                isSubmitting ||
                request.verification
                  .status !==
                  "VERIFIED"
              }
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting
                ? "Approving..."
                : "Approve Cancellation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}