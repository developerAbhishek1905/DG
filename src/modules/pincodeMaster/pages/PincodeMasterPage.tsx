import { Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "../../../hooks/useDebounce";
import { getCities } from "../../cityMaster/services/cityApi";
import { getStates } from "../../stateMaster/services/stateApi";
import { getDistricts } from "../../districtMaster/services/districtApi";
import type { StateMaster } from "../../stateMaster/types/state.types";
import type { DistrictMaster } from "../../districtMaster/types/district.types";
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
import { usePermission } from "../../../hooks/usePermission";

export default function PincodeMasterPage() {
  const [pincodes, setPincodes] = useState<PincodeMaster[]>([]);
  const [cities, setCities] = useState<CityMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState(0);
  const [districtFilter, setDistrictFilter] = useState(0);
  const [cityFilter, setCityFilter] = useState(0);
  const [states, setStates] = useState<StateMaster[]>([]);
  const [districts, setDistricts] = useState<DistrictMaster[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<PincodeMaster | null>(
    null,
  );

  const debouncedSearch = useDebounce(search, 500);
  const { hasPermission } = usePermission();
  /* ===========================
     FILTER DROPDOWN DATA
     (the API returns max 100 rows per page, so every
      page is fetched until the whole list is loaded)
  =========================== */

  useEffect(() => {
    getStates({ page: 1, limit: 100 })
      .then((response) => setStates(response.data ?? []))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchDistricts = async () => {
      try {
        const all: DistrictMaster[] = [];
        let currentPage = 1;
        let lastPage = 1;

        do {
          const response = await getDistricts({
            page: currentPage,
            limit: 100,
            state_id: stateFilter || undefined,
          });

          all.push(...(response.data ?? []));
          lastPage = response.pagination?.totalPages ?? 1;
          currentPage += 1;
        } while (currentPage <= lastPage);

        if (!cancelled) setDistricts(all);
      } catch (error) {
        console.error(error);
        if (!cancelled) setDistricts([]);
      }
    };

    fetchDistricts();

    return () => {
      cancelled = true;
    };
  }, [stateFilter]);

  useEffect(() => {
    let cancelled = false;

    const fetchCities = async () => {
      try {
        const all: CityMaster[] = [];
        let currentPage = 1;
        let lastPage = 1;

        do {
          const response = await getCities({
            page: currentPage,
            limit: 100,
            state_id: stateFilter || undefined,
            district_id: districtFilter || undefined,
          });

          all.push(...(response.data ?? []));
          lastPage = response.pagination?.totalPages ?? 1;
          currentPage += 1;
        } while (currentPage <= lastPage);

        if (!cancelled) setCities(all);
      } catch (error) {
        console.error(error);
        if (!cancelled) setCities([]);
      }
    };

    fetchCities();

    return () => {
      cancelled = true;
    };
  }, [stateFilter, districtFilter]);

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

        state_id: stateFilter || undefined,

        district_id: districtFilter || undefined,
      });

      setPincodes(response.data ?? []);

      setTotal(response.pagination?.total ?? 0);

      setTotalPages(response.pagination?.totalPages ?? 1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch pincodes");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, cityFilter, stateFilter, districtFilter]);

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

        </div>

        <div className="flex flex-wrap gap-2">
          <PincodeExcelActions
            importing={actionLoading}
            onImport={handleImport}
            onExport={handleExport}
          />
          {hasPermission("pincode.create") && (
            <button
              type="button"
              onClick={() => {
                setSelectedPincode(null);

                setFormOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#4C1D95]"
            >
              <Plus size={17} />
              Add Pincode
            </button>
          )}
        </div>
      </div>

      {hasPermission("pincode.table") && (
        <>
          {/* FILTER */}

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                value={stateFilter}
                onChange={(event) => {
                  setStateFilter(Number(event.target.value));
                  setDistrictFilter(0);
                  setCityFilter(0);
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

              <select
                value={districtFilter}
                onChange={(event) => {
                  setDistrictFilter(Number(event.target.value));
                  setCityFilter(0);
                  setPage(1);
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value={0}>All Districts</option>

                {districts.map((district) => (
                  <option key={district._id} value={district.district_id}>
                    {district.district_name}
                  </option>
                ))}
              </select>

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
        </>
      )}

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
