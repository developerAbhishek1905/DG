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
  RejectVerificationPayload,
  VerificationRecord,
} from "../types/verification.types";

interface Props {
  open: boolean;

  verification?: VerificationRecord;

  onClose: () => void;

  onSubmit: (
    payload: RejectVerificationPayload
  ) => Promise<void> | void;
}

interface FormValues {
  reason: string;

  remarks: string;
}

export default function RejectVerificationModal({
  open,
  verification,
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
        remarks: "",
      });
    }
  }, [open, reset]);

  if (
    !open ||
    !verification
  ) {
    return null;
  }

  const submit = async (
    data: FormValues
  ) => {
    await onSubmit({
      verificationId:
        verification.id,

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
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <XCircle
              size={20}
              className="text-red-600"
            />

            <div>
              <h2 className="font-semibold">
                Reject Verification
              </h2>

              <p className="text-xs text-gray-500">
                {
                  verification.complaintNumber
                }
              </p>
            </div>
          </div>

          <button
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

            <select
              {...register(
                "reason",
                {
                  required:
                    "Rejection reason is required",
                }
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="">
                Select reason
              </option>

              <option value="INVALID_PROOF">
                Invalid Proof
              </option>

              <option value="WORK_NOT_COMPLETED">
                Work Not Completed
              </option>

              <option value="CUSTOMER_DISPUTE">
                Customer Dispute
              </option>

              <option value="INCORRECT_CLOSURE_TYPE">
                Incorrect Closure Type
              </option>

              <option value="FALSE_INFORMATION">
                False Information
              </option>

              <option value="OTHER">
                Other
              </option>
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
            <label className="mb-1 block text-sm font-medium">
              Remarks
            </label>

            <textarea
              rows={4}
              {...register(
                "remarks"
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>

          <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-700">
            Rejecting verification will send the complaint back into the service workflow.
          </div>

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
                isSubmitting
              }
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting
                ? "Rejecting..."
                : "Reject Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}