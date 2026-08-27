import {
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import SLAAlertCard from "../components/SLAAlertCard";
import SLAStats from "../components/SLAStats";

import {
  usePendingComplaints,
} from "../hooks/usePendingComplaints";

import {
  sendPendingReminder,
} from "../services/pendingApi";

export default function SLAOverviewPage() {
  const navigate =
    useNavigate();

  const {
    pendingComplaints,
    loading,
    refetch,
  } =
    usePendingComplaints();

  const breached =
    pendingComplaints.filter(
      (item) =>
        item.status ===
          "PENDING" &&
        item.slaStatus ===
          "BREACHED"
    );

  const warning =
    pendingComplaints.filter(
      (item) =>
        item.status ===
          "PENDING" &&
        item.slaStatus ===
          "WARNING"
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

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading SLA overview...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(
            "/pending"
          )
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft
          size={17}
        />

        Back to Pending
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          SLA Overview
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor complaints approaching or exceeding SLA deadlines.
        </p>
      </div>

      <SLAStats
        complaints={
          pendingComplaints
        }
      />

      <div>
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle
            size={19}
            className="text-red-600"
          />

          <h2 className="text-lg font-semibold text-gray-900">
            SLA Breached
          </h2>

          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            {breached.length}
          </span>
        </div>

        {breached.length ? (
          <div className="space-y-3">
            {breached.map(
              (complaint) => (
                <SLAAlertCard
                  key={
                    complaint.id
                  }
                  complaint={
                    complaint
                  }
                  onReminder={
                    handleReminder
                  }
                  onAction={() =>
                    navigate(
                      "/pending"
                    )
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No breached SLA complaints.
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            SLA Warning
          </h2>

          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            {warning.length}
          </span>
        </div>

        {warning.length ? (
          <div className="space-y-3">
            {warning.map(
              (complaint) => (
                <SLAAlertCard
                  key={
                    complaint.id
                  }
                  complaint={
                    complaint
                  }
                  onReminder={
                    handleReminder
                  }
                  onAction={() =>
                    navigate(
                      "/pending"
                    )
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No complaints currently in SLA warning.
          </div>
        )}
      </div>
    </div>
  );
}