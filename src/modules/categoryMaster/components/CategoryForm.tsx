// import { useEffect } from "react";

// import { useForm } from "react-hook-form";

// import type { Category, CategoryFormData } from "../types/category.types";

// interface Props {
//   category?: Category | null;

//   loading?: boolean;

//   onSubmit: (data: CategoryFormData) => void;

//   onCancel: () => void;
// }

// export default function CategoryForm({
//   category,
//   loading,
//   onSubmit,
//   onCancel,
// }: Props) {
//   const {
//     register,
//     handleSubmit,
//     reset,

//     formState: { errors },
//   } = useForm<CategoryFormData>({
//     defaultValues: {
//       groupCategoryCode: "",

//       description: "",

//       category: "",

//       categoryDescription: "",

//       //   category3: "",

//       //   category4: "",

//       status: "ACTIVE",
//     },
//   });

//   useEffect(() => {
//     if (!category) {
//       return;
//     }

//     reset({
//       groupCategoryCode: category.groupCategoryCode,

//       description: category.description,

//       category: category.category ?? "",

//       categoryDescription: category.categoryDescription,

//       //   category3: category.category3 ?? "",

//       //   category4: category.category4 ?? "",

//       status: category.status,
//     });
//   }, [category, reset]);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div className="rounded-xl border border-gray-200 bg-white">
//         <div className="border-b border-gray-200 px-5 py-4">
//           <h2 className="font-semibold text-gray-900">Define Group Category</h2>
//         </div>

//         <div className="grid gap-5 p-5 md:grid-cols-2">
//           <Input
//             label="Group Category Code"
//             error={errors.groupCategoryCode?.message}
//             {...register("groupCategoryCode", {
//               required: "Group category code is required",
//             })}
//           />

//           <Input
//             label="Description"
//             // error={errors.categoryDescription?.message}
//             {...register("description", {
//               //   required: "Category description is required",
//             })}
//           />

//           <Input label="Category 2" {...register("category")} />

//           <Input
//             label="Category Description"
//             {...register("categoryDescription")}
//           />

//           {/* <Input label="Category 3" {...register("category3")} />

//           <Input label="Category 4" {...register("category4")} /> */}

//           <div>
//             <label className={labelClass}>Status</label>

//             <select {...register("status")} className={inputClass}>
//               <option value="ACTIVE">Active</option>

//               <option value="INACTIVE">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-3">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="rounded-lg border px-5 py-2.5 text-sm"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           disabled={loading}
//           className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white"
//         >
//           {loading
//             ? "Saving..."
//             : category
//               ? "Update Category"
//               : "Create Category"}
//         </button>
//       </div>
//     </form>
//   );
// }

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;

//   error?: string;
// }

// function Input({ label, error, ...props }: InputProps) {
//   return (
//     <div>
//       <label className={labelClass}>{label}</label>

//       <input {...props} className={inputClass} />

//       {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//     </div>
//   );
// }

// const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

// const inputClass =
//   "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { getProducts } from "../../productMaster/services/productApi";

import type { Product } from "../../productMaster/types/product.types";

import type { Category, CategoryFormData } from "../types/category.types";

interface Props {
  category?: Category | null;

  loading?: boolean;

  onSubmit: (data: CategoryFormData) => void;

  onCancel: () => void;
}

export default function CategoryForm({
  category,
  loading,
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
  } = useForm<CategoryFormData>({
    defaultValues: {
      groupCategoryCode: "",

      description: "",

      category: "",

      categoryDescription: "",

      product_id: 0,

      status: "ACTIVE",
    },
  });

  /* ======================================
     LOAD PRODUCTS
  ====================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductLoading(true);

        const response = await getProducts({
          page: 1,
          limit: 500,
          status: "ACTIVE",
        });

        setProducts(response.data ?? []);
      } catch (error) {
        console.error("Failed to load products", error);

        setProducts([]);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ======================================
     SET EDIT VALUES
  ====================================== */

  useEffect(() => {
    if (!category) {
      reset({
        groupCategoryCode: "",

        description: "",

        category: "",

        categoryDescription: "",

        product_id: 0,

        status: "ACTIVE",
      });

      return;
    }

    reset({
      groupCategoryCode: category.groupCategoryCode,

      description: category.description,

      category: category.category ?? "",

      categoryDescription: category.categoryDescription,

      product_id: Number(category.product_id),

      status: category.status,
    });
  }, [category, reset]);

  const submitForm = (data: CategoryFormData) => {
    onSubmit({
      ...data,

      product_id: Number(data.product_id),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Define Group Category</h2>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
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
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
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
              <p className="mt-1 text-xs text-red-600">
                {errors.product_id.message}
              </p>
            )}
          </div>

          {/* GROUP CATEGORY CODE */}

          {/* <Input
            label="Group Category Code"
            error={errors.groupCategoryCode?.message}
            {...register("groupCategoryCode", {
              required: "Group category code is required",
            })}
          /> */}

          {/* DESCRIPTION */}

          <Input label="Description" {...register("description")} />

          {/* CATEGORY */}

          <Input label="Category 2" {...register("category")} />

          {/* CATEGORY DESCRIPTION */}

          <Input
            label="Category Description"
            {...register("categoryDescription")}
          />

          {/* STATUS */}

          <div>
            <label className={labelClass}>Status</label>

            <select {...register("status")} className={inputClass}>
              <option value="ACTIVE">Active</option>

              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border px-5 py-2.5 text-sm disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || productLoading}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : category
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;

  error?: string;
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <input {...props} className={inputClass} />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-500";
