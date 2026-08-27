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
  EligibleDealer,
  ReassignDealerPayload,
} from "../types/allocation.types";

interface Props {
  open: boolean;

  complaintId: string;

  currentDealerName?: string;

  dealers: EligibleDealer[];

  defaultDealerId?: string | null;

  onClose: () => void;

  onSubmit: (
    payload: ReassignDealerPayload
  ) => Promise<void> | void;
}

interface FormValues {
  dealerId: string;
  reason: string;
  remarks: string;
}

const reasons = [
  "Dealer did not respond within SLA",
  "Dealer requested cancellation",
  "Capacity issue",
  "Customer requested another dealer",
  "Incorrect initial allocation",
  "Technical capability issue",
  "Other",
];

export default function ReassignDealerModal({
  open,
  complaintId,
  currentDealerName,
  dealers,
  defaultDealerId,
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
  } = useForm<FormValues>();

  useEffect(() => {
    if (!open) return;

    reset({
      dealerId:
        defaultDealerId ?? "",
      reason: "",
      remarks: "",
    });
  }, [
    open,
    defaultDealerId,
    reset,
  ]);

  if (!open) {
    return null;
  }

  const handleFormSubmit = async (
    data: FormValues
  ) => {
    await onSubmit({
      complaintId,

      dealerId: data.dealerId,

      reason: data.reason,

      remarks:
        data.remarks ||
        undefined,
    });
  };

  const eligibleDealers =
    dealers.filter(
      (dealer) =>
        dealer.eligible
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Reassign Dealer
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Complaint:
              {" "}
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
              handleFormSubmit
            )
          }
          className="space-y-5 p-6"
        >
          {currentDealerName && (
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <p className="text-xs text-amber-700">
                  Current Dealer
                </p>

                <p className="mt-1 text-sm font-semibold text-amber-900">
                  {currentDealerName}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Dealer
            </label>

            <select
              {...register(
                "dealerId",
                {
                  required:
                    "Please select a dealer",
                }
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">
                Select Dealer
              </option>

              {eligibleDealers.map(
                (dealer) => (
                  <option
                    key={
                      dealer.id
                    }
                    value={
                      dealer.id
                    }
                  >
                    {
                      dealer.name
                    }{" "}
                    —{" "}
                    {
                      dealer.availableCapacity
                    }{" "}
                    available —{" "}
                    {
                      dealer.cancellationRate
                    }
                    % cancel
                  </option>
                )
              )}
            </select>

            {errors.dealerId && (
              <p className="mt-1 text-xs text-red-600">
                {
                  errors.dealerId
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Reassignment Reason
            </label>

            <select
              {...register(
                "reason",
                {
                  required:
                    "Reason is required",
                }
              )}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
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

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Remarks
            </label>

            <textarea
              rows={4}
              {...register(
                "remarks"
              )}
              placeholder="Optional additional details..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
            >
              {isSubmitting
                ? "Reassigning..."
                : "Confirm Reassignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}