import {
  useForm,
} from "react-hook-form";

import type {
  PartClosureData,
} from "../types/closure.types";

interface Props {
  onSubmit: (
    data: PartClosureData
  ) => void;
}

export default function PartClosureForm({
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<PartClosureData>({
      defaultValues: {
        quantity: 1,
      },
    });

  return (
    <form
      id="part-closure-form"
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="grid gap-4 md:grid-cols-2"
    >
      <Input
        label="Part Name"
        error={
          errors.partName
            ?.message
        }
        {...register(
          "partName",
          {
            required:
              "Part name is required",
          }
        )}
      />

      <Input
        label="Part Code"
        {...register(
          "partCode"
        )}
      />

      <Input
        label="Quantity"
        type="number"
        min={1}
        error={
          errors.quantity
            ?.message
        }
        {...register(
          "quantity",
          {
            required:
              "Quantity is required",

            valueAsNumber:
              true,

            min: {
              value: 1,
              message:
                "Minimum quantity is 1",
            },
          }
        )}
      />

      <Input
        label="Serial Number"
        {...register(
          "serialNumber"
        )}
      />

      <Checkbox
        label="Old Part Returned"
        {...register(
          "oldPartReturned"
        )}
      />

      <Checkbox
        label="Replacement Successful"
        {...register(
          "replacementSuccessful"
        )}
      />

      <button
        type="submit"
        className="hidden"
      />
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