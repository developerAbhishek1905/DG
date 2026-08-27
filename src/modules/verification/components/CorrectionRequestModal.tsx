import {
  FileWarning,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import type {
  CorrectionRequestPayload,
  VerificationRecord,
} from "../types/verification.types";

interface Props {
  open: boolean;

  verification?: VerificationRecord;

  onClose: () => void;

  onSubmit: (
    payload: CorrectionRequestPayload
  ) => Promise<void> | void;
}

interface FormValues {
  reason: string;

  proofCorrection: boolean;

  serviceCorrection: boolean;

  customerCorrection: boolean;

  documentCorrection: boolean;

  remarks: string;
}

export default function CorrectionRequestModal({
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

        proofCorrection:
          false,

        serviceCorrection:
          false,

        customerCorrection:
          false,

        documentCorrection:
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
    const requiredCorrections:
      string[] = [];

    if (
      data.proofCorrection
    ) {
      requiredCorrections.push(
        "Update closure proof"
      );
    }

    if (
      data.serviceCorrection
    ) {
      requiredCorrections.push(
        "Correct service/work details"
      );
    }

    if (
      data.customerCorrection
    ) {
      requiredCorrections.push(
        "Update customer confirmation"
      );
    }

    if (
      data.documentCorrection
    ) {
      requiredCorrections.push(
        "Provide required document"
      );
    }

    if (
      !requiredCorrections.length
    ) {
      alert(
        "Select at least one required correction"
      );

      return;
    }

    await onSubmit({
      verificationId:
        verification.id,

      reason:
        data.reason,

      requiredCorrections,

      remarks:
        data.remarks ||
        undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <FileWarning
              size={20}
              className="text-amber-600"
            />

            <div>
              <h2 className="font-semibold">
                Request Correction
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
              Correction Reason *
            </label>

            <textarea
              rows={3}
              {...register(
                "reason",
                {
                  required:
                    "Correction reason is required",
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

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">
              Required Corrections
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <CheckItem
                label="Closure Proof"
                {...register(
                  "proofCorrection"
                )}
              />

              <CheckItem
                label="Service Details"
                {...register(
                  "serviceCorrection"
                )}
              />

              <CheckItem
                label="Customer Confirmation"
                {...register(
                  "customerCorrection"
                )}
              />

              <CheckItem
                label="Supporting Documents"
                {...register(
                  "documentCorrection"
                )}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Additional Remarks
            </label>

            <textarea
              rows={3}
              {...register(
                "remarks"
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
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
              className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting
                ? "Sending..."
                : "Request Correction"}
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
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3">
      <input
        type="checkbox"
        {...props}
      />

      <span className="text-sm text-gray-700">
        {label}
      </span>
    </label>
  );
}