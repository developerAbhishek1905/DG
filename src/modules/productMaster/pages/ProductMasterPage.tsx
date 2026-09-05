import { PackageSearch, Plus, Search, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useDebounce } from "../../../hooks/useDebounce";

import ProductExcelActions from "../components/ProductExcelActions";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

import {
  createProduct,
  deleteProduct,
  downloadProductSample,
  exportProducts,
  getProducts,
  importProducts,
  updateProduct,
} from "../services/productApi";

import type {
  Product,
  ProductFormData,
  ProductStatus,
} from "../types/product.types";

export default function ProductMasterPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [formOpen, setFormOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  /* =====================================
     FETCH PRODUCTS
  ===================================== */

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getProducts({
        page,
        limit,

        search: debouncedSearch,

        status: statusFilter || undefined,
      });

      setProducts(response.data ?? []);

      /*
          Pagination backend se aaye to use karo.
          Agar current GET /products pagination
          return nahi karta, fallback local length hai.
        */

      setTotal(response.pagination?.total ?? response.data?.length ?? 0);

      setTotalPages(response.pagination?.totalPages ?? 1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const closeForm = () => {
    setFormOpen(false);

    setSelectedProduct(null);
  };

  /* =====================================
     CREATE / UPDATE
  ===================================== */

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setActionLoading(true);

      if (selectedProduct) {
        await updateProduct(selectedProduct.product_id, {
          product_name: data.product_name,

          status: data.status,
        });

        toast.success("Product updated successfully");
      } else {
        await createProduct(data);

        toast.success("Product created successfully");
      }

      closeForm();

      await fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================
     DELETE
  ===================================== */

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`Delete "${product.product_name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await deleteProduct(product.product_id);

      toast.success(response.message || "Product deleted successfully");

      await fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================
     IMPORT
  ===================================== */

  const handleImport = async (file: File) => {
    try {
      setActionLoading(true);

      const response = await importProducts(file);

      toast.success(response.message || "Products imported successfully");

      setPage(1);

      await fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to import products");
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================
     EXPORT
  ===================================== */

  const handleExport = async () => {
    try {
      setActionLoading(true);

      await exportProducts();

      toast.success("Products exported successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to export products");
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================
     SAMPLE
  ===================================== */

  const handleSample = async () => {
    try {
      setActionLoading(true);

      await downloadProductSample();

      toast.success("Sample file downloaded successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to download sample file",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PackageSearch size={23} className="text-[#123B7A]" />

            <h1 className="text-2xl font-bold text-gray-900">Product Master</h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage products used across service and complaint modules.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ProductExcelActions
            loading={actionLoading}
            onImport={handleImport}
            onExport={handleExport}
            onSample={handleSample}
          />

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => {
              setSelectedProduct(null);

              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
          >
            <Plus size={17} />
            Add Product
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setPage(1);
              }}
              placeholder="Search product..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ProductStatus | "");

              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Status</option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <ProductTable
        products={products}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);

          setPage(1);
        }}
        onEdit={(product) => {
          setSelectedProduct(product);

          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* FORM POPUP */}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedProduct ? "Edit Product" : "Add Product"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {selectedProduct
                    ? "Update product information."
                    : "Create a new product."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <ProductForm
                product={selectedProduct}
                loading={actionLoading}
                onSubmit={handleSubmit}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
