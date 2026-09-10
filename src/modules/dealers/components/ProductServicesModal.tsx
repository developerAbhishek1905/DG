import { Check, Search, X } from "lucide-react";

import { useEffect, useState } from "react";

import {
  searchProductCategories,
  type CategoryDropdownOption,
} from "../services/dealerApi";

import type { DealerProductCategory } from "../types/dealer.types";

import { toast } from "react-toastify";

interface Props {
  productIndex: number;

  productId?: number;

  productName?: string;

  selectedCategories: DealerProductCategory[];

  onClose: () => void;

  onSave: (categories: DealerProductCategory[]) => void;
}

export default function ProductServicesModal({
  productId,
  productName,
  selectedCategories,
  onClose,
  onSave,
}: Props) {
  const [categories, setCategories] = useState<CategoryDropdownOption[]>([]);

  const [selected, setSelected] =
    useState<DealerProductCategory[]>(selectedCategories);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      loadCategories("");
    }
  }, [productId]);

  const loadCategories = async (searchValue: string) => {
    if (!productId) return;

    try {
      setLoading(true);

      const data = await searchProductCategories({
        productId,
        search: searchValue,
      });

      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  console.log(categories);

  const getCategoryName = (category: CategoryDropdownOption) => {
    return (
      category.categoryDescription ||
      category.category ||
      category.groupCategoryCode ||
      "Unnamed Service"
    );
  };

  const isSelected = (categoryId: string | number) =>
    selected.some((item) => String(item.categoryId) === String(categoryId));

  //   const toggleCategory = (category: CategoryDropdownOption) => {
  //     const categoryId = category.id;

  //     const categoryName = getCategoryName(category);

  //     if (isSelected(categoryId)) {
  //       setSelected((prev) =>
  //         prev.filter((item) => item.categoryId !== categoryId),
  //       );

  //       return;
  //     }

  //     setSelected((prev) => [
  //       ...prev,
  //       {
  //         categoryId,
  //         categoryName,
  //       },
  //     ]);
  //   };

  const updateServiceRate = (categoryId: string | number, rate: number) => {
    setSelected((prev) =>
      prev.map((item) =>
        String(item.categoryId) === String(categoryId)
          ? {
              ...item,
              rate,
            }
          : item,
      ),
    );
  };

  const toggleCategory = (category: CategoryDropdownOption) => {
    const categoryId =
      // category.id ??
      category._id;
    // category.category_id;

    // console.log(category.id , category._id , category.category_id)

    const categoryName = getCategoryName(category);

    console.log("CATEGORY:", category);
    console.log("CATEGORY ID:", categoryId);

    if (!categoryId) {
      console.error("Category id not found:", category);
      return;
    }

    if (isSelected(String(categoryId))) {
      setSelected((prev) =>
        prev.filter((item) => item.categoryId !== String(categoryId)),
      );

      return;
    }

    setSelected((prev) => [
      ...prev,
      {
        categoryId: String(categoryId),
        categoryName,
        description: category.description || "",
        rate: 0,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Select Services
            </h3>

            <p className="mt-1 text-sm text-gray-500">{productName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* SEARCH */}

        <div className="border-b border-gray-200 p-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              placeholder="Search services..."
              onChange={(event) => {
                const value = event.target.value;

                setSearch(value);

                loadCategories(value);
              }}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* LIST */}

        <div className="max-h-[420px] overflow-y-auto p-4">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading services...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No services found
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => {
                const categoryId = category._id;

                if (!categoryId) return null;

                const checked = isSelected(categoryId);

                const selectedService = selected.find(
                  (item) => String(item.categoryId) === String(categoryId),
                );

                return (
                  <div
                    key={String(categoryId)}
                    className={`rounded-lg border px-4 py-3 transition ${
                      checked
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="flex flex-1 items-center justify-between text-left"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {getCategoryName(category)}
                          </p>

                          {/* {category.groupCategoryCode && (
                            <p className="mt-1 text-xs text-gray-500">
                              {category.groupCategoryCode}
                            </p>
                          )} */}
                           {category.description && (
    <p className="mt-1 text-xs text-gray-500">
      {category.description}
    </p>
  )}
                        </div>

                        {checked && (
                          <div className=" border-t border-blue-100 ">
                            <div className="relative max-w-[220px]">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                ₹
                              </span>

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={selectedService?.rate ?? ""}
                                placeholder="Enter rate"
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => {
                                  updateServiceRate(
                                    categoryId,
                                    Number(event.target.value),
                                  );
                                }}
                                className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            checked
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {checked && <Check size={14} />}
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
          <span className="text-sm text-gray-500">
            {selected.length} selected
          </span>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              //   onClick={() => onSave(selected)}
              onClick={() => {
                const invalidService = selected.find(
                  (service) => !service.rate || service.rate <= 0,
                );

                if (invalidService) {
                  toast.error(
                    `Please enter rate for ${invalidService.categoryName}`,
                  );

                  return;
                }

                onSave(selected);
              }}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
