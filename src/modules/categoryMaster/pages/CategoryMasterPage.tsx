// import { Plus, Search } from "lucide-react";

// import { useEffect, useMemo } from "react";

// import { useNavigate } from "react-router-dom";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// import CategoryTable from "../components/CategoryTable";

// import {
//   fetchCategories,
//   setCategoryFilters,
//   // toggleCategoryStatusAction,
//     toggleCategoryStatusAction,
//   deleteCategoryAction,
// } from "../store/categorySlice";

// import type { Category } from "../types/category.types";

// export default function CategoryMasterPage() {
//   const dispatch = useAppDispatch();

//   const navigate = useNavigate();

//   const { categories, loading, filters } = useAppSelector(
//     (state) => state.category,
//   );

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const filtered = useMemo(() => {
//     const search = filters.search.toLowerCase().trim();

//     return categories.filter((item) => {
//       const matchSearch =
//                !search ||
//         item.groupCategoryCode.toLowerCase().includes(search) ||
//         item.description?.toLowerCase().includes(search) ||
//         item.category?.toLowerCase().includes(search) ||
//         item.categoryDescription?.toLowerCase().includes(search);

//       const matchStatus = !filters.status || item.status === filters.status;

//       return matchSearch && matchStatus;
//     });
//   }, [categories, filters]);

//   // ==============================
//   // EDIT
//   // ==============================

//   const handleEdit = (category: Category) => {
//     navigate(`/category-master/${category.id}/edit`);
//   };

//   // ==============================
//   // TOGGLE STATUS
//   // ==============================

//   const handleToggleStatus = async (category: Category) => {
//     await dispatch(
//       toggleCategoryStatusAction({
//         id: category.id,
//         currentStatus: category.status,
//       }),
//     );
//   };

//   // ==============================
//   // DELETE
//   // ==============================

//   const handleDelete = async (category: Category) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${category.groupCategoryCode}"?`,
//     );

//     if (!confirmed) return;

//     await dispatch(deleteCategoryAction(category.id));
//   };

//   return (
//     <div>
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Category Master</h1>

//           <p className="mt-1 text-sm text-gray-500">Manage group categories.</p>
//         </div>

//         <button
//           onClick={() => navigate("/category-master/create")}
//           className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm text-white"
//         >
//           <Plus size={17} />
//           Add Category
//         </button>
//       </div>

//       <div className="mb-5 flex gap-3 rounded-xl border bg-white p-4">
//         <div className="relative flex-1">
//           <Search size={16} className="absolute left-3 top-3 text-gray-400" />

//           <input
//             value={filters.search}
//             onChange={(e) =>
//               dispatch(
//                 setCategoryFilters({
//                   search: e.target.value,
//                 }),
//               )
//             }
//             placeholder="Search category..."
//             className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm"
//           />
//         </div>

//         <select
//           value={filters.status}
//           onChange={(e) =>
//             dispatch(
//               setCategoryFilters({
//                 status: e.target.value as "ACTIVE" | "INACTIVE" | "",
//               }),
//             )
//           }
//           className="rounded-lg border px-3"
//         >
//           <option value="">All Status</option>

//           <option value="ACTIVE">Active</option>

//           <option value="INACTIVE">Inactive</option>
//         </select>
//       </div>

//       <CategoryTable
//   categories={categories}
//   loading={loading}
//   onEdit={handleEdit}
//   onToggleStatus={handleToggleStatus}
//   onDelete={handleDelete}
// />

//       {/* <CategoryTable
//         categories={filtered}
//         loading={loading}
//         onEdit={(category) => navigate(`/category-master/${category.id}/edit`)}
//         onToggleStatus={(category) =>
//           dispatch(toggleCategoryStatusAction(category.id))
//         }
//       /> */}
//     </div>
//   );
// }

import { Download, FileSpreadsheet, Upload, Plus, Search } from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import CategoryTable from "../components/CategoryTable";

import { toast } from "react-toastify";

import {
  deleteCategory,
  downloadCategorySample,
  exportCategories,
  getCategories,
  importCategories,
  toggleCategoryStatus,
} from "../services/categoryApi";

import type { Category, CategoryFilters } from "../types/category.types";

export default function CategoryMasterPage() {
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [filters, setFilters] = useState<CategoryFilters>({
    search: "",
    status: "",
  });

  // ============================================
  // FETCH CATEGORIES
  // ============================================

  const fetchCategoryList = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error("Fetch categories error:", error);

      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  // ============================================
  // FILTER
  // ============================================

  const filteredCategories = useMemo(() => {
    const search = filters.search.toLowerCase().trim();

    return categories.filter((item) => {
      const matchSearch =
        !search ||
        item.groupCategoryCode.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.categoryDescription?.toLowerCase().includes(search);

      const matchStatus = !filters.status || item.status === filters.status;

      return matchSearch && matchStatus;
    });
  }, [categories, filters]);

  // ============================================
  // EDIT
  // ============================================

  const handleEdit = (category: Category) => {
    navigate(`/category-master/${category.id}/edit`);
  };

  // ============================================
  // STATUS
  // ============================================

  const handleToggleStatus = async (category: Category) => {
    try {
      setActionLoading(true);

      const updated = await toggleCategoryStatus(category.id, category.status);

      setCategories((prev) =>
        prev.map((item) => (item.id === category.id ? updated : item)),
      );

      toast.success(
        updated.status === "ACTIVE"
          ? "Category activated successfully"
          : "Category deactivated successfully",
      );
    } catch (error) {
      console.error("Status update error:", error);

      toast.error("Failed to update category status");
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // DELETE
  // ============================================

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.groupCategoryCode}"?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await deleteCategory(category.id);

      setCategories((prev) => prev.filter((item) => item.id !== category.id));

      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);

      toast.error("Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // IMPORT
  // ============================================

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setActionLoading(true);

      const result = await importCategories(file);

      await fetchCategoryList();

      if (result.summary.failed > 0) {
        toast.warning(
          `Import completed: ${result.summary.imported} imported, ${result.summary.failed} failed.`,
        );

        console.table(result.failed);
      } else {
        toast.success(
          `${result.summary.imported} categories imported successfully`,
        );
      }
    } catch (error) {
      console.error("Import error:", error);

      toast.error("Failed to import categories");
    } finally {
      setActionLoading(false);

      event.target.value = "";
    }
  };

  // ============================================
  // EXPORT
  // ============================================

  const handleExport = async () => {
    try {
      setActionLoading(true);

      await exportCategories();

      toast.success("Categories exported successfully");
    } catch (error) {
      console.error("Export error:", error);

      toast.error("Failed to export categories");
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // SAMPLE
  // ============================================
  const handleDownloadSample = async () => {
    try {
      setActionLoading(true);

      await downloadCategorySample();

      toast.success("Sample Excel downloaded successfully");
    } catch (error) {
      console.error("Sample download error:", error);

      toast.error("Failed to download sample Excel");
    } finally {
      setActionLoading(false);
    }
  };
  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Category Master</h1>

          <p className="mt-1 text-sm text-gray-500">Manage group categories.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Hidden Import Input */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Import */}

          <button
            type="button"
            onClick={handleImportClick}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={17} />
            Import Excel
          </button>

          {/* Export */}

          <button
            type="button"
            onClick={handleExport}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] px-4 py-2.5 text-sm font-medium text-[#123B7A] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={17} />
            Export Excel
          </button>

          {/* Sample */}

          <button
            type="button"
            onClick={handleDownloadSample}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Download size={17} />
            Sample Excel
          </button>

          {/* Add */}

          <button
            type="button"
            onClick={() => navigate("/category-master/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm text-white"
          >
            <Plus size={17} />
            Add Category
          </button>
        </div>
      </div>

      {/* ================= FILTERS ================= */}

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />

          <input
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            placeholder="Search category..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value as "ACTIVE" | "INACTIVE" | "",
            }))
          }
          className="rounded-lg border border-gray-200 px-3"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}

      <CategoryTable
        categories={filteredCategories}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />
    </div>
  );
}
