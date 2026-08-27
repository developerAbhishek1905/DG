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
  VerificationRecord,
  VerifyComplaintPayload,
} from "../types/verification.types";

interface Props {
  open: boolean;

  verification?: VerificationRecord;

  onClose: () => void;

  onSubmit: (
    payload: VerifyComplaintPayload
  ) => Promise<void> | void;
}

interface FormValues {
  proofVerified: boolean;

  workVerified: boolean;

  customerConfirmation: boolean;

  remarks: string;
}

export default function VerifyComplaintModal({
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
        proofVerified:
          false,

        workVerified:
          false,

        customerConfirmation:
          false,

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

      proofVerified:
        data.proofVerified,

      workVerified:
        data.workVerified,

      customerConfirmation:
        data.customerConfirmation,

      remarks:
        data.remarks ||
        undefined,
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
                Verify Complaint Closure
              </h2>

              <p className="text-xs text-gray-500">
                {
                  verification.complaintNumber
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
          <CheckItem
            label="Closure proof has been verified"
            {...register(
              "proofVerified",
              {
                validate: (
                  value
                ) =>
                  value ||
                  "Proof verification is required",
              }
            )}
          />

          {errors.proofVerified && (
            <p className="text-xs text-red-600">
              {
                errors.proofVerified
                  .message
              }
            </p>
          )}

          <CheckItem
            label="Service/work details are correct"
            {...register(
              "workVerified",
              {
                validate: (
                  value
                ) =>
                  value ||
                  "Work verification is required",
              }
            )}
          />

          {errors.workVerified && (
            <p className="text-xs text-red-600">
              {
                errors.workVerified
                  .message
              }
            </p>
          )}

          <CheckItem
            label="Customer confirmation received"
            {...register(
              "customerConfirmation"
            )}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Verification Remarks
            </label>

            <textarea
              rows={4}
              {...register(
                "remarks"
              )}
              placeholder="Optional verification notes..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>

          <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-xs leading-5 text-green-700">
            After verification, the complaint can move to Closed and become eligible for billing.
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              disabled={
                isSubmitting
              }
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting
                ? "Verifying..."
                : "Verify Closure"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CheckItem({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4">
      <input
        type="checkbox"
        className="mt-1"
        {...props}
      />

      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>
    </label>
  );
}