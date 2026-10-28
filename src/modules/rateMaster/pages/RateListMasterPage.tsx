import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Power, RotateCcw, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Pagination from "../../../components/ui/Pagination";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePermission } from "../../../hooks/usePermission";

import RateListForm from "../components/RateListForm";
import {
  createRateListItem,
  deleteRateListItem,
  getProductOptions,
  getRateList,
  toggleRateListStatus,
  updateRateListItem,
} from "../services/rateListApi";
import type {
  RateFormValues,
  RateListItem,
  RateListPagination,
  RateStatus,
} from "../types/rateList.types";

const getError = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

export default function RateListMasterPage() {
  const { hasPermission } = usePermission();

  const [rates, setRates] = useState<RateListItem[]>([]);
  const [pagination, setPagination] = useState<RateListPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState<RateStatus | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<RateListItem | undefined>();
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRateList({
        page,
        limit,
        search: debouncedSearch.trim(),
        status,
        productId,
      });
      setRates(result.data);
      setPagination(result.pagination);
    } catch (error) {
      toast.error(getError(error, "Failed to load list"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, status, productId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, productId, limit]);

  // Product filter options
  useEffect(() => {
    getProductOptions()
      .then((list) =>
        setProducts(list.map((p) => ({ id: p.product_id, name: p.product_name }))),
      )
      .catch(() => setProducts([]));
  }, []);

  const hasFilters = Boolean(search || productId || status);

  const resetFilters = () => {
    setSearch("");
    setProductId("");
    setStatus("");
  };

  const openAdd = () => {
    setSelected(undefined);
    setFormOpen(true);
  };

  const openEdit = (rate: RateListItem) => {
    setSelected(rate);
    setFormOpen(true);
  };

  const handleSubmit = async (values: RateFormValues) => {
    setSaving(true);
    try {
      if (selected) {
        await updateRateListItem(selected._id, values);
        toast.success("Updated successfully");
      } else {
        await createRateListItem(values);
        toast.success("Added successfully");
      }
      setFormOpen(false);
      setSelected(undefined);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (rate: RateListItem) => {
    setBusyId(rate._id);
    try {
      await toggleRateListStatus(rate._id);
      await load();
    } catch (error) {
      toast.error(getError(error, "Failed to update status"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (rate: RateListItem) => {
    if (!window.confirm(`Delete "${rate.title}"?`)) return;
    setBusyId(rate._id);
    try {
      await deleteRateListItem(rate._id);
      toast.success("Deleted successfully");
      await load();
    } catch (error) {
      toast.error(getError(error, "Failed to delete"));
    } finally {
      setBusyId(null);
    }
  };

  const controlClass =
    "h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#123B7A]";

  const showActions =
    hasPermission("rate.update") || hasPermission("rate.delete");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Closure Master</h1>

        {hasPermission("rate.create") && (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854]"
          >
            <Plus size={18} />
            Add
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or product..."
              className={`${controlClass} w-full pl-9`}
            />
          </div>

          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={controlClass}
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RateStatus | "")}
            className={controlClass}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>
            <span className="font-semibold text-gray-900">{pagination.total}</span>{" "}
            records
          </span>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <TableSkeleton cols={showActions ? 4 : 3} />
      ) : rates.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          No records found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    "Title",
                    "Product",
                                        "Status",
                    ...(showActions ? ["Actions"] : []),
                  ].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {rates.map((rate) => (
                  <tr key={rate._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {rate.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {rate.productName || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          rate.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {rate.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {showActions && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {hasPermission("rate.update") && (
                            <>
                              <button
                                type="button"
                                title="Edit"
                                onClick={() => openEdit(rate)}
                                className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                title={rate.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                disabled={busyId === rate._id}
                                onClick={() => handleToggle(rate)}
                                className="rounded-lg bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-500 hover:text-white disabled:opacity-50"
                              >
                                <Power size={15} />
                              </button>
                            </>
                          )}
                          {hasPermission("rate.delete") && (
                            <button
                              type="button"
                              title="Delete"
                              disabled={busyId === rate._id}
                              onClick={() => handleDelete(rate)}
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 px-3 py-3">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        </div>
      )}

      {formOpen && (
        <RateListForm
          rate={selected}
          saving={saving}
          onClose={() => {
            setFormOpen(false);
            setSelected(undefined);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
