import {
  Download,
  FileSpreadsheet,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import axios from "axios";

import BrandForm from "../components/BrandForm";

import BrandTable from "../components/BrandTable";
import { toast } from "react-toastify";

import {
  createBrand,
  deleteBrand,
  downloadBrandSample,
  exportBrands,
  getBrands,
  importBrands,
  updateBrand,
} from "../services/brandApi";

import type { Brand, BrandFormData } from "../types/brand.types";

export default function BrandMasterPage() {
  const [brands, setBrands] = useState<Brand[]>([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [importLoading, setImportLoading] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ==========================================
  // FETCH BRANDS
  // ==========================================

  const fetchBrands = async () => {
    try {
      setLoading(true);

      const data = await getBrands();

      setBrands(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load brands"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return brands;
    }

    return brands.filter((brand) =>
      brand.brandName.toLowerCase().includes(query),
    );
  }, [brands, search]);

  // ==========================================
  // CREATE
  // ==========================================

  const handleCreate = () => {
    setSelectedBrand(null);

    setError(null);

    setSuccessMessage(null);

    setFormOpen(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);

    setError(null);

    setSuccessMessage(null);

    setFormOpen(true);
  };

  // ==========================================
  // CREATE / UPDATE SUBMIT
  // ==========================================

  const handleSubmit = async (data: BrandFormData) => {
    try {
      setActionLoading(true);

      if (selectedBrand) {
        const updated = await updateBrand(selectedBrand.id, data);

        setBrands((currentBrands) =>
          currentBrands.map((brand) =>
            brand.id === updated.id ? updated : brand,
          ),
        );

        toast.success("Brand updated successfully");
      } else {
        const created = await createBrand(data);

        setBrands((currentBrands) => [created, ...currentBrands]);

        toast.success("Brand created successfully");
      }

      setFormOpen(false);
      setSelectedBrand(null);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          selectedBrand ? "Failed to update brand" : "Failed to create brand",
        ),
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (brand: Brand) => {
    const confirmed = window.confirm(`Delete "${brand.brandName}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteBrand(brand.id);

      setBrands((currentBrands) =>
        currentBrands.filter((item) => item.id !== brand.id),
      );

      toast.success("Brand deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete brand"));
    }
  };

  // ==========================================
  // IMPORT
  // ==========================================

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setImportLoading(true);

      const result = await importBrands(file);

      if (result.summary.failed > 0) {
        toast.warning(
          `${result.summary.imported} brands imported, ${result.summary.failed} failed`,
        );
      } else {
        toast.success(
          `${result.summary.imported} brands imported successfully`,
        );
      }

      await fetchBrands();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to import brands"));
    } finally {
      setImportLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleExport = async () => {
    try {
      setExportLoading(true);

      await exportBrands();

      toast.success("Brands exported successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to export brands"));
    } finally {
      setExportLoading(false);
    }
  };

  // ==========================================
  // SAMPLE EXCEL
  // ==========================================

  const handleDownloadSample = async () => {
    try {
      await downloadBrandSample();

      toast.success("Sample Excel downloaded successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to download sample file"));
    }
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCloseForm = () => {
    setFormOpen(false);

    setSelectedBrand(null);
  };

  return (
    <div>
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Master</h1>

          <p className="mt-1 text-sm text-gray-500">Manage product brands.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* IMPORT */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleImportClick}
            disabled={importLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={17} />

            {importLoading ? "Importing..." : "Import Excel"}
          </button>

          {/* EXPORT */}

          <button
            type="button"
            onClick={handleExport}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] px-4 py-2.5 text-sm font-medium text-[#123B7A] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={17} />

            {exportLoading ? "Exporting..." : "Export Excel"}
          </button>

          {/* SAMPLE */}

          <button
            type="button"
            onClick={handleDownloadSample}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download size={17} />
            Sample Excel
          </button>

          {/* ADD */}

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
          >
            <Plus size={17} />
            Add Brand
          </button>
        </div>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          SUCCESS
      ====================================== */}

      {successMessage && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* =====================================
          FORM
      ====================================== */}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedBrand ? "Edit Brand" : "Add Brand"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedBrand
                    ? "Update brand information."
                    : "Create a new product brand."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setSelectedBrand(null);
                }}
                disabled={actionLoading}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <BrandForm
                brand={selectedBrand}
                loading={actionLoading}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setFormOpen(false);
                  setSelectedBrand(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* =====================================
          TABLE
      ====================================== */}

      <BrandTable
        brands={filteredBrands}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

// ==========================================
// ERROR HELPER
// ==========================================

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
