import {
  useForm,
} from "react-hook-form";

import type {
  VisitClosureData,
} from "../types/closure.types";

interface Props {
  onSubmit: (
    data: VisitClosureData
  ) => void;
}

export default function VisitClosureForm({
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<VisitClosureData>();

  return (
    <form
      id="visit-closure-form"
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="space-y-5"
    >
      <Toggle
        label="Visit Completed"
        {...register(
          "visitCompleted",
          {
            required: true,
          }
        )}
      />

      <Toggle
        label="Customer Available"
        {...register(
          "customerAvailable"
        )}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Issue Observed
        </label>

        <textarea
          rows={3}
          {...register(
            "issueObserved",
            {
              required:
                "Issue observation is required",
            }
          )}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        />

        {errors.issueObserved && (
          <p className="mt-1 text-xs text-red-600">
            {
              errors.issueObserved
                .message
            }
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Recommendation
        </label>

        <textarea
          rows={3}
          {...register(
            "recommendation"
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

function Toggle({
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