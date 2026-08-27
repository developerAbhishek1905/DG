import {
  BarChart3,
  RotateCcw,
  Search,
} from "lucide-react";

import {
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

import PendingTable from "../components/PendingTable";
import SLAStats from "../components/SLAStats";

import {
  usePendingComplaints,
} from "../hooks/usePendingComplaints";

import {
  clearPendingFilters,
  setPendingReason,
  setPendingSearch,
  setPendingSLAStatus,
  setPendingStatus,
} from "../store/pendingSlice";

import {
  sendPendingReminder,
  updatePendingAction,
} from "../services/pendingApi";

import type {
  PendingAction,
  PendingComplaint,
  PendingReason,
  PendingStatus,
  SLAStatus,
} from "../types/pending.types";

export default function PendingListPage() {
  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  const {
    pendingComplaints,
    loading,
    refetch,
  } =
    usePendingComplaints();

  const {
    search,
    reason,
    slaStatus,
    status,
  } = useAppSelector(
    (state) =>
      state.pending
  );

  const [
    actionComplaint,
    setActionComplaint,
  ] =
    useState<
      PendingComplaint | null
    >(null);

  const filtered =
    useMemo(
      () =>
        pendingComplaints.filter(
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
              item.customer.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              item.dealer.name
                .toLowerCase()
                .includes(
                  query
                );

            const matchesReason =
              reason === "ALL" ||
              item.reason ===
                reason;

            const matchesSLA =
              slaStatus ===
                "ALL" ||
              item.slaStatus ===
                slaStatus;

            const matchesStatus =
              status === "ALL" ||
              item.status ===
                status;

            return (
              matchesSearch &&
              matchesReason &&
              matchesSLA &&
              matchesStatus
            );
          }
        ),
      [
        pendingComplaints,
        search,
        reason,
        slaStatus,
        status,
      ]
    );

  const handleReminder =
    async (
      id: string
    ) => {
      await sendPendingReminder(
        id
      );

      await refetch();
    };

  const handleAction =
    async (
      action: PendingAction
    ) => {
      if (!actionComplaint) {
        return;
      }

      await updatePendingAction({
        pendingId:
          actionComplaint.id,

        action,
      });

      setActionComplaint(
        null
      );

      await refetch();
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pending & SLA
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor pending complaints and SLA deadlines.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/pending/sla"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <BarChart3
            size={17}
          />

          SLA Overview
        </button>
      </div>

      <SLAStats
        complaints={
          pendingComplaints
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) =>
                dispatch(
                  setPendingSearch(
                    event.target.value
                  )
                )
              }
              placeholder="Search complaint, customer or dealer..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
            />
          </div>

          <select
            value={reason}
            onChange={(event) =>
              dispatch(
                setPendingReason(
                  event.target.value as
                    | PendingReason
                    | "ALL"
                )
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <option value="ALL">
              All Reasons
            </option>

            <option value="WAITING_FOR_CUSTOMER">
              Waiting for Customer
            </option>

            <option value="PRODUCT_INSPECTION_PENDING">
              Product Inspection Pending
            </option>

            <option value="SPARE_PARTS_NOT_AVAILABLE">
              Spare Parts Not Available
            </option>

            <option value="DEALER_UNAVAILABLE">
              Dealer Unavailable
            </option>
          </select>

          <select
            value={slaStatus}
            onChange={(event) =>
              dispatch(
                setPendingSLAStatus(
                  event.target.value as
                    | SLAStatus
                    | "ALL"
                )
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <option value="ALL">
              All SLA
            </option>

            <option value="SAFE">
              Within SLA
            </option>

            <option value="WARNING">
              SLA Warning
            </option>

            <option value="BREACHED">
              SLA Breached
            </option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              dispatch(
                setPendingStatus(
                  event.target.value as
                    | PendingStatus
                    | "ALL"
                )
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="RESOLVED">
              Resolved
            </option>

            <option value="ESCALATED">
              Escalated
            </option>

            <option value="REASSIGNED">
              Reassigned
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <button
            onClick={() =>
              dispatch(
                clearPendingFilters()
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600"
          >
            <RotateCcw
              size={16}
            />

            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading pending complaints...
        </div>
      ) : (
        <PendingTable
          complaints={
            filtered
          }
          onReminder={
            handleReminder
          }
          onAction={
            setActionComplaint
          }
        />
      )}

      {actionComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              DG Team Action
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {
                actionComplaint.complaintNumber
              }
            </p>

            <div className="mt-6 grid gap-3">
              <ActionButton
                label="Continue Pending"
                onClick={() =>
                  handleAction(
                    "CONTINUE"
                  )
                }
              />

              <ActionButton
                label="Resolve"
                onClick={() =>
                  handleAction(
                    "RESOLVE"
                  )
                }
              />

              <ActionButton
                label="Reassign Dealer"
                onClick={() =>
                  handleAction(
                    "REASSIGN"
                  )
                }
              />

              <ActionButton
                label="Escalate"
                onClick={() =>
                  handleAction(
                    "ESCALATE"
                  )
                }
              />

              <ActionButton
                label="Cancel Complaint"
                onClick={() =>
                  handleAction(
                    "CANCEL"
                  )
                }
                danger
              />
            </div>

            <button
              onClick={() =>
                setActionComplaint(
                  null
                )
              }
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