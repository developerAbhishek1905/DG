import { Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import StateExcelActions from "../components/StateExcelActions";
import StateForm from "../components/StateForm";
import StateTable from "../components/StateTable";
import {
  createState,
  deleteState,
  getStates,
  importStates,
  updateState,
  exportStates,
} from "../services/stateApi";
import type { StateFormData, StateMaster } from "../types/state.types";
import { useDebounce } from "../../../hooks/useDebounce";
import { toast } from "react-toastify";

export default function StateMasterPage() {
  const [states, setStates] = useState<StateMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<StateMaster | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useDebounce(search, 500);

  /**
   * Fetch states directly from API
   */
  const fetchStates = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await getStates({
        page,
        limit,
        search: debouncedSearch,
      });

      setStates(response.data ?? []);

      setTotal(response.pagination?.total ?? 0);

      setTotalPages(response.pagination?.totalPages ?? 1);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch states";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  /**
   * Add / Update
   */
  const handleSubmit = async (data: StateFormData) => {
    try {
      setActionLoading(true);
      setError(null);

      if (selectedState) {
        await updateState(selectedState.state_id, data);

        toast.success("State updated successfully");
      } else {
        await createState(data);

        toast.success("State created successfully");
      }

      // Close modal
      setFormOpen(false);

      // Clear edit state
      setSelectedState(null);

      // Refresh table
      await fetchStates();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save state";

      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Delete
   */
  const handleDelete = async (state: StateMaster) => {
    const confirmed = window.confirm(`Delete "${state.state_name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const response = await deleteState(state.state_id);

      toast.success(response.message || "State deleted successfully");

      await fetchStates();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete state";

      setError(message);

      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Import Excel
   */
  const handleImport = async (file: File) => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await importStates(file);

      toast.success(response.message || "States imported successfully");

      await fetchStates();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to import states";

      setError(message);

      toast.error(message);

      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setActionLoading(true);
      setError(null);

      await exportStates();

      toast.success("States exported successfully");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to export states";

      setError(message);

      toast.error(message);

      throw error;
    } finally {
      setActionLoading(false);
    }
  };
  /**
   * Search
   *
   * Backend already supports search,
   * so we don't need useMemo/filter locally.
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);

    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">State Master</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage states and import or export state data.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* <StateExcelActions
            states={states}
            importing={actionLoading}
            onImport={handleImport}
          /> */}

          <StateExcelActions
            importing={actionLoading}
            onImport={handleImport}
            onExport={handleExport}
          />

          {/* <button
            type="button"
            onClick={() => {
              setSelectedState(null);

              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
          >
            <Plus size={17} />
            Add State
          </button> */}

          <button
            type="button"
            onClick={() => {
              setSelectedState(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
          >
            <Plus size={17} />
            Add State
          </button>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}

      {/* {formOpen && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              {selectedState ? "Edit State" : "Add State"}
            </h2>

            <button
              type="button"
              onClick={() => {
                setFormOpen(false);

                setSelectedState(null);
              }}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5">
            <StateForm
              state={selectedState}
              loading={actionLoading}
              onSubmit={handleSubmit}
              onCancel={() => {
                setFormOpen(false);

                setSelectedState(null);
              }}
            />
          </div>
        </div>
      )} */}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setFormOpen(false);
              setSelectedState(null);
            }
          }}
        >
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedState ? "Edit State" : "Add State"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedState
                    ? "Update state information."
                    : "Enter state information."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setSelectedState(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Existing reusable StateForm */}

            <div className="p-5">
              <StateForm
                state={selectedState}
                loading={actionLoading}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setFormOpen(false);
                  setSelectedState(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search state name..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Table */}

      <StateTable
        states={states}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);

          setPage(1);
        }}
        onEdit={(state) => {
          setSelectedState(state);

          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-500">Total {total} states</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
