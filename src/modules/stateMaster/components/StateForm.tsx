import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { StateFormData, StateMaster } from "../types/state.types";

interface Props {
  state?: StateMaster | null;
  loading?: boolean;
  onSubmit: (data: StateFormData) => Promise<void> | void;
  onCancel: () => void;
}

export default function StateForm({
  state,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StateFormData>({
  defaultValues: {
    state_id: state?.state_id ,
    state_name: state?.state_name ?? "",
  },
});

  // useEffect(() => {
  //   reset({
  //     stateName: state?.stateName ?? "",
  //   });
  // }, [state, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
<div className="grid gap-4 md:grid-cols-2">
  <div>
    <label className={labelClass}>
      State ID
      {/* <span className="ml-1 text-red-500">*</span> */}
    </label>

    <input
      type="number"
      // min={1}
      placeholder="Enter state ID"
      {...register("state_id", {
        // required: "State ID is required",
        valueAsNumber: true,
        // min: {
        //   value: 1,
        //   message: "State ID must be greater than 0",
        // },
      })}
      className={inputClass}
    />

    {errors.state_id && (
      <p className="mt-1 text-xs text-red-600">
        {errors.state_id.message}
      </p>
    )}
  </div>

  <div>
    <label className={labelClass}>
      State Name
      <span className="ml-1 text-red-500">*</span>
    </label>

    <input
      placeholder="Enter state name"
      {...register("state_name", {
        required: "State name is required",
      })}
      className={inputClass}
    />

    {errors.state_name && (
      <p className="mt-1 text-xs text-red-600">
        {errors.state_name.message}
      </p>
    )}
  </div>
</div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {loading ? "Saving..." : state ? "Update State" : "Add State"}
        </button>
      </div>
    </form>
  );
}

const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
