import { Plus, Search, X } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import { useDebounce } from "../../../hooks/useDebounce";

import { getStates } from "../../stateMaster/services/stateApi";

import { getDistricts } from "../../districtMaster/services/districtApi";

import type { StateMaster } from "../../stateMaster/types/state.types";

import type { DistrictMaster } from "../../districtMaster/types/district.types";

import CityExcelActions from "../components/CityExcelActions";
import CityForm from "../components/CityForm";
import CityTable from "../components/CityTable";

import {
  createCity,
  deleteCity,
  exportCities,
  getCities,
  importCities,
  updateCity,
} from "../services/cityApi";

import type { CityFormData, CityMaster } from "../types/city.types";

export default function CityMasterPage() {
  const [cities, setCities] = useState<CityMaster[]>([]);

  const [states, setStates] = useState<StateMaster[]>([]);

  const [districts, setDistricts] = useState<DistrictMaster[]>([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [stateFilter, setStateFilter] = useState(0);

  const [districtFilter, setDistrictFilter] = useState(0);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [formOpen, setFormOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState<CityMaster | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  /* ========================================
     FETCH FILTER MASTER DATA
  ======================================== */

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [statesResponse, districtsResponse] = await Promise.all([
          getStates({
            page: 1,
            limit: 100,
          }),

          getDistricts({
            page: 1,
            limit: 500,
          }),
        ]);

        setStates(statesResponse.data ?? []);

        setDistricts(districtsResponse.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMasters();
  }, []);

  /* ========================================
     FILTER DISTRICTS
  ======================================== */

  const filteredDistricts = useMemo(() => {
    if (!stateFilter) {
      return districts;
    }

    return districts.filter(
      (district) => Number(district.state_id) === Number(stateFilter),
    );
  }, [districts, stateFilter]);

  /* ========================================
     FETCH CITIES
  ======================================== */

  const fetchCities = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCities({
        page,
        limit,

        search: debouncedSearch,

        state_id: stateFilter || undefined,

        district_id: districtFilter || undefined,
      });

      setCities(response.data ?? []);

      setTotal(response.pagination?.total ?? 0);

      setTotalPages(response.pagination?.totalPages ?? 1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, stateFilter, districtFilter]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  /* ========================================
     CLOSE FORM
  ======================================== */

  const closeForm = () => {
    setFormOpen(false);

    setSelectedCity(null);
  };

  /* ========================================
     CREATE / UPDATE
  ======================================== */

  const handleSubmit = async (data: CityFormData) => {
    try {
      setActionLoading(true);

      if (selectedCity) {
        await updateCity(selectedCity.city_id, data);

        toast.success("City updated successfully");
      } else {
        await createCity(data);

        toast.success("City created successfully");
      }

      closeForm();

      await fetchCities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save city");
    } finally {
      setActionLoading(false);
    }
  };

  /* ========================================
     DELETE
  ======================================== */

  const handleDelete = async (city: CityMaster) => {
    const confirmed = window.confirm(`Delete "${city.city_name}"?`);

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await deleteCity(city.city_id);

      toast.success(response.message || "City deleted successfully");

      await fetchCities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete city");
    } finally {
      setActionLoading(false);
    }
  };

  /* ========================================
     IMPORT
  ======================================== */

  const handleImport = async (file: File) => {
    try {
      setActionLoading(true);

      const response = await importCities(file);

      toast.success(response.message || "Cities imported successfully");

      await fetchCities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to import cities");
    } finally {
      setActionLoading(false);
    }
  };

  /* ========================================
     EXPORT
  ======================================== */

  const handleExport = async () => {
    try {
      setActionLoading(true);

      await exportCities();

      toast.success("Cities exported successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to export cities");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">City Master</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage cities and their district/state mapping.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <CityExcelActions
            importing={actionLoading}
            onImport={handleImport}
            onExport={handleExport}
          />

          <button
            type="button"
            onClick={() => {
              setSelectedCity(null);

              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
          >
            <Plus size={17} />
            Add City
          </button>
        </div>
      </div>

      {/* Filters */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          {/* Search */}

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
              placeholder="Search city..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* State Filter */}

          <select
            value={stateFilter}
            onChange={(event) => {
              setStateFilter(Number(event.target.value));

              setDistrictFilter(0);

              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value={0}>All States</option>

            {states.map((state) => (
              <option key={state._id} value={state.state_id}>
                {state.state_name}
              </option>
            ))}
          </select>

          {/* District Filter */}

          <select
            value={districtFilter}
            onChange={(event) => {
              setDistrictFilter(Number(event.target.value));

              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value={0}>All Districts</option>

            {filteredDistricts.map((district) => (
              <option key={district._id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}

      <CityTable
        cities={cities}
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
        onEdit={(city) => {
          setSelectedCity(city);

          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Add / Edit Popup */}

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
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCity ? "Edit City" : "Add City"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedCity ? "Update city details." : "Create a new city."}
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
              <CityForm
                city={selectedCity}
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
