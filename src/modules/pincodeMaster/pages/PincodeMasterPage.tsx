import { Plus, Search, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useDebounce } from "../../../hooks/useDebounce";

import { getCities } from "../../cityMaster/services/cityApi";

import type { CityMaster } from "../../cityMaster/types/city.types";

import PincodeExcelActions from "../components/PincodeExcelActions";
import PincodeForm from "../components/PincodeForm";
import PincodeTable from "../components/PincodeTable";

import {
  createPincode,
  deletePincode,
  exportPincodes,
  getPincodes,
  importPincodes,
  updatePincode,
} from "../services/pincodeApi";

import type { PincodeFormData, PincodeMaster } from "../types/pincode.types";

export default function PincodeMasterPage() {
  const [pincodes, setPincodes] = useState<PincodeMaster[]>([]);

  const [cities, setCities] = useState<CityMaster[]>([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [cityFilter, setCityFilter] = useState(0);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [formOpen, setFormOpen] = useState(false);

  const [selectedPincode, setSelectedPincode] = useState<PincodeMaster | null>(
    null,
  );

  const debouncedSearch = useDebounce(search, 500);

  /* ===========================
     CITIES FOR FILTER
  =========================== */

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCities({
          page: 1,
          limit: 500,
        });

        setCities(response.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCities();
  }, []);

  /* ===========================
     FETCH PINCODES
  =========================== */

  const fetchPincodes = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getPincodes({
        page,
        limit,

        search: debouncedSearch,

        city_id: cityFilter || undefined,
      });

      setPincodes(response.data ?? []);

      setTotal(response.pagination?.total ?? 0);

      setTotalPages(response.pagination?.totalPages ?? 1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch pincodes");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, cityFilter]);

  useEffect(() => {
    fetchPincodes();
  }, [fetchPincodes]);

  const closeForm = () => {
    setFormOpen(false);

    setSelectedPincode(null);
  };

  /* ===========================
     CREATE / UPDATE
  =========================== */

  const handleSubmit = async (data: PincodeFormData) => {
    try {
      setActionLoading(true);

      if (selectedPincode) {
        /*
           Your current update curl only sends
           pincode_name.

           If your backend also supports city_id,
           you can pass full data here instead.
          */

        await updatePincode(selectedPincode.pincode_id ?? selectedPincode._id, {
          pincode_name: data.pincode_name,
        });

        toast.success("Pincode updated successfully");
      } else {
        await createPincode(data);

        toast.success("Pincode created successfully");
      }

      closeForm();

      await fetchPincodes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save pincode");
    } finally {
      setActionLoading(false);
    }
  };

  /* ===========================
     DELETE
  =========================== */

  const handleDelete = async (pincode: PincodeMaster) => {
    const confirmed = window.confirm(
      `Delete pincode "${pincode.pincode_name}"?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await deletePincode(pincode.pincode_id ?? pincode._id);

      toast.success(response.message || "Pincode deleted successfully");

      await fetchPincodes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete pincode");
    } finally {
      setActionLoading(false);
    }
  };

  /* ===========================
     IMPORT
  =========================== */

  const handleImport = async (file: File) => {
    try {
      setActionLoading(true);

      const response = await importPincodes(file);

      toast.success(response.message || "Pincodes imported successfully");

      await fetchPincodes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to import pincodes");
    } finally {
      setActionLoading(false);
    }
  };

  /* ===========================
     EXPORT
  =========================== */

  const handleExport = async () => {
    try {
      setActionLoading(true);

      await exportPincodes();

      toast.success("Pincodes exported successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to export pincodes");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pincode Master</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage pincodes and their city mapping.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <PincodeExcelActions
            importing={actionLoading}
            onImport={handleImport}
            onExport={handleExport}
          />

          <button
            type="button"
            onClick={() => {
              setSelectedPincode(null);

              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
          >
            <Plus size={17} />
            Add Pincode
          </button>
        </div>
      </div>

      {/* FILTER */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
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
              placeholder="Search pincode..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none"
            />
          </div>

          <select
            value={cityFilter}
            onChange={(event) => {
              setCityFilter(Number(event.target.value));

              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value={0}>All Cities</option>

            {cities.map((city) => (
              <option key={city._id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}

      <PincodeTable
        pincodes={pincodes}
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
        onEdit={(pincode) => {
          setSelectedPincode(pincode);

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
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedPincode ? "Edit Pincode" : "Add Pincode"}
                </h2>
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
              <PincodeForm
                pincode={selectedPincode}
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
