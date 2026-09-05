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
    console.error(
      "Failed to load products:",
      error,
    );

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
      <div className="space-y-4">
{fields.map((field, index) => {
  const item = productServices[index];

  const selectedCategories = item?.categories ?? [];

  return (
    <div
      key={field.id}
      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
    >
      {/* HIDDEN FIELDS FOR REACT-HOOK-FORM VALIDATION */}

      <input
        type="hidden"
        {...register(`productServices.${index}.productId`, {
          required: "Product is required",
        })}
      />

      <input
        type="hidden"
        {...register(`productServices.${index}.categories`, {
          validate: (categories) =>
            categories?.length > 0 ||
            "Please select at least one service",
        })}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
        <div>
          <SearchSelect
            label="Product"
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
              const product =
                option.data as ProductDropdownOption;

              /*
               * Prevent duplicate product
               */

              const alreadySelected =
                productServices.some(
                  (selectedProduct, currentIndex) =>
                    currentIndex !== index &&
                    selectedProduct.productId ===
                      product.product_id,
                );

              if (alreadySelected) {
                toast.error(
                  "This product is already selected.",
                );

                return;
              }

              /*
               * Set selected product
               */

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

              /*
               * Product changed
               * Remove old selected services
               */

              setValue(
                `productServices.${index}.categories`,
                [],
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              );
            }}
            onClear={() => {
              setValue(
                `productServices.${index}.productId`,
                undefined,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              );

              setValue(
                `productServices.${index}.productName`,
                "",
              );

              setValue(
                `productServices.${index}.categories`,
                [],
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              );
            }}
            error={
              errors.productServices?.[index]
                ?.productId?.message as string
            }
          />
        </div>

        {/* GET SERVICES */}

        <div className="flex items-end">
          <button
            type="button"
            disabled={!item?.productId}
            onClick={() =>
              setServicesModalProductIndex(index)
            }
            className="h-[42px] rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Get Services
          </button>
        </div>

        {/* REMOVE PRODUCT */}

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              if (fields.length > 1) {
                remove(index);
              }
            }}
            disabled={fields.length === 1}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            title="Remove product"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* SELECTED SERVICES */}

      {selectedCategories.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-gray-600">
            Selected Services
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(
              (category, categoryIndex) => (
                <div
                  key={category.categoryId}
                  className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                >
                  <span>
                    {category.categoryName}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const updated =
                        selectedCategories.filter(
                          (_, i) =>
                            i !== categoryIndex,
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
                    className="text-blue-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* SERVICE VALIDATION ERROR */}

      {errors.productServices?.[index]
        ?.categories && (
        <p className="mt-2 text-xs text-red-600">
          {
            errors.productServices[index]
              ?.categories?.message as string
          }
        </p>
      )}
    </div>
  );
})}

        {/* ADD PRODUCT */}

        <button
          type="button"
          onClick={() =>
            append({
              productId: undefined,
              productName: "",
              categories: [],
            })
          }
          className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          <Plus size={17} />
          Add Product
        </button>
      </div>

      {/* SERVICES MODAL */}

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
            setValue(
              `productServices.${servicesModalProductIndex}.categories`,
              categories,
              {
                shouldValidate: true,
              },
            );

            setServicesModalProductIndex(null);
          }}
        />
      )}
    </>
  );
}
