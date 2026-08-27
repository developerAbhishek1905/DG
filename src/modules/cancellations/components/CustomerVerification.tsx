import {
  CheckCircle2,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import Card from "../../../components/ui/Card";

import type {
  CancellationRequest,
  VerifyCustomerPayload,
} from "../types/cancellation.types";

interface Props {
  request: CancellationRequest;

  onVerify: (
    payload: VerifyCustomerPayload
  ) => Promise<void> | void;
}

interface FormValues {
  customerConfirmedCancellation:
    "YES" | "NO";

  verificationMethod:
    | "CALL"
    | "OTP"
    | "EMAIL"
    | "MANUAL";

  remarks: string;
}

export default function CustomerVerification({
  request,
  onVerify,
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<FormValues>({
      defaultValues: {
        verificationMethod:
          "CALL",

        remarks: "",
      },
    });

  const verified =
    request.verification.status ===
    "VERIFIED";

  if (verified) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <ShieldCheck
              size={20}
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Customer Verification
            </h3>

            <p className="text-sm text-green-600">
              Verification completed
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Info
            label="Cancellation Confirmed"
            value={
              request.verification
                .customerConfirmedCancellation
                ? "Yes"
                : "No"
            }
          />

          <Info
            label="Method"
            value={
              request.verification
                .verificationMethod ??
              "-"
            }
          />

          <Info
            label="Verified By"
            value={
              request.verification
                .verifiedBy ??
              "-"
            }
          />

          <Info
            label="Verified At"
            value={
              request.verification
                .verifiedAt
                ? new Date(
                    request.verification
                      .verifiedAt
                  ).toLocaleString()
                : "-"
            }
          />
        </div>

        {request.verification
          .remarks && (
          <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            {
              request.verification
                .remarks
            }
          </p>
        )}
      </Card>
    );
  }

  const submit = async (
    data: FormValues
  ) => {
    await onVerify({
      cancellationId:
        request.id,

      customerConfirmedCancellation:
        data.customerConfirmedCancellation ===
        "YES",

      verificationMethod:
        data.verificationMethod,

      remarks:
        data.remarks ||
        undefined,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <Phone
          size={19}
          className="text-[#123B7A]"
        />

        <div>
          <h3 className="font-semibold text-gray-900">
            Customer Verification
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Verify the cancellation request with the customer before approval.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-900">
          {
            request.customer.name
          }
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {
            request.customer.phone
          }
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit(submit)
        }
        className="mt-6 space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Did customer confirm cancellation?
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3">
              <input
                type="radio"
                value="YES"
                {...register(
                  "customerConfirmedCancellation",
                  {
                    required:
                      "Please select customer response",
                  }
                )}
              />

              <CheckCircle2
                size={17}
                className="text-green-600"
              />

              <span className="text-sm">
                Yes
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3">
              <input
                type="radio"
                value="NO"
                {...register(
                  "customerConfirmedCancellation",
                  {
                    required:
                      "Please select customer response",
                  }
                )}
              />

              <XCircle
                size={17}
                className="text-red-500"
              />

              <span className="text-sm">
                No
              </span>
            </label>
          </div>

          {errors
            .customerConfirmedCancellation && (
            <p className="mt-1 text-xs text-red-600">
              {
                errors
                  .customerConfirmedCancellation
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Verification Method
          </label>

          <select
            {...register(
              "verificationMethod"
            )}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="CALL">
              Phone Call
            </option>

            <option value="OTP">
              OTP
            </option>

            <option value="EMAIL">
              Email
            </option>

            <option value="MANUAL">
              Manual
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
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
          type="submit"
          disabled={
            isSubmitting
          }
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting
            ? "Verifying..."
            : "Save Verification"}
        </button>
      </form>
    </Card>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}