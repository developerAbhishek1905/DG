import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ComplaintFilters from "../components/ComplaintFilters";
import ComplaintTable from "../components/ComplaintTable";
import Pagination from "../../../components/ui/Pagination";
import { getComplaints } from "../services/complaintApi";
import type { Complaint, ComplaintStatus } from "../types/complaint.types";
import { useDebounce } from "../../../hooks/useDebounce";

export default function ComplaintListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | "ALL">(
    "ALL",
  );
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearch = useDebounce(search, 500);

  // =========================
  // FETCH COMPLAINTS
  // =========================

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getComplaints({
        search: debouncedSearch,
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        limit,
      });

      setComplaints(response.data);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error("Fetch complaints error:", error);
      setComplaints([]);
      setError(error.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedStatus, fromDate, toDate, page, limit]);

  // =========================
  // FETCH
  // =========================

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // =========================
  // RESET PAGE ON FILTER
  // =========================

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedStatus, fromDate, toDate]);

  // =========================
  // PAGINATION HANDLERS
  // =========================

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    // Always go back to first page
    setPage(1);
  };

  return (
    <div>
      {/* =========================
          HEADER
      ========================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer complaints
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/complaints/create")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
        >
          <Plus size={18} />
          Create Complaint
        </button>
      </div>

      {/* =========================
          FILTERS
      ========================== */}

      <ComplaintFilters
        search={search}
        onSearchChange={setSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =========================
          CONTENT
      ========================== */}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm font-medium text-gray-700">
            No complaints found
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* TABLE */}

          {/* <ComplaintTable complaints={complaints} /> */}
          <ComplaintTable complaints={complaints} onReload={fetchComplaints} />
          {/* PAGINATION */}

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      )}
    </div>
  );
}
