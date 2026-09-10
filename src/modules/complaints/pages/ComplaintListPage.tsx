// import { Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import ComplaintFilters from "../components/ComplaintFilters";
// import ComplaintTable from "../components/ComplaintTable";

// import { useComplaints } from "../hooks/useComplaints";

// import { useAppSelector } from "../../../app/hooks";

// export default function ComplaintListPage() {
//   const navigate = useNavigate();

//   const { complaints, loading } = useComplaints();

//   const { search, selectedStatus } =
//     useAppSelector((state) => state.complaints);

//   const filteredComplaints = complaints.filter(
//     (complaint) => {
//       const searchValue = search.toLowerCase();

//       const matchesSearch =
//         complaint.complaintNumber
//           .toLowerCase()
//           .includes(searchValue) ||
//         complaint.customer.name
//           .toLowerCase()
//           .includes(searchValue) ||
//         complaint.customer.phone.includes(searchValue);

//       const matchesStatus =
//         selectedStatus === "ALL" ||
//         complaint.status === selectedStatus;

//       return matchesSearch && matchesStatus;
//     }
//   );

//   return (
//     <div>
//       {/* Page Header */}
//       <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Complaints
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Manage and track customer complaints
//           </p>
//         </div>

//         <button
//           onClick={() =>
//             navigate("/complaints/create")
//           }
//           className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
//         >
//           <Plus size={18} />
//           Create Complaint
//         </button>
//       </div>

//       {/* Filters */}
//       <ComplaintFilters />

//       {/* Table */}
//       {loading ? (
//         <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
//           <p className="text-sm text-gray-500">
//             Loading complaints...
//           </p>
//         </div>
//       ) : (
//         <ComplaintTable
//           complaints={filteredComplaints}
//         />
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ComplaintFilters from "../components/ComplaintFilters";
import ComplaintTable from "../components/ComplaintTable";

import { getComplaints } from "../services/complaintApi";

import type { Complaint, ComplaintStatus } from "../types/complaint.types";

import { useDebounce } from "../../../hooks/useDebounce";

export default function ComplaintListPage() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Local Filters
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | "ALL">(
    "ALL",
  );

  const debouncedSearch = useDebounce(search, 500);

  /*
  |--------------------------------------------------------------------------
  | Complaint Data
  |--------------------------------------------------------------------------
  */

  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Fetch Complaints
  |--------------------------------------------------------------------------
  */

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response =
  await getComplaints({
    search:
      debouncedSearch,

    status:
      selectedStatus === "ALL"
        ? undefined
        : selectedStatus,

    fromDate:
      fromDate || undefined,

    toDate:
      toDate || undefined,

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
  }, [  debouncedSearch,
  selectedStatus,
  fromDate,
  toDate,
  page,
  limit,
]);

  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  /*
  |--------------------------------------------------------------------------
  | Reset pagination when filters change
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch,
  selectedStatus,
  fromDate,
  toDate,]);

  return (
    <div>
      {/* =========================
          Header
      ========================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer complaints
          </p>
        </div>

        <button
          onClick={() => navigate("/complaints/create")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
        >
          <Plus size={18} />
          Create Complaint
        </button>
      </div>

      {/* =========================
          Filters
      ========================== */}

      {/* <ComplaintFilters
        search={search}
        onSearchChange={setSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      /> */}

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
          Error
      ========================== */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =========================
          Table
      ========================== */}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">Loading complaints...</p>
        </div>
      ) : (
        <>
          <ComplaintTable complaints={complaints} />

          {/* =========================
              Pagination
          ========================== */}

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Total {total} complaints
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-2 text-sm text-gray-600">
                Page {page} of {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
