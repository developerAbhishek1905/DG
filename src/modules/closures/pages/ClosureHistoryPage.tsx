import {
  ArrowLeft,
  Eye,
  RotateCcw,
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
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  getClosures,
} from "../services/closureApi";

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
  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  const {
    search,
    status,
    type,
  } = useAppSelector(
    (state) =>
      state.closures
  );

  const [
    closures,
    setClosures,
  ] =
    useState<
      ClosureRecord[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    const load =
      async () => {
        try {
          setLoading(true);

          const data =
            await getClosures();

          setClosures(data);
        } finally {
          setLoading(false);
        }
      };

    load();
  }, []);

  const filteredClosures =
    useMemo(
      () =>
        closures.filter(
          (closure) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              closure.complaintNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              closure.customer.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              closure.dealer.name
                .toLowerCase()
                .includes(
                  query
                );

            const matchesStatus =
              status === "ALL" ||
              closure.status ===
                status;

            const matchesType =
              type === "ALL" ||
              closure.closureType ===
                type;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesType
            );
          }
        ),
      [
        closures,
        search,
        status,
        type,
      ]
    );

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() =>
            navigate(
              "/complaints"
            )
          }
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft
            size={17}
          />

          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900">
          Closure History
        </h1>

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
            onChange={(event) =>
              dispatch(
                setClosureSearch(
                  event.target.value
                )
              )
            }
            placeholder="Search complaint, customer or dealer..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
          />
        </div>

        <select
          value={type}
          onChange={(event) =>
            dispatch(
              setClosureHistoryType(
                event.target.value as
                  | ClosureType
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Types
          </option>

          <option value="VISIT">
            Visit
          </option>

          <option value="PART">
            Part
          </option>

          <option value="SERVICE">
            Service
          </option>

          <option value="INSTALLATION">
            Installation
          </option>

          <option value="UNINSTALLATION">
            Uninstallation
          </option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setClosureStatus(
                event.target.value as
                  | ClosureStatus
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="DRAFT">
            Draft
          </option>

          <option value="SUBMITTED">
            Submitted
          </option>

          <option value="VERIFIED">
            Verified
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>

        <button
          onClick={() =>
            dispatch(
              clearClosureFilters()
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <RotateCcw
            size={16}
          />

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
            <table className="w-full min-w-[1100px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    "Closure",
                    "Complaint",
                    "Customer",
                    "Dealer",
                    "Type",
                    "Proofs",
                    "Status",
                    "Closed By",
                    "Closed At",
                    "Action",
                  ].map(
                    (heading) => (
                      <th
                        key={
                          heading
                        }
                        className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredClosures.map(
                  (closure) => (
                    <tr
                      key={
                        closure.id
                      }
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {
                          closure.id
                        }
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/complaints/${closure.complaintId}`
                            )
                          }
                          className="text-sm font-medium text-[#123B7A] hover:underline"
                        >
                          {
                            closure.complaintNumber
                          }
                        </button>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {
                          closure.customer
                            .name
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {
                          closure.dealer
                            .name
                        }
                      </td>

                      <td className="px-5 py-4">
                        <ClosureTypeBadge
                          type={
                            closure.closureType
                          }
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {
                          closure.proofs
                            .length
                        }
                      </td>

                      <td className="px-5 py-4">
                        <ClosureStatusBadge
                          status={
                            closure.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {
                          closure.closedBy
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {new Date(
                          closure.closedAt
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/complaints/${closure.complaintId}`
                            )
                          }
                          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye
                            size={17}
                          />
                        </button>
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

function ClosureTypeBadge({
  type,
}: {
  type: ClosureType;
}) {
  return (
    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
      {type}
    </span>
  );
}

function ClosureStatusBadge({
  status,
}: {
  status: ClosureStatus;
}) {
  const styles = {
    DRAFT:
      "border-gray-200 bg-gray-50 text-gray-600",

    SUBMITTED:
      "border-blue-200 bg-blue-50 text-blue-700",

    VERIFIED:
      "border-green-200 bg-green-50 text-green-700",

    REJECTED:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}