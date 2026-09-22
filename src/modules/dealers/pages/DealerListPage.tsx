import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import DealerFilters from "../components/DealerFilters";
import DealerStats from "../components/DealerStats";
import DealerTable from "../components/DealerTable";

import { useDealers } from "../hooks/useDealers";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePermission } from "../../../hooks/usePermission";
// import Pagination from "../../../components/ui/Pagination";

export default function DealerListPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { dealers, loading, pagination, refetch } = useDealers({
    page,
    limit,
    search: debouncedSearch,
    status: status === "ALL" ? "" : status,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  // const handlePageChange = (newPage: number) => {
  //   if (newPage < 1 || newPage > pagination.totalPages) {
  //     return;
  //   }

  //   setPage(newPage);
  // };

  // const handleLimitChange = (newLimit: number) => {
  //   setLimit(newLimit);
  //   setPage(1);
  // };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dealers</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage dealer capacity, availability and performance.
          </p>
        </div>

        {hasPermission("dealers.create") && (
          <button
            type="button"
            onClick={() => navigate("/dealers/create")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854]"
          >
            <Plus size={18} />
            Add Dealer
          </button>
        )}
      </div>

      {hasPermission("dealers.table") && (
        <>
          {/* STATS */}

          <DealerStats dealers={dealers} />

          {/* FILTERS */}

          <DealerFilters
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />

          {/* CONTENT */}

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
              Loading dealers...
            </div>
          ) : dealers.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-sm font-medium text-gray-700">
                No dealers found
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <>
              <DealerTable
                dealers={dealers}
                onRefresh={refetch}
                page={page}
                limit={limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
