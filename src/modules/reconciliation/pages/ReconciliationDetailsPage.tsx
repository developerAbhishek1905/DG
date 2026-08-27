import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DifferenceCard from "../components/DifferenceCard";
import ReconcileModal from "../components/ReconcileModal";

import {
  getReconciliationById,
  markAsMatched,
  reconcileDifference,
} from "../services/reconciliationApi";

import type {
  Reconciliation,
  ReconcilePayload,
} from "../types/reconciliation.types";

export default function ReconciliationDetailsPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [
    reconciliation,
    setReconciliation,
  ] =
    useState<
      Reconciliation | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    modalOpen,
    setModalOpen,
  ] =
    useState(false);

  const [
    reconciling,
    setReconciling,
  ] =
    useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const load =
      async () => {
        try {
          setLoading(true);

          const data =
            await getReconciliationById(
              id
            );

          setReconciliation(
            data
              ? { ...data }
              : null
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, [id]);

  const handleReconcile =
    async (
      payload: ReconcilePayload
    ) => {
      try {
        setReconciling(
          true
        );

        const updated =
          await reconcileDifference(
            payload
          );

        setReconciliation({
          ...updated,
        });

        setModalOpen(
          false
        );
      } finally {
        setReconciling(
          false
        );
      }
    };

  const handleMarkMatched =
    async () => {
      if (
        !reconciliation
      ) {
        return;
      }

      const updated =
        await markAsMatched(
          reconciliation.id
        );

      setReconciliation({
        ...updated,
      });
    };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading reconciliation...
      </div>
    );
  }

  if (!reconciliation) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Reconciliation record not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <button
          onClick={() =>
            navigate(
              "/reconciliation"
            )
          }
          className="inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft
            size={17}
          />

          Back to Reconciliation
        </button>

        {reconciliation.status ===
          "MISMATCH" && (
          <button
            onClick={() =>
              setModalOpen(
                true
              )
            }
            className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white"
          >
            Reconcile Difference
          </button>
        )}

        {reconciliation.status ===
          "PENDING" &&
          reconciliation.difference ===
            0 && (
            <button
              onClick={
                handleMarkMatched
              }
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white"
            >
              <CheckCircle2
                size={17}
              />

              Mark as Matched
            </button>
          )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div>
            <p className="text-xs font-semibold uppercase text-[#123B7A]">
              Reconciliation
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {
                reconciliation.reconciliationNumber
              }
            </h1>
          </div>

          <StatusBadge
            status={
              reconciliation.status
            }
          />
        </div>

        <div className="mt-6 grid gap-5 border-t pt-6 md:grid-cols-2">
          <div className="flex gap-3">
            <Building2
              size={18}
              className="text-gray-400"
            />

            <div>
              <p className="text-xs text-gray-500">
                Dealer
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {
                  reconciliation.dealer
                    .name
                }
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {
                  reconciliation.dealer
                    .dealerCode
                }
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CalendarDays
              size={18}
              className="text-gray-400"
            />

            <div>
              <p className="text-xs text-gray-500">
                Period
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(
                  reconciliation.periodFrom
                )}

                {" - "}

                {formatDate(
                  reconciliation.periodTo
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DifferenceCard
        expected={
          reconciliation.expectedClosingBalance
        }
        actual={
          reconciliation.actualClosingBalance
        }
        difference={
          reconciliation.difference
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Financial Breakdown
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AmountItem
            label="Opening Balance"
            value={
              reconciliation.openingBalance
            }
          />

          <AmountItem
            label="Approved Bills"
            value={
              reconciliation.totalBillAmount
            }
          />

          <AmountItem
            label="Ledger Credits"
            value={
              reconciliation.totalLedgerCredits
            }
          />

          <AmountItem
            label="Successful Payments"
            value={
              reconciliation.totalPayments
            }
          />

          <AmountItem
            label="Ledger Debits"
            value={
              reconciliation.totalLedgerDebits
            }
          />

          <AmountItem
            label="Actual Closing Balance"
            value={
              reconciliation.actualClosingBalance
            }
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Reconciliation Analysis
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Info
            label="Difference Type"
            value={reconciliation.differenceType.replaceAll(
              "_",
              " "
            )}
          />

          <Info
            label="Created By"
            value={
              reconciliation.createdBy
            }
          />

          {reconciliation.reconciledBy && (
            <Info
              label="Reconciled By"
              value={
                reconciliation.reconciledBy
              }
            />
          )}

          {reconciliation.reconciledAt && (
            <Info
              label="Reconciled At"
              value={new Date(
                reconciliation.reconciledAt
              ).toLocaleString(
                "en-IN"
              )}
            />
          )}
        </div>

        {reconciliation.remarks && (
          <div className="mt-6 border-t pt-5">
            <p className="text-xs text-gray-500">
              System Remarks
            </p>

            <p className="mt-2 text-sm text-gray-700">
              {
                reconciliation.remarks
              }
            </p>
          </div>
        )}

        {reconciliation.reconciliationNote && (
          <div className="mt-5 rounded-lg bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600">
              Reconciliation Note
            </p>

            <p className="mt-2 text-sm text-blue-800">
              {
                reconciliation.reconciliationNote
              }
            </p>
          </div>
        )}
      </div>

      <ReconcileModal
        open={modalOpen}
        reconciliation={
          reconciliation
        }
        loading={
          reconciling
        }
        onClose={() =>
          setModalOpen(
            false
          )
        }
        onReconcile={
          handleReconcile
        }
      />
    </div>
  );
}

function AmountItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-gray-900">
        ₹
        {value.toLocaleString(
          "en-IN"
        )}
      </p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    Reconciliation["status"];
}) {
  const styles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",

    MATCHED:
      "border-green-200 bg-green-50 text-green-700",

    MISMATCH:
      "border-red-200 bg-red-50 text-red-700",

    RECONCILED:
      "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`h-fit rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(
  date: string
) {
  return new Date(
    date
  ).toLocaleDateString(
    "en-IN"
  );
}