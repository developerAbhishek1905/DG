import {
  RefreshCw,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import Card from "../../../components/ui/Card";

import type {
  CancellationRequest,
  ReassignCancellationPayload,
} from "../types/cancellation.types";

interface Props {
  request: CancellationRequest;

  onReassign: (
    payload: ReassignCancellationPayload
  ) => Promise<void> | void;
}

interface FormValues {
  dealerId: string;

  remarks: string;
}

export default function ReassignAfterCancellation({
  request,
  onReassign,
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<FormValues>();

  if (
    request.status !==
      "APPROVED" ||
    request.reason !==
      "DEALER_UNAVAILABLE"
  ) {
    return null;
  }

  const submit = async (
    data: FormValues
  ) => {
    await onReassign({
      cancellationId:
        request.id,

      dealerId:
        data.dealerId,

      remarks:
        data.remarks ||
        undefined,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex gap-3">
        <RefreshCw
          size={19}
          className="text-[#123B7A]"
        />

        <div>
          <h3 className="font-semibold text-gray-900">
            Reassign After Cancellation
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Customer still requires service. Select another eligible dealer.
          </p>
        </div>
      </div>

      <form
        onSubmit={
          handleSubmit(
            submit
          )
        }
        className="mt-6 space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            New Dealer ID
          </label>

          <input
            {...register(
              "dealerId",
              {
                required:
                  "Dealer is required",
              }
            )}
            placeholder="DLR-002"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />

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
          <label className="mb-1 block text-sm font-medium">
            Remarks
          </label>

          <textarea
            rows={3}
            {...register(
              "remarks"
            )}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />
        </div>

        <button
          disabled={
            isSubmitting
          }
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          Reassign Dealer
        </button>
      </form>
    </Card>
  );
}