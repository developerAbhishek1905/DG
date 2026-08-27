import {
  useForm,
} from "react-hook-form";

import type {
  InstallationClosureData,
} from "../types/closure.types";

interface Props {
  onSubmit: (
    data: InstallationClosureData
  ) => void;
}

export default function InstallationClosureForm({
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<InstallationClosureData>();

  return (
    <form
      id="installation-closure-form"
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="space-y-5"
    >
      <Checkbox
        label="Installation Completed"
        {...register(
          "installationCompleted"
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Product Serial Number"
          error={
            errors.productSerialNumber
              ?.message
          }
          {...register(
            "productSerialNumber",
            {
              required:
                "Serial number is required",
            }
          )}
        />

        <Input
          label="Installation Location"
          error={
            errors.installationLocation
              ?.message
          }
          {...register(
            "installationLocation",
            {
              required:
                "Installation location is required",
            }
          )}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Checkbox
          label="Demo Provided"
          {...register(
            "demoProvided"
          )}
        />

        <Checkbox
          label="Customer Training Provided"
          {...register(
            "customerTrainingProvided"
          )}
        />
      </div>

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