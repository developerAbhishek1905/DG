import { Plus, Search, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useDebounce } from "../../../hooks/useDebounce";

import DistrictExcelActions from "../components/DistrictExcelActions";
import DistrictForm from "../components/DistrictForm";
import DistrictTable from "../components/DistrictTable";

import {
  createDistrict,
  deleteDistrict,
  exportDistricts,
  getDistricts,
  importDistricts,
  updateDistrict,
} from "../services/districtApi";

import type { DistrictFormData, DistrictMaster } from "../types/district.types";

export default function DistrictMasterPage() {
  const [districts, setDistricts] = useState<DistrictMaster[]>([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [formOpen, setFormOpen] = useState(false);

  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictMaster | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const fetchDistricts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getDistricts({
        page,

        limit,

        search: debouncedSearch,
      });

      setDistricts(response.data ?? []);

      setTotal(response.pagination?.total ?? 0);

      setTotalPages(response.pagination?.totalPages ?? 1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch districts");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  const closeForm = () => {
    setFormOpen(false);

    setSelectedDistrict(null);
  };

  const handleSubmit = async (data: DistrictFormData) => {
    try {
      setActionLoading(true);

      if (selectedDistrict) {
        await updateDistrict(selectedDistrict.district_id, data);

        toast.success("District updated successfully");
      } else {
        await createDistrict(data);

        toast.success("District created successfully");
      }

      closeForm();

      await fetchDistricts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save district");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (district: DistrictMaster) => {
    const confirmed = window.confirm(`Delete "${district.district_name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await deleteDistrict(district.district_id);

      toast.success(response.message || "District deleted successfully");

      await fetchDistricts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete district");
    } finally {
      setActionLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setActionLoading(true);

      const response = await importDistricts(file);

      toast.success(response.message || "Districts imported successfully");

      await fetchDistricts();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to import districts",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setActionLoading(true);

      await exportDistricts();

      toast.success("Districts exported successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to export districts",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">District Master</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage districts and their state mapping.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <DistrictExcelActions
            importing={actionLoading}
            onImport={handleImport}
            onExport={handleExport}
          />

          <button
            type="button"
            onClick={() => {
              setSelectedDistrict(null);

              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
          >
            <Plus size={17} />
            Add District
          </button>
        </div>
      </div>

      {/* Search */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative max-w-md">
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
            placeholder="Search district..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <DistrictTable
        districts={districts}
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
        onEdit={(district) => {
          setSelectedDistrict(district);

          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Popup */}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold">
                {selectedDistrict ? "Edit District" : "Add District"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <DistrictForm
                district={selectedDistrict}
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
