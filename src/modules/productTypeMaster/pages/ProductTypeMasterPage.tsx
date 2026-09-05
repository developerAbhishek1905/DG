// import { PackageOpen, Plus, Search, X } from "lucide-react";

// import { useCallback, useEffect, useState } from "react";

// import { toast } from "react-toastify";

// import { useDebounce } from "../../../hooks/useDebounce";

// import ProductTypeExcelActions from "../components/ProductTypeExcelActions";
// import ProductTypeForm from "../components/ProductTypeForm";
// import ProductTypeTable from "../components/ProductTypeTable";

// import {
//   createProductType,
//   deleteProductType,
//   downloadProductTypeSample,
//   exportProductTypes,
//   getProductTypes,
//   importProductTypes,
//   updateProductType,
// } from "../services/productTypeApi";

// import type {
//   ProductType,
//   ProductTypeFormData,
// } from "../types/productType.types";

// export default function ProductTypeMasterPage() {
//   const [productTypes, setProductTypes] = useState<ProductType[]>([]);

//   const [loading, setLoading] = useState(false);

//   const [actionLoading, setActionLoading] = useState(false);

//   const [search, setSearch] = useState("");

//   const [formOpen, setFormOpen] = useState(false);

//   const [selectedProductType, setSelectedProductType] =
//     useState<ProductType | null>(null);

//   const debouncedSearch = useDebounce(search, 500);

//   /* FETCH */

//   const fetchProductTypes = useCallback(async () => {
//     try {
//       setLoading(true);

//       const response = await getProductTypes({
//         search: debouncedSearch,
//       });

//       setProductTypes(response.data ?? []);
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Failed to fetch product types",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [debouncedSearch]);

//   useEffect(() => {
//     fetchProductTypes();
//   }, [fetchProductTypes]);

//   const closeForm = () => {
//     setFormOpen(false);

//     setSelectedProductType(null);
//   };

//   /* CREATE / UPDATE */

//   const handleSubmit = async (data: ProductTypeFormData) => {
//     try {
//       setActionLoading(true);

//       if (selectedProductType) {
//         await updateProductType(selectedProductType._id, data);

//         toast.success("Product type updated successfully");
//       } else {
//         await createProductType(data);

//         toast.success("Product type created successfully");
//       }

//       closeForm();

//       await fetchProductTypes();
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Failed to save product type",
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   /* DELETE */

//   const handleDelete = async (item: ProductType) => {
//     const confirmed = window.confirm(`Delete "${item.product_type}"?`);

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setActionLoading(true);

//       const response = await deleteProductType(item._id);

//       toast.success(response.message || "Product type deleted successfully");

//       await fetchProductTypes();
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Failed to delete product type",
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   /* IMPORT */

//   const handleImport = async (file: File) => {
//     try {
//       setActionLoading(true);

//       const response = await importProductTypes(file);

//       toast.success(response.message || "Product types imported successfully");

//       await fetchProductTypes();
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Failed to import product types",
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   /* EXPORT */

//   const handleExport = async () => {
//     try {
//       setActionLoading(true);

//       await exportProductTypes();

//       toast.success("Product types exported successfully");
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Failed to export product types",
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   /* SAMPLE */

//   const handleSample = async () => {
//     try {
//       setActionLoading(true);

//       await downloadProductTypeSample();

//       toast.success("Sample downloaded successfully");
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to download sample");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* HEADER */}

//       <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <PackageOpen size={23} className="text-[#123B7A]" />

//             <h1 className="text-2xl font-bold text-gray-900">
//               Product Type Master
//             </h1>
//           </div>

//           <p className="mt-1 text-sm text-gray-500">
//             Manage product types mapped with products.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <ProductTypeExcelActions
//             loading={actionLoading}
//             onImport={handleImport}
//             onExport={handleExport}
//             onSample={handleSample}
//           />

//           <button
//             type="button"
//             onClick={() => {
//               setSelectedProductType(null);

//               setFormOpen(true);
//             }}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
//           >
//             <Plus size={17} />
//             Add Product Type
//           </button>
//         </div>
//       </div>

//       {/* SEARCH */}

//       <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
//         <div className="relative max-w-xl">
//           <Search
//             size={17}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             placeholder="Search product type..."
//             className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//           />
//         </div>
//       </div>

