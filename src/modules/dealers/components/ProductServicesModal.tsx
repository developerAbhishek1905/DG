import { Check, Search, X } from "lucide-react";

import { useEffect, useState } from "react";

import {
  searchProductCategories,
  type CategoryDropdownOption,
} from "../services/dealerApi";

import type { DealerProductCategory } from "../types/dealer.types";

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

  const getCategoryName = (category: CategoryDropdownOption) => {
    return (
      category.categoryDescription ||
      category.category ||
      category.groupCategoryCode ||
      "Unnamed Service"
    );
  };

  const isSelected = (categoryId: string) =>
    selected.some((item) => item.categoryId === categoryId);

  const toggleCategory = (category: CategoryDropdownOption) => {
    const categoryId = category.id;

    const categoryName = getCategoryName(category);

    if (isSelected(categoryId)) {
      setSelected((prev) =>
        prev.filter((item) => item.categoryId !== categoryId),
      );

      return;
    }

    setSelected((prev) => [
      ...prev,
      {
        categoryId,
        categoryName,
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
                const checked = isSelected(category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                      checked
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {getCategoryName(category)}
                      </p>

                      {category.groupCategoryCode && (
                        <p className="mt-1 text-xs text-gray-500">
                          {category.groupCategoryCode}
                        </p>
                      )}
                    </div>

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
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}

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
              onClick={() => onSave(selected)}
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
