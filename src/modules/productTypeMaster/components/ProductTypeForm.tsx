import { Loader2 } from "lucide-react";

import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { getProducts } from "../../productMaster/services/productApi";

import type { Product } from "../../productMaster/types/product.types";

import type {
  ProductType,
  ProductTypeFormData,
} from "../types/productType.types";

interface Props {
  productType?: ProductType | null;

  loading?: boolean;

  onSubmit: (data: ProductTypeFormData) => Promise<void>;

  onCancel: () => void;
}

export default function ProductTypeForm({
  productType,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  const [productLoading, setProductLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<ProductTypeFormData>({
    defaultValues: {
      product_id: 0,

      product_code: "",

      product_type: "",
    },
  });

  /* LOAD PRODUCTS */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductLoading(true);

        const response = await getProducts({
          page: 1,
          limit: 500,
        });

        setProducts(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* EDIT VALUES */

  useEffect(() => {
    if (productType) {
      reset({
        product_id: Number(productType.product_id),

        product_code: productType.product_code,

        product_type: productType.product_type,
      });

      return;
    }

    reset({
      product_id: 0,

      product_code: "",

      product_type: "",
    });
  }, [productType, reset]);

  const submitForm = async (data: ProductTypeFormData) => {
    await onSubmit({
      product_id: Number(data.product_id),

      product_code: data.product_code.trim(),

      product_type: data.product_type.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {/* PRODUCT */}

      <div>
        <label className={labelClass}>
          Product
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Controller
          name="product_id"
          control={control}
          rules={{
            validate: (value) => Number(value) > 0 || "Product is required",
          }}
          render={({ field }) => (
            <select
              value={field.value ?? 0}
              disabled={productLoading}
              onChange={(event) => field.onChange(Number(event.target.value))}
              className={inputClass}
            >
              <option value={0}>
                {productLoading ? "Loading products..." : "Select Product"}
              </option>

              {products.map((product) => (
                <option key={product._id} value={product.product_id}>
                  {product.product_name}
                </option>
              ))}
            </select>
          )}
        />

        {errors.product_id && (
          <ErrorText>{errors.product_id.message}</ErrorText>
        )}
      </div>

      {/* PRODUCT CODE */}

      <div>
        <label className={labelClass}>
          Product Code
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="WM-FL"
          {...register("product_code", {
            required: "Product code is required",
          })}
          className={inputClass}
        />

        {errors.product_code && (
          <ErrorText>{errors.product_code.message}</ErrorText>
        )}
      </div>

      {/* PRODUCT TYPE */}

      <div>
        <label className={labelClass}>
          Product Type
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="Front Load"
          {...register("product_type", {
            required: "Product type is required",
          })}
          className={inputClass}
        />

        {errors.product_type && (
          <ErrorText>{errors.product_type.message}</ErrorText>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
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
          disabled={loading || productLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {loading && <Loader2 size={17} className="animate-spin" />}

          {loading
            ? "Saving..."
            : productType
              ? "Update Product Type"
              : "Add Product Type"}
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
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100";
