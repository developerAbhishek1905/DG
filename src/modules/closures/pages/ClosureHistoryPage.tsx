import { ArrowLeft, Eye, RotateCcw, Search } from "lucide-react";

import { useEffect, useMemo, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { getClosures } from "../services/closureApi";

import {
  clearClosureFilters,
  setClosureHistoryType,
  setClosureSearch,
  setClosureStatus,
} from "../store/closureSlice";

import type {
  ClosureRecord,
  ClosureStatus,
  ClosureType,
} from "../types/closure.types";

export default function ClosureHistoryPage() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { search, status, type } = useAppSelector((state) => state.closures);

  const [closures, setClosures] = useState<ClosureRecord[]>([]);

  const [loading, setLoading] = useState(true);

  //   const [closures, setClosures] =
  //   useState<ClosureRecord[]>([]);

  // const [loading, setLoading] =
  //   useState(false);

  // const [search, setSearch] =
  //   useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [dealerId, setDealerId] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);

      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const loadClosures = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getClosures({
        page,
        limit,

        search: debouncedSearch,

        startDate,
        endDate,

        dealerId,
      });

      setClosures(response.data || []);

      setTotal(response.pagination?.total || 0);

      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load closed complaints:", error);

      setClosures([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, startDate, endDate, dealerId]);

  // useEffect(() => {
  //   loadClosures();
  // }, [loadClosures]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data = await getClosures();

        setClosures(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  console.log(closures);
  // const filteredClosures = useMemo(
  //   () =>
  //     closures.filter((closure) => {
  //       const query = search.trim().toLowerCase();

  //       const matchesSearch =
  //         !query ||
  //         closure.complaintNumber.toLowerCase().includes(query) ||
  //         closure.customer.name.toLowerCase().includes(query) ||
  //         closure.dealer.name.toLowerCase().includes(query);

  //       const matchesStatus = status === "ALL" || closure.status === status;

  //       const matchesType = type === "ALL" || closure.closureType === type;

  //       return matchesSearch && matchesStatus && matchesType;
  //     }),
  //   [closures, search, status, type],
  // );

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate("/complaints")}
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Closure History</h1>

        <p className="mt-1 text-sm text-gray-500">
          Review submitted complaint closures.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 xl:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) => dispatch(setClosureSearch(event.target.value))}
            placeholder="Search complaint, customer or dealer..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
          />
        </div>

        <select
          value={type}
          onChange={(event) =>
            dispatch(
              setClosureHistoryType(event.target.value as ClosureType | "ALL"),
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">All Types</option>

          <option value="VISIT">Visit</option>

          <option value="PART">Part</option>

          <option value="SERVICE">Service</option>

          <option value="INSTALLATION">Installation</option>

          <option value="UNINSTALLATION">Uninstallation</option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setClosureStatus(event.target.value as ClosureStatus | "ALL"),
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">All Status</option>

          <option value="DRAFT">Draft</option>

          <option value="SUBMITTED">Submitted</option>

          <option value="VERIFIED">Verified</option>

          <option value="REJECTED">Rejected</option>
        </select>

        <button
          onClick={() => dispatch(clearClosureFilters())}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading closure history...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    "Complaint",
                    "Customer",
                    "Dealer",
                    "Product",
                    "Category",
                    "Status",
                    "Closed At",
                    "Updated At",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {closures.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      No closed complaints found.
                    </td>
                  </tr>
                ) : (
                  closures.map((closure) => (
                    <tr key={closure._id} className="hover:bg-gray-50">
                      {/* Complaint */}

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/complaints/${closure._id}`)}
                          className="text-sm font-medium text-[#123B7A] hover:underline"
                        >
                          {closure.complaintNumber || "-"}
                        </button>

                        <p className="mt-1 text-xs text-gray-400">
                          {closure._id}
                        </p>
                      </td>

                      {/* Customer */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {closure.customerName ||
                            closure.customerId?.name ||
                            "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {closure.phone || closure.customerId?.phone || "-"}
                        </p>
                      </td>

                      {/* Dealer */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {closure.allocatedDealerId?.technicianFirmName ||
                            closure.dealerName ||
                            "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {closure.allocatedDealerId?.technicianName || ""}
                        </p>

                        {closure.allocatedDealerId?.mobileNumber && (
                          <p className="mt-1 text-xs text-gray-400">
                            {closure.allocatedDealerId.mobileNumber}
                          </p>
                        )}
                      </td>

                      {/* Product */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {closure.productName || "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {closure.productType || ""}
                        </p>

                        {closure.productCode && (
                          <p className="mt-1 text-xs text-gray-400">
                            {closure.productCode}
                          </p>
                        )}
                      </td>

                      {/* Category */}

                      <td className="px-5 py-4">
                        {closure.category ? (
                          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {closure.category}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <ClosureStatusBadge status={closure.status} />
                      </td>

                      {/* Closed At */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {closure.closedAt
                          ? new Date(closure.closedAt).toLocaleString()
                          : "-"}
                      </td>

                      {/* Updated At */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {closure.updatedAt
                          ? new Date(closure.updatedAt).toLocaleString()
                          : "-"}
                      </td>

                      {/* Action */}

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/complaints/${closure._id}`)}
                          title="View Complaint"
                          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ClosureTypeBadge({ type }: { type: ClosureType }) {
  return (
    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
      {type}
    </span>
  );
}

function ClosureStatusBadge({ status }: { status: ClosureStatus }) {
  const styles = {
    DRAFT: "border-gray-200 bg-gray-50 text-gray-600",

    SUBMITTED: "border-blue-200 bg-blue-50 text-blue-700",

    VERIFIED: "border-green-200 bg-green-50 text-green-700",

    REJECTED: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
