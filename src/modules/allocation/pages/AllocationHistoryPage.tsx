import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAllocationHistory,
} from "../services/allocationApi";

import type {
  AllocationHistoryItem,
} from "../types/allocation.types";

export default function AllocationHistoryPage() {
  const navigate =
    useNavigate();

  const [
    history,
    setHistory,
  ] =
    useState<
      AllocationHistoryItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    type,
    setType,
  ] =
    useState("ALL");

  const loadHistory =
    async () => {
      try {
        setLoading(true);

        const data =
          await getAllocationHistory();

        setHistory(data);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory =
    useMemo(
      () =>
        history.filter(
          (item) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              item.complaintNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              item.newDealerName
                .toLowerCase()
                .includes(
                  query
                ) ||
              item.previousDealerName
                ?.toLowerCase()
                .includes(
                  query
                );

            const matchesType =
              type === "ALL" ||
              item.allocationType ===
                type;

            return (
              matchesSearch &&
              matchesType
            );
          }
        ),
      [
        history,
        search,
        type,
      ]
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <button
            onClick={() =>
              navigate(
                "/allocation"
              )
            }
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500"
          >
            <ArrowLeft
              size={17}
            />

            Back to Allocation
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Allocation History
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review dealer assignment and reassignment activity.
          </p>
        </div>

        <button
          onClick={
            loadHistory
          }
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
        >
          <RefreshCw
            size={17}
          />

          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search complaint or dealer..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
          />
        </div>

        <select
          value={type}
          onChange={(event) =>
            setType(
              event.target.value
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Types
          </option>

          <option value="AUTO">
            Auto
          </option>

          <option value="MANUAL">
            Manual
          </option>

          <option value="REASSIGNMENT">
            Reassignment
          </option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading allocation history...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    "Complaint",
                    "Previous Dealer",
                    "",
                    "New Dealer",
                    "Type",
                    "Reason",
                    "Performed By",
                    "Date",
                  ].map(
                    (
                      heading,
                      index
                    ) => (
                      <th
                        key={`${heading}-${index}`}
                        className="px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredHistory.map(
                  (item) => (
                    <tr
                      key={
                        item.id
                      }
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#123B7A]">
                          {
                            item.complaintNumber
                          }
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {
                            item.id
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {
                          item.previousDealerName ??
                          "-"
                        }
                      </td>

                      <td className="px-2 py-4">
                        <ArrowRight
                          size={16}
                          className="text-gray-300"
                        />
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {
                          item.newDealerName
                        }
                      </td>

                      <td className="px-5 py-4">
                        <AllocationTypeBadge
                          type={
                            item.allocationType
                          }
                        />
                      </td>

                      <td className="max-w-sm px-5 py-4 text-sm text-gray-600">
                        {
                          item.reason
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {
                          item.performedBy
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {new Date(
                          item.performedAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AllocationTypeBadge({
  type,
}: {
  type:
    | "AUTO"
    | "MANUAL"
    | "REASSIGNMENT";
}) {
  const styles = {
    AUTO:
      "border-blue-200 bg-blue-50 text-blue-700",

    MANUAL:
      "border-gray-200 bg-gray-50 text-gray-700",

    REASSIGNMENT:
      "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[type]}`}
    >
      {type}
    </span>
  );
}