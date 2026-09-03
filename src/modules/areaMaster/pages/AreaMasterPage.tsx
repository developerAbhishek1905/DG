import { MapPin, Plus, RotateCcw, Search } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDebounce } from "../../../hooks/useDebounce";

import AreaTable from "../components/AreaTable";

import {
  exportAreas,
  getAreas,
  importAreas,
  updateArea,
} from "../services/areaApi";

import AreaExcelActions from "../components/AreaExcelActions";

import { getStates } from "../../stateMaster/services/stateApi";

import { getCities } from "../../cityMaster/services/cityApi";

import type { Area, AreaStatus } from "../types/area.types";

import type { StateMaster } from "../../stateMaster/types/state.types";

import type { CityMaster } from "../../cityMaster/types/city.types";

export default function AreaMasterPage() {
  const navigate = useNavigate();

  const [areas, setAreas] = useState<Area[]>([]);

  const [states, setStates] = useState<StateMaster[]>([]);

  const [cities, setCities] = useState<CityMaster[]>([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [stateFilter, setStateFilter] = useState(0);

  const [cityFilter, setCityFilter] = useState(0);

  const [statusFilter, setStatusFilter] = useState<AreaStatus | "">("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  /* =====================================
     FETCH STATES
  ===================================== */

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await getStates({
          page: 1,
          limit: 100,
        });

        setStates(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch states", error);
      }
    };

    fetchStates();
  }, []);

  /* =====================================
     FETCH CITIES FOR FILTER
  ===================================== */

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCities({
          page: 1,
          limit: 500,

          state_id: stateFilter || undefined,
        });

        setCities(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch cities", error);

        setCities([]);
      }
    };

    fetchCities();
  }, [stateFilter]);

  /* =====================================
     FETCH AREAS
  ===================================== */

  const fetchAreas = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAreas({
        page,
        limit,

        search: debouncedSearch,

        state_id: stateFilter || undefined,

        city_id: cityFilter || undefined,

        status: statusFilter || undefined,
      });

      setAreas(response.data ?? []);

      setTotal(response.pagination?.total ?? 0);

      setTotalPages(response.pagination?.totalPages ?? 1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch areas");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, stateFilter, cityFilter, statusFilter]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  /* =====================================
     RESET FILTER
  ===================================== */

  const handleReset = () => {
    setSearch("");

    setStateFilter(0);

    setCityFilter(0);

    setStatusFilter("");

    setPage(1);
  };

  /* =====================================
     TOGGLE STATUS
  ===================================== */

  const handleToggleStatus = async (area: Area) => {
    try {
      setActionLoading(true);

      const newStatus: AreaStatus =
        area.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await updateArea(area._id, {
        areaCode: area.areaCode,

        areaName: area.areaName,

        state_id: Number(area.state_id),

        district_id: Number(area.district_id),

        city_id: Number(area.city_id),

        pincode_id: Number(area.pincode_id),

        zone: area.zone,

        latitude: area.latitude,

        longitude: area.longitude,

        status: newStatus,
      });

      toast.success(
        newStatus === "ACTIVE"
          ? "Area activated successfully"
          : "Area deactivated successfully",
      );

      await fetchAreas();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update area status",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setActionLoading(true);

      const response = await importAreas(file);

      toast.success(response.message || "Areas imported successfully");

      setPage(1);

      await fetchAreas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to import areas");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setActionLoading(true);

      await exportAreas();

      toast.success("Areas exported successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to export areas");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin size={23} className="text-[#123B7A]" />

            <h1 className="text-2xl font-bold text-gray-900">Area Master</h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage service areas used for complaint and dealer allocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AreaExcelActions
            loading={actionLoading}
            onImport={handleImport}
            onExport={handleExport}
          />

          <button
            type="button"
            onClick={() => navigate("/area-master/create")}
            disabled={actionLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
          >
            <Plus size={17} />
            Add Area
          </button>
        </div>
      </div>

      {/* FILTER */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setPage(1);
              }}
              placeholder="Search area..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* STATE */}

          <select
            value={stateFilter}
            onChange={(e) => {
              const value = Number(e.target.value);

              setStateFilter(value);

              setCityFilter(0);

              setPage(1);
            }}
            className={filterClass}
          >
            <option value={0}>All States</option>

            {states.map((state) => (
              <option key={state._id} value={state.state_id}>
                {state.state_name}
              </option>
            ))}
          </select>

          {/* CITY */}

          <select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(Number(e.target.value));

              setPage(1);
            }}
            className={filterClass}
          >
            <option value={0}>All Cities</option>

            {cities.map((city) => (
              <option key={city._id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as AreaStatus | "");

              setPage(1);
            }}
            className={filterClass}
          >
            <option value="">All Status</option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Total <span className="font-semibold text-gray-800">{total}</span>{" "}
          areas
        </div>
      </div>

      <AreaTable
        areas={areas}
        loading={loading || actionLoading}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        onEdit={(area) => navigate(`/area-master/${area._id}/edit`)}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}

const filterClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
