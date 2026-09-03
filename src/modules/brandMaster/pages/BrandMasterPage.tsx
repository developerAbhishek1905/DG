import {
  Plus,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import BrandForm from "../components/BrandForm";
import BrandTable from "../components/BrandTable";

import {
  createBrandAction,
  deleteBrandAction,
  fetchBrands,
  updateBrandAction,
} from "../store/brandSlice";

import type {
  Brand,
  BrandFormData,
} from "../types/brand.types";
import { useAppDispatch,useAppSelector } from "../../../app/hooks";

export default function BrandMasterPage() {
  const dispatch =
    useAppDispatch();

  const {
    brands,
    loading,
    actionLoading,
    error,
  } =
    useAppSelector(
      (state) =>
        state.brand
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    selectedBrand,
    setSelectedBrand,
  ] =
    useState<Brand | null>(
      null
    );

  useEffect(() => {
    dispatch(
      fetchBrands()
    );
  }, [dispatch]);

  const filteredBrands =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return brands;
      }

      return brands.filter(
        (brand) =>
          brand.brandName
            .toLowerCase()
            .includes(query)
      );
    }, [
      brands,
      search,
    ]);

  const handleCreate = () => {
    setSelectedBrand(null);
    setFormOpen(true);
  };

  const handleEdit = (
    brand: Brand
  ) => {
    setSelectedBrand(brand);
    setFormOpen(true);
  };

  const handleSubmit =
    async (
      data: BrandFormData
    ) => {
      try {
        if (selectedBrand) {
          await dispatch(
            updateBrandAction({
              id:
                selectedBrand.id,

              data,
            })
          ).unwrap();
        } else {
          await dispatch(
            createBrandAction(
              data
            )
          ).unwrap();
        }

        setSelectedBrand(null);
        setFormOpen(false);
      } catch {
        // error is available
        // through Redux state
      }
    };

  const handleDelete =
    async (
      brand: Brand
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${brand.brandName}"?`
        );

      if (!confirmed) {
        return;
      }

      await dispatch(
        deleteBrandAction(
          brand.id
        )
      );
    };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Brand Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage product brands.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleCreate
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
        >
          <Plus
            size={17}
          />

          Add Brand
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {formOpen && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              {selectedBrand
                ? "Edit Brand"
                : "Add Brand"}
            </h2>

            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setSelectedBrand(
                  null
                );
              }}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            >
              <X
                size={18}
              />
            </button>
          </div>

          <div className="max-w-xl p-5">
            <BrandForm
              brand={
                selectedBrand
              }
              loading={
                actionLoading
              }
              onSubmit={
                handleSubmit
              }
              onCancel={() => {
                setFormOpen(
                  false
                );

                setSelectedBrand(
                  null
                );
              }}
            />
          </div>
        </div>
      )}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search brand..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <BrandTable
        brands={
          filteredBrands
        }
        loading={
          loading
        }
        onEdit={
          handleEdit
        }
        onDelete={
          handleDelete
        }
      />
    </div>
  );
}