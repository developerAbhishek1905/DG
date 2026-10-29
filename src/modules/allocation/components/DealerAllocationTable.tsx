import { useEffect, useState } from "react";
import { TableSkeletonRows } from "../../../components/ui/TableSkeleton";
import { toast } from "react-toastify";

import { useDebounce } from "../../../hooks/useDebounce";
import {
  getDealerAllocations,
  setDealerRating,
  type DealerAllocationList,
} from "../services/allocationSettingsApi";

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const headings = [
  ["Dealer", "text-left"],
  ["Cities", "text-left"],
  ["Allocated", "text-right"],
  ["Completed", "text-right"],
  ["Cancelled", "text-right"],
  ["Completion", "text-right"],
  ["Amount Received", "text-right"],
  ["Avg Amount", "text-right"],
  ["Rating", "text-center"],
  ["Credit Limit", "text-right"],
  ["Outstanding", "text-right"],
  ["Status", "text-center"],
] as const;

export default function DealerAllocationTable({ refreshKey }: { refreshKey: number }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<DealerAllocationList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [ratingDraft, setRatingDraft] = useState("");
  const [savingRating, setSavingRating] = useState(false);

  const debounced = useDebounce(search, 400);

  const startEdit = (dealerId: string, rating: number) => {
    setEditingId(dealerId);
    setRatingDraft(String(rating));
  };

  const saveRating = async (dealerId: string, value: number | null) => {
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > 5)) {
      toast.error("Rating must be between 0 and 5");
      return;
    }

    try {
      setSavingRating(true);
      // Remember the rating that is on screen right now as the previous one
      const before = result?.data.find((row) => row.dealerId === dealerId);
      const previousRating = before ? Number(before.rating) : null;

      await setDealerRating(dealerId, value, previousRating);

      setResult((current) =>
        current
          ? {
              ...current,
              data: current.data.map((row) =>
                row.dealerId === dealerId
                  ? {
                      ...row,
                      ratingOverridden: value !== null,
                      previousRating: previousRating ?? row.previousRating,
                      rating: value !== null ? value : row.calculatedRating,
                    }
                  : row,
              ),
            }
          : current,
      );

      setEditingId(null);
      toast.success(value === null ? "Rating reset to automatic" : "Rating updated");
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })?.response
        ?.data?.message;

      toast.error(message || "Failed to update rating");
    } finally {
      setSavingRating(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getDealerAllocations({ search: debounced, page, limit: 10 })
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) {
          setResult(null);
          setError("Failed to load dealer allocations.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, page, refreshKey]);

  const rows = result?.data ?? [];
  const pagination = result?.pagination;

  return (
    <div className="mt-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Dealer Allocation</h2>
          <p className="mt-1 text-sm text-gray-500">
            {result?.period
              ? `Performance from ${new Date(result.period.from).toLocaleDateString("en-IN")} to ${new Date(result.period.to).toLocaleDateString("en-IN")}${result.period.isDefault ? " (current month)" : ""}.`
              : "Allocation and performance of every dealer."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dealer name or code..."
            className="h-10 w-64 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                {headings.map(([label, align]) => (
                  <th key={label} className={`px-4 py-3 font-semibold ${align}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableSkeletonRows cols={headings.length} />
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={headings.length} className="px-4 py-12 text-center text-gray-500">
                    No dealer allocations found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.dealerId} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-gray-900">{row.dealerName || "-"}</p>
                      <p className="text-xs text-gray-500">{row.dealerCode}</p>
                    </td>

                    <td className="max-w-[200px] px-4 py-2.5 text-xs text-gray-600">
                      {row.cities.length ? row.cities.join(", ") : "-"}
                    </td>

                    <td className="px-4 py-2.5 text-right">{row.totalAllocated}</td>
                    <td className="px-4 py-2.5 text-right text-green-700">{row.totalCompleted}</td>
                    <td className="px-4 py-2.5 text-right text-red-700">{row.totalCancelled}</td>
                    <td className="px-4 py-2.5 text-right">{row.completionPercentage}%</td>
                    <td className="px-4 py-2.5 text-right font-medium">{money(row.totalAmount)}</td>
                    <td className="px-4 py-2.5 text-right">{money(row.averageAmount)}</td>

                    <td className="px-4 py-2.5 text-center">
                      {editingId === row.dealerId ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            autoFocus
                            type="number"
                            min={0}
                            max={5}
                            step={0.1}
                            value={ratingDraft}
                            onChange={(e) => setRatingDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveRating(row.dealerId, Number(ratingDraft));
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="h-8 w-16 rounded border border-gray-300 px-2 text-center text-xs"
                          />
                          <button
                            type="button"
                            disabled={savingRating}
                            onClick={() => saveRating(row.dealerId, Number(ratingDraft))}
                            className="rounded bg-[#6D28D9] px-2 py-1 text-xs font-semibold text-white disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded border border-gray-300 px-2 py-1 text-xs"
                          >
                            ✕
                          </button>
                          {row.ratingOverridden && (
                            <button
                              type="button"
                              disabled={savingRating}
                              onClick={() => saveRating(row.dealerId, null)}
                              className="rounded border border-gray-300 px-2 py-1 text-xs"
                              title={`Back to calculated (${Number(row.calculatedRating).toFixed(1)})`}
                            >
                              Auto
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(row.dealerId, row.rating)}
                          title="Click to change rating"
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold hover:ring-2 hover:ring-blue-200 ${
                            row.ratingOverridden
                              ? "bg-blue-50 text-[#6D28D9]"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          ★ {Number(row.rating).toFixed(1)}
                          {row.ratingOverridden && <span className="ml-1 text-[10px]">manual</span>}
                        </button>
                      )}

                      {editingId !== row.dealerId &&
                        row.previousRating !== null &&
                        row.previousRating !== undefined &&
                        Number(row.previousRating) !== Number(row.rating) && (
                          <p
                            className="mt-0.5 text-[10px] text-gray-400"
                            title="Rating before the last change"
                          >
                            Previous ★ {Number(row.previousRating).toFixed(1)}
                          </p>
                        )}
                    </td>

                    <td className="px-4 py-2.5 text-right">
                      {row.creditLimit > 0 ? money(row.creditLimit) : "-"}
                    </td>

                    <td
                      className={`px-4 py-2.5 text-right ${
                        row.creditBlocked ? "font-semibold text-red-700" : ""
                      }`}
                    >
                      {money(row.outstanding)}
                    </td>

                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          row.status === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {row.status}
                      </span>

                      {row.creditBlocked && (
                        <span className="ml-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                          Credit limit
                        </span>
                      )}

                      {!row.hasAllocation && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          No allocation this period
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
            <span>
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} dealers
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
