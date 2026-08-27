import {
  useForm,
} from "react-hook-form";

import type {
  RateFormData,
  RateMaster,
} from "../types/billing.types";

interface Props {
  rate?: RateMaster;

  onSubmit: (
    data: RateFormData
  ) => Promise<void> | void;

  onCancel?: () => void;
}

export default function RateForm({
  rate,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<RateFormData>({
      defaultValues: {
        code:
          rate?.code ?? "",

        closureType:
          rate?.closureType ??
          "SERVICE",

        serviceName:
          rate?.serviceName ??
          "",

        productCategory:
          rate?.productCategory ??
          "",

        city:
          rate?.city ?? "",

        baseRate:
          rate?.baseRate ??
          0,

        taxPercentage:
          rate?.taxPercentage ??
          18,

        effectiveFrom:
          rate?.effectiveFrom ??
          "",

        effectiveTo:
          rate?.effectiveTo ??
          "",

        active:
          rate?.active ??
          true,
      },
    });

  return (
    <form
      onSubmit={
        handleSubmit(
          onSubmit
        )
      }
      className="space-y-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Rate Code"
          error={
            errors.code
              ?.message
          }
          {...register(
            "code",
            {
              required:
                "Code is required",
            }
          )}
        />

        <div>
          <label className="mb-1 block text-sm font-medium">
            Closure Type
          </label>

          <select
            {...register(
              "closureType"
            )}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="VISIT">
              Visit
            </option>

            <option value="SERVICE">
              Service
            </option>

            <option value="PART">
              Part
            </option>

            <option value="INSTALLATION">
              Installation
            </option>

            <option value="UNINSTALLATION">
              Uninstallation
            </option>
          </select>
        </div>

        <Input
          label="Service Name"
          error={
            errors.serviceName
              ?.message
          }
          {...register(
            "serviceName",
            {
              required:
                "Service name is required",
            }
          )}
        />

        <Input
          label="Product Category"
          {...register(
            "productCategory"
          )}
        />

        <Input
          label="City"
          {...register(
            "city"
          )}
        />

        <Input
          label="Base Rate"
          type="number"
          min={0}
          step="0.01"
          {...register(
            "baseRate",
            {
              required: true,

              valueAsNumber:
                true,
            }
          )}
        />

        <Input
          label="Tax %"
          type="number"
          min={0}
          max={100}
          {...register(
            "taxPercentage",
            {
              required: true,

              valueAsNumber:
                true,
            }
          )}
        />

        <Input
          label="Effective From"
          type="date"
          {...register(
            "effectiveFrom",
            {
              required: true,
            }
          )}
        />

        <Input
          label="Effective To"
          type="date"
          {...register(
            "effectiveTo"
          )}
        />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
        <input
          type="checkbox"
          {...register(
            "active"
          )}
        />

        <span className="text-sm font-medium">
          Active Rate
        </span>
      </label>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={
              onCancel
            }
            className="rounded-lg border px-4 py-2.5 text-sm"
          >
            Cancel
          </button>
        )}

        <button
          disabled={
            isSubmitting
          }
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white"
        >
          {isSubmitting
            ? "Saving..."
            : rate
            ? "Update Rate"
            : "Create Rate"}
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
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}