import { useEffect, useState } from "react";

import { useDebounce } from "../../../hooks/useDebounce";
import {
  getAllocationHistory,
  type AllocationHistoryRow,
} from "../services/allocationSettingsApi";

type Pagination = { page: number; limit: number; total: number; totalPages: number };

const LABELS: Record<string, { text: string; className: string }> = {
  DEALER_ALLOCATED: { text: "Allocated", className: "bg-green-50 text-green-700" },
  DEALER_CHANGED: { text: "Changed", className: "bg-amber-50 text-amber-700" },
  DEALER_REMOVED: { text: "Removed", className: "bg-red-50 text-red-700" },
};

export default function AllocationHistoryTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AllocationHistoryRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debounced = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getAllocationHistory({ search: debounced, page, limit: 10 })
      .then((result) => {
        if (cancelled) return;
        setRows(result.data);
        setPagination(result.pagination);
      })
      .catch(() => {
        if (!cancelled) {
          setRows([]);
          setError("Failed to load allocation history.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, page]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Allocation History</h2>
          <p className="mt-1 text-sm text-gray-500">
            Which dealer each complaint was allocated to, and why.
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search complaint or dealer..."
          className="h-10 w-64 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Complaint</th>
                <th className="px-4 py-3 text-left font-semibold">Allocation Dealer</th>
                <th className="px-4 py-3 text-left font-semibold">Allocation Reason</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-gray-500">
                    Loading allocation history...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-gray-500">
                    No allocation history found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const label = LABELS[row.activityType];

                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-gray-900">{row.complaintNumber}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(row.createdAt).toLocaleString("en-IN")}
                        </p>
                      </td>

                      <td className="px-4 py-2.5 text-gray-800">{row.dealerName}</td>

                      <td className="px-4 py-2.5 text-gray-700">
                        <div className="flex flex-wrap items-center gap-2">
                          {label && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${label.className}`}
                            >
                              {label.text}
                              {row.allocationType ? ` · ${row.allocationType}` : ""}
                            </span>
                          )}
                          <span className={row.reason ? "" : "text-gray-400"}>{row.reason || "Reason not recorded"}</span>
                        </div>

                        {row.performedBy && (
                          <p className="mt-0.5 text-xs text-gray-400">by {row.performedBy}</p>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
            <span>
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} records
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((value) => value - 1)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((value) => value + 1)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
