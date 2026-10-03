import {
  BarChart3,
  RotateCcw,
  Search,
  Clock,
  Phone,
  MapPin,
  UserRound,
  SearchCheck,
  PackageX,
  UserX,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import PendingTable from "../components/PendingTable";
import SLAStats from "../components/SLAStats";

import {
  getPendingComplaints,
  // sendPendingReminder,
  // updatePendingAction,
} from "../services/pendingApi";

import type {
  PendingAction,
  PendingComplaint,
  PendingReason,
  PendingStatus,
  SLAStatus,
} from "../types/pending.types";
import SummaryCard from "../../../components/ui/SummaryCard";
export interface ComplaintStatusSummary {
  total: number;

  statusCounts: Record<string, number>;
}

export interface ComplaintSummary {
  total: number;

  statusCounts: Record<string, number>;

  reasonCounts: Record<string, number>;
}

export interface PendingSummary {
  total: number;

  statusCounts: {
    PENDING_ON_CALL: number;
    PENDING_ON_VISIT: number;
  };
}

export default function PendingListPage() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const [pendingComplaints, setPendingComplaints] = useState<
    PendingComplaint[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    total: 0,

    statusCounts: {
      PENDING_ON_CALL: 0,
      PENDING_ON_VISIT: 0,
    },

    reasonCounts: {} as Record<string, number>,
  });

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [reason, setReason] = useState<PendingReason | "ALL">("ALL");

  const [slaStatus, setSlaStatus] = useState<SLAStatus | "ALL">("ALL");

  const [status, setStatus] = useState<PendingStatus | "ALL">("ALL");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [dealerId, setDealerId] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Action Modal
  |--------------------------------------------------------------------------
  */

  const [actionComplaint, setActionComplaint] =
    useState<PendingComplaint | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Debounce Search
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Pending Complaints
  |--------------------------------------------------------------------------
  */

  const fetchPendingComplaints = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getPendingComplaints({
        page,
        limit,
        search: debouncedSearch,
        startDate,
        endDate,
        dealerId,
      });

      setPendingComplaints(response.data || []);

      setSummary({
        total: response.summary?.total || 0,

        statusCounts: {
          PENDING_ON_CALL: response.summary?.statusCounts?.PENDING_ON_CALL || 0,

          PENDING_ON_VISIT:
            response.summary?.statusCounts?.PENDING_ON_VISIT || 0,
        },

        reasonCounts: response.summary?.reasonCounts || {},
      });

      setTotal(response.pagination?.total || response.data?.length || 0);

      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch pending complaints", error);

      setPendingComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, startDate, endDate, dealerId]);

  useEffect(() => {
    fetchPendingComplaints();
  }, [fetchPendingComplaints]);

  /*
  |--------------------------------------------------------------------------
  | Initial / Filter Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchPendingComplaints();
  }, [fetchPendingComplaints]);

  /*
  |--------------------------------------------------------------------------
  | Reminder
  |--------------------------------------------------------------------------
  */

  const handleReminder = async (id: string) => {
    try {
      await sendPendingReminder(id);

      await fetchPendingComplaints();
    } catch (error) {
      console.error("Failed to send reminder:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Action
  |--------------------------------------------------------------------------
  */

  const handleAction = async (action: PendingAction) => {
    if (!actionComplaint) {
      return;
    }

    try {
      await updatePendingAction({
        pendingId: actionComplaint.id,
        action,
      });

      setActionComplaint(null);

      await fetchPendingComplaints();
    } catch (error) {
      console.error("Failed to update pending complaint:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Filters
  |--------------------------------------------------------------------------
  */

  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");

    setReason("ALL");

    setSlaStatus("ALL");

    setStatus("ALL");

    setStartDate("");

    setEndDate("");

    setDealerId("");

    setPage(1);
    setLimit(10);
  };

  /*
  |--------------------------------------------------------------------------
  | Filter change helpers
  |--------------------------------------------------------------------------
  */

  const handleReasonChange = (value: PendingReason | "ALL") => {
    setReason(value);
    setPage(1);
  };

  const handleSLAChange = (value: SLAStatus | "ALL") => {
    setSlaStatus(value);
    setPage(1);
  };

  const handleStatusChange = (value: PendingStatus | "ALL") => {
    setStatus(value);
    setPage(1);
  };

  const reasonColors = [
    "green",
    "red",
    "yellow",
    "pink",
    "cyan",
    "indigo",
    "orange",
    "purple",
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending & SLA</h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor pending complaints and SLA deadlines.
          </p>
        </div>

        {/* <button
          onClick={() => navigate("/pending/sla")}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <BarChart3 size={17} />
          SLA Overview
        </button> */}
      </div>
      {/* Summary Cards */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Total */}

        <SummaryCard label="Total Pending" count={summary.total} color="blue" />

        {/* Status Counts */}

        <SummaryCard
          label="Pending On Call"
          count={summary.statusCounts.PENDING_ON_CALL}
          color="orange"
        />

        <SummaryCard
          label="Pending On Visit"
          count={summary.statusCounts.PENDING_ON_VISIT}
          color="purple"
        />

        {/* Reason Counts */}

        {Object.entries(summary.reasonCounts).map(([reason, count], index) => (
          <SummaryCard
            key={reason}
            label={reason
              .replaceAll("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())}
            count={count}
            color={reasonColors[index % reasonColors.length]}
          />
        ))}
      </div>
      {/* 
     

      {/* Stats */}

      {/* <SLAStats complaints={pendingComplaints} /> */}

      {/* Filters */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search complaint, customer..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
            />
          </div>

          {/* Start Date */}

          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value);

              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          />

          {/* End Date */}

          <input
            type="date"
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value);

              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          />

          {/* Dealer */}

          <input
            value={dealerId}
            onChange={(event) => {
              setDealerId(event.target.value);

              setPage(1);
            }}
            placeholder="Dealer ID"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          />

          {/* Reason */}

          <select
            value={reason}
            onChange={(event) =>
              handleReasonChange(event.target.value as PendingReason | "ALL")
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <option value="ALL">All Reasons</option>

            <option value="WAITING_FOR_CUSTOMER">Waiting for Customer</option>

            <option value="PRODUCT_INSPECTION_PENDING">
              Product Inspection Pending
            </option>

            <option value="SPARE_PARTS_NOT_AVAILABLE">
              Spare Parts Not Available
            </option>

            <option value="DEALER_UNAVAILABLE">Dealer Unavailable</option>
          </select>

          {/* SLA */}

          <select
            value={slaStatus}
            onChange={(event) =>
              handleSLAChange(event.target.value as SLAStatus | "ALL")
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <option value="ALL">All SLA</option>

            <option value="SAFE">Within SLA</option>

            <option value="WARNING">SLA Warning</option>

            <option value="BREACHED">SLA Breached</option>
          </select>

          {/* Status */}

          <select
            value={status}
            onChange={(event) =>
              handleStatusChange(event.target.value as PendingStatus | "ALL")
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <option value="ALL">All Status</option>

            <option value="PENDING">Pending</option>

            <option value="RESOLVED">Resolved</option>

            <option value="ESCALATED">Escalated</option>

            <option value="REASSIGNED">Reassigned</option>

            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Reset */}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
          Loading pending complaints...
        </div>
      ) : (
        <>
          {/* <PendingTable
            complaints={pendingComplaints}
            onReminder={handleReminder}
            onAction={setActionComplaint}
          /> */}

          <PendingTable
            complaints={pendingComplaints}
            onRefresh={fetchPendingComplaints}
          />

          {/* Pagination */}

          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row">
            <div className="text-sm text-gray-500">
              Total: <span className="font-medium text-gray-900">{total}</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));

                  setPage(1);
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value={10}>10</option>

                <option value={20}>20</option>

                <option value={50}>50</option>

                <option value={100}>100</option>
              </select>

              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="min-w-[100px] text-center text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Action Modal */}

      {actionComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              DG Team Action
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {actionComplaint.complaintNumber}
            </p>

            <div className="mt-6 grid gap-3">
              <ActionButton
                label="Continue Pending"
                onClick={() => handleAction("CONTINUE")}
              />

              <ActionButton
                label="Resolve"
                onClick={() => handleAction("RESOLVE")}
              />

              <ActionButton
                label="Reassign Dealer"
                onClick={() => handleAction("REASSIGN")}
              />

              <ActionButton
                label="Escalate"
                onClick={() => handleAction("ESCALATE")}
              />

              <ActionButton
                label="Cancel Complaint"
                onClick={() => handleAction("CANCEL")}
                danger
              />
            </div>

            <button
              type="button"
              onClick={() => setActionComplaint(null)}
              className="mt-5 w-full rounded-lg border border-gray-300 py-2.5 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-3 text-left text-sm font-medium ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
