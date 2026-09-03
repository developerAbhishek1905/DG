import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import type {
  Brand,
  BrandFormData,
} from "../types/brand.types";

interface Props {
  brand?: Brand | null;

  loading?: boolean;

  onSubmit: (
    data: BrandFormData
  ) => Promise<void> | void;

  onCancel?: () => void;
}

export default function BrandForm({
  brand,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
    },
  } = useForm<BrandFormData>({
    defaultValues: {
      brandName: "",
    },
  });

  useEffect(() => {
    reset({
      brandName:
        brand?.brandName ?? "",
    });
  }, [
    brand,
    reset,
  ]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Brand Name
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <input
          {...register("brandName", {
            required:
              "Brand name is required",

            minLength: {
              value: 2,
              message:
                "Brand name must contain at least 2 characters",
            },
          })}
          placeholder="Enter brand name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.brandName && (
          <p className="mt-1 text-xs text-red-600">
            {errors.brandName.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : brand
              ? "Update Brand"
              : "Add Brand"}
        </button>
      </div>
    </form>
  );
}