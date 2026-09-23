import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import type {
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import SearchSelect from "../../../components/ui/SearchSelect";

import {
  searchProducts,
  type ProductDropdownOption,
} from "../services/dealerApi";
import { toast } from "react-toastify";

import type { DealerFormData } from "../types/dealer.types";

import ProductServicesModal from "./ProductServicesModal";

interface Props {
  fields: {
    id: string;
  }[];
  register: UseFormRegister<DealerFormData>;
  append: UseFieldArrayAppend<DealerFormData, "productServices">;

  remove: UseFieldArrayRemove;

  setValue: UseFormSetValue<DealerFormData>;

  watch: UseFormWatch<DealerFormData>;

  errors: FieldErrors<DealerFormData>;
}

export default function ProductServiceFields({
  fields,
  append,
  remove,
  register,
  setValue,
  watch,
  errors,
}: Props) {
  const [products, setProducts] = useState<ProductDropdownOption[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [servicesModalProductIndex, setServicesModalProductIndex] = useState<
    number | null
  >(null);

  const loadProducts = async (search = "") => {
    try {
      setLoadingProducts(true);

      const data = await searchProducts(search);

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);

      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts("");
  }, []);

  const productServices = watch("productServices") || [];

  return (
    <>
      <div className="space-y-2">
        {fields.map((field, index) => {
          const item = productServices[index];
          const selectedCategories = item?.categories ?? [];

          return (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-gray-50/50 p-2.5"
            >
              {/* Hidden fields */}
              <input
                type="hidden"
                {...register(`productServices.${index}.productId`)}
              />

              <input
                type="hidden"
                {...register(`productServices.${index}.categories`)}
              />

              {/* Product row */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-end gap-2">
                <SearchSelect
                  label={`Product ${index + 1}`}
                  value={item?.productName ?? ""}
                  placeholder="Search product..."
                  loading={loadingProducts}
                  options={products.map((product) => ({
                    value: product.product_id,
                    label: product.product_name,
                    data: product,
                  }))}
                  onSearch={loadProducts}
                  onSelect={(option) => {
                    const product = option.data as ProductDropdownOption;

                    const alreadySelected = productServices.some(
                      (selectedProduct, currentIndex) =>
                        currentIndex !== index &&
                        selectedProduct.productId === product.product_id,
                    );

                    if (alreadySelected) {
                      toast.error("This product is already selected.");
                      return;
                    }

                    setValue(
                      `productServices.${index}.productId`,
                      product.product_id,
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    );

                    setValue(
                      `productServices.${index}.productName`,
                      product.product_name,
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    );

                    setValue(`productServices.${index}.categories`, [], {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  onClear={() => {
                    setValue(`productServices.${index}.productId`, undefined, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    setValue(`productServices.${index}.productName`, "");

                    setValue(`productServices.${index}.categories`, [], {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  error={
                    errors.productServices?.[index]?.productId
                      ?.message as string
                  }
                />

                {/* Services */}
                <button
                  type="button"
                  disabled={!item?.productId}
                  onClick={() => setServicesModalProductIndex(index)}
                  className="h-8 whitespace-nowrap rounded-md bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Services
                </button>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    }
                  }}
                  disabled={fields.length === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Remove product"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Selected Services */}
              {selectedCategories.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-medium text-gray-500">
                    Services:
                  </span>

                  {selectedCategories.map((category, categoryIndex) => (
                    <div
                      key={category.categoryId}
                      className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700"
                    >
                      <span>
                        {category.categoryName}

                        {category.rate > 0 && (
                          <span className="ml-1 font-semibold">
                            ₹{category.rate}
                          </span>
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = selectedCategories.filter(
                            (_, i) => i !== categoryIndex,
                          );

                          setValue(
                            `productServices.${index}.categories`,
                            updated,
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            },
                          );
                        }}
                        className="ml-0.5 text-blue-400 hover:text-red-600"
                        title="Remove service"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Validation */}
              {errors.productServices?.[index]?.categories && (
                <p className="mt-1 text-[10px] text-red-600">
                  {errors.productServices[index]?.categories?.message as string}
                </p>
              )}
            </div>
          );
        })}

        {/* Add Product */}
        <button
          type="button"
          onClick={() =>
            append({
              productId: undefined,
              productName: "",
              categories: [],
            })
          }
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-600 px-3 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {/* Services Modal */}
      {servicesModalProductIndex !== null && (
        <ProductServicesModal
          productIndex={servicesModalProductIndex}
          productId={productServices[servicesModalProductIndex]?.productId}
          productName={productServices[servicesModalProductIndex]?.productName}
          selectedCategories={
            productServices[servicesModalProductIndex]?.categories ?? []
          }
          onClose={() => setServicesModalProductIndex(null)}
          onSave={(categories) => {
            const formattedCategories = categories.map((category: any) => ({
              categoryId: category.categoryId ?? category.id ?? category._id,

              categoryName:
                category.categoryName ??
                category.category ??
                category.category_name,

              description: category.description ?? "",

              rate: Number(category.rate),
            }));

            setValue(
              `productServices.${servicesModalProductIndex}.categories`,
              formattedCategories,
              {
                shouldValidate: true,
                shouldDirty: true,
              },
            );

            setServicesModalProductIndex(null);
          }}
        />
      )}
    </>
  );
}