//       <ProductTypeTable
//         productTypes={productTypes}
//         loading={loading}
//         onEdit={(item) => {
//           setSelectedProductType(item);

//           setFormOpen(true);
//         }}
//         onDelete={handleDelete}
//       />

//       {/* POPUP */}

//       {formOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               closeForm();
//             }
//           }}
//         >
//           <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b px-5 py-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   {selectedProductType
//                     ? "Edit Product Type"
//                     : "Add Product Type"}
//                 </h2>

//                 <p className="mt-1 text-xs text-gray-500">
//                   Map product types with the appropriate product.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-5">
//               <ProductTypeForm
//                 productType={selectedProductType}
//                 loading={actionLoading}
//                 onSubmit={handleSubmit}
//                 onCancel={closeForm}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { PackageOpen, Plus, Search, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useDebounce } from "../../../hooks/useDebounce";

import ProductTypeExcelActions from "../components/ProductTypeExcelActions";
import ProductTypeForm from "../components/ProductTypeForm";
import ProductTypeTable from "../components/ProductTypeTable";

import {
  createProductType,
  deleteProductType,
  downloadProductTypeSample,
  exportProductTypes,
  getProductTypes,
  importProductTypes,
  updateProductType,
} from "../services/productTypeApi";

import type {
  ProductType,
  ProductTypeFormData,
} from "../types/productType.types";

export default function ProductTypeMasterPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [formOpen, setFormOpen] = useState(false);

  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  /* =====================================
     FETCH PRODUCT TYPES
  ===================================== */

  const fetchProductTypes = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getProductTypes({
        search: debouncedSearch,
        page,
        limit,
      });

      setProductTypes(response.data ?? []);

      setTotal(response.pagination?.total ?? response.data?.length ?? 0);

      setTotalPages(response.pagination?.totalPages ?? 1);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch product types",
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, limit]);

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);

  /* =====================================
     CLOSE FORM
  ===================================== */

  const closeForm = () => {
    setFormOpen(false);

    setSelectedProductType(null);
  };

  /* =====================================
     CREATE / UPDATE
  ===================================== */

  const handleSubmit = async (data: ProductTypeFormData) => {
    try {
      setActionLoading(true);

      if (selectedProductType) {
        await updateProductType(selectedProductType._id, data);

        toast.success("Product type updated successfully");
      } else {
        await createProductType(data);

        toast.success("Product type created successfully");
      }

      closeForm();

      await fetchProductTypes();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save product type",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================
     DELETE
  ===================================== */

  const handleDelete = async (item: ProductType) => {
    const confirmed = window.confirm(`Delete "${item.product_type}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await deleteProductType(item._id);

      toast.success(response.message || "Product type deleted successfully");

      if (productTypes.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchProductTypes();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete product type",
      );
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

      const response = await importProductTypes(file);

      toast.success(response.message || "Product types imported successfully");

      setPage(1);

      await fetchProductTypes();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to import product types",
      );
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

      await exportProductTypes();

      toast.success("Product types exported successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to export product types",
      );
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

      await downloadProductTypeSample();

      toast.success("Sample downloaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to download sample");
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
            <PackageOpen size={23} className="text-[#123B7A]" />

            <h1 className="text-2xl font-bold text-gray-900">
              Product Type Master
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage product types mapped with products.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ProductTypeExcelActions
            loading={actionLoading}
            onImport={handleImport}
            onExport={handleExport}
            onSample={handleSample}
          />

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => {
              setSelectedProductType(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
          >
            <Plus size={17} />
            Add Product Type
          </button>
        </div>
      </div>

      {/* SEARCH */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative max-w-xl">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);

              setPage(1);
            }}
            placeholder="Search product type..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Total <span className="font-semibold text-gray-800">{total}</span>{" "}
          product types
        </div>
      </div>

      {/* TABLE */}

      <ProductTypeTable
        productTypes={productTypes}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);

          setPage(1);
        }}
        onEdit={(item) => {
          setSelectedProductType(item);

          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* POPUP */}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedProductType
                    ? "Edit Product Type"
                    : "Add Product Type"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Map product types with the appropriate product.
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
              <ProductTypeForm
                productType={selectedProductType}
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
