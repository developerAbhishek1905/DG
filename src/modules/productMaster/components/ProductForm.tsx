import { Loader2 } from "lucide-react";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import type { Product, ProductFormData } from "../types/product.types";

interface Props {
  product?: Product | null;

  loading?: boolean;

  onSubmit: (data: ProductFormData) => Promise<void>;

  onCancel: () => void;
}

export default function ProductForm({
  product,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      product_id: undefined,

      product_name: "",

      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        product_id: product.product_id,

        product_name: product.product_name,

        status: product.status,
      });

      return;
    }

    reset({
      product_id: undefined,

      product_name: "",

      status: "ACTIVE",
    });
  }, [product, reset]);

  const submitForm = async (data: ProductFormData) => {
    const payload: ProductFormData = {
      product_name: data.product_name.trim(),

      status: data.status,
    };

    if (
      data.product_id !== undefined &&
      !Number.isNaN(Number(data.product_id))
    ) {
      payload.product_id = Number(data.product_id);
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      <div>
        <label className={labelClass}>
          Product ID
          {/* <span className="ml-1 text-red-500">*</span> */}
        </label>

        <input
          type="number"
          placeholder="Enter product ID"
          {...register("product_id", {
            // required: "Product ID is required",

            valueAsNumber: true,

            // min: {
            //   value: 1,

            //   message: "Product ID must be greater than 0",
            // },
          })}
          className={inputClass}
        />

        {errors.product_id && (
          <ErrorText>{errors.product_id.message}</ErrorText>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Product Name
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="Example: Refrigerator"
          {...register("product_name", {
            required: "Product name is required",

            minLength: {
              value: 2,

              message: "Product name must contain at least 2 characters",
            },
          })}
          className={inputClass}
        />

        {errors.product_name && (
          <ErrorText>{errors.product_name.message}</ErrorText>
        )}
      </div>

      <div>
        <label className={labelClass}>Status</label>

        <select {...register("status")} className={inputClass}>
          <option value="ACTIVE">Active</option>

          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {loading && <Loader2 size={17} className="animate-spin" />}

          {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

function ErrorText({ children }: { children?: React.ReactNode }) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
