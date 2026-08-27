import {
  useForm,
} from "react-hook-form";

import type {
  UninstallationClosureData,
} from "../types/closure.types";

interface Props {
  onSubmit: (
    data: UninstallationClosureData
  ) => void;
}

export default function UninstallationClosureForm({
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<UninstallationClosureData>();

  return (
    <form
      id="uninstallation-closure-form"
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="space-y-5"
    >
      <Checkbox
        label="Uninstallation Completed"
        {...register(
          "uninstallationCompleted"
        )}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Product Condition
        </label>

        <select
          {...register(
            "productCondition",
            {
              required:
                "Product condition is required",
            }
          )}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        >
          <option value="">
            Select Condition
          </option>

          <option value="GOOD">
            Good
          </option>

          <option value="DAMAGED">
            Damaged
          </option>

          <option value="PARTIALLY_DAMAGED">
            Partially Damaged
          </option>
        </select>

        {errors.productCondition && (
          <p className="mt-1 text-xs text-red-600">
            {
              errors.productCondition
                .message
            }
          </p>
        )}
      </div>

      <Checkbox
        label="Product Collected"
        {...register(
          "productCollected"
        )}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Collection Reference
        </label>

        <input
          {...register(
            "collectionReference"
          )}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        />
      </div>

      <button
        type="submit"
        className="hidden"
      />
    </form>
  );
}

function Checkbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
      <input
        type="checkbox"
        {...props}
      />

      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>
    </label>
  );
}