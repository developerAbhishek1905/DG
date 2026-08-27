import {
  useForm,
} from "react-hook-form";

import type {
  ServiceClosureData,
} from "../types/closure.types";

interface Props {
  onSubmit: (
    data: ServiceClosureData
  ) => void;
}

export default function ServiceClosureForm({
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<ServiceClosureData>();

  return (
    <form
      id="service-closure-form"
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="space-y-5"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Work Performed
        </label>

        <textarea
          rows={4}
          {...register(
            "workPerformed",
            {
              required:
                "Work performed is required",
            }
          )}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        />

        {errors.workPerformed && (
          <p className="mt-1 text-xs text-red-600">
            {
              errors.workPerformed
                .message
            }
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Checkbox
          label="Issue Resolved"
          {...register(
            "issueResolved"
          )}
        />

        <Checkbox
          label="Testing Completed"
          {...register(
            "testingCompleted"
          )}
        />

        <Checkbox
          label="Customer Satisfied"
          {...register(
            "customerSatisfied"
          )}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Service Charge
        </label>

        <input
          type="number"
          min={0}
          {...register(
            "serviceCharge",
            {
              valueAsNumber:
                true,
            }
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