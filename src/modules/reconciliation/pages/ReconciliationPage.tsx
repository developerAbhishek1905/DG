import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import ReconciliationSummary from "../components/ReconciliationSummary";
import ReconciliationTable from "../components/ReconciliationTable";

import {
  getReconciliations,
  getReconciliationSummary,
} from "../services/reconciliationApi";

import {
  clearReconciliationFilters,
  setReconciliationDateFrom,
  setReconciliationDateTo,
  setReconciliationSearch,
  setReconciliationStatus,
} from "../store/reconciliationSlice";

import type {
  Reconciliation,
  ReconciliationStatus,
  ReconciliationSummaryData,
} from "../types/reconciliation.types";

export default function ReconciliationPage() {
  const dispatch =
    useAppDispatch();

  const {
    search,
    status,
    dateFrom,
    dateTo,
  } = useAppSelector(
    (state) =>
      state.reconciliation
  );

  const [
    records,
    setRecords,
  ] =
    useState<
      Reconciliation[]
    >([]);

  const [
    summary,
    setSummary,
  ] =
    useState<
      ReconciliationSummaryData | null
    >(null);

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

          const [
            recordsData,
            summaryData,
          ] =
            await Promise.all([
              getReconciliations(),
              getReconciliationSummary(),
            ]);

          setRecords(
            recordsData
          );

          setSummary(
            summaryData
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, []);

  const filtered =
    useMemo(
      () =>
        records.filter(
          (item) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              item.reconciliationNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              item.dealer.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              item.dealer.dealerCode
                .toLowerCase()
                .includes(
                  query
                );

            const matchesStatus =
              status === "ALL" ||
              item.status ===
                status;

            const matchesFrom =
              !dateFrom ||
              item.periodFrom >=
                dateFrom;

            const matchesTo =
              !dateTo ||
              item.periodTo <=
                dateTo;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesFrom &&
              matchesTo
            );
          }
        ),
      [
        records,
        search,
        status,
        dateFrom,
        dateTo,
      ]
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Reconciliation
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Compare billing,
          ledger and payment
          balances and resolve
          financial differences.
        </p>
      </div>

      {summary && (
        <ReconciliationSummary
          summary={summary}
        />
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(
                event
              ) =>
                dispatch(
                  setReconciliationSearch(
                    event.target
                      .value
                  )
                )
              }
              placeholder="Search reconciliation, dealer name or code..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
            />
          </div>

          <select
            value={status}
            onChange={(
              event
            ) =>
              dispatch(
                setReconciliationStatus(
                  event.target
                    .value as
                    | ReconciliationStatus
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

            <option value="MATCHED">
              Matched
            </option>

            <option value="MISMATCH">
              Mismatch
            </option>

            <option value="RECONCILED">
              Reconciled
            </option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(
              event
            ) =>
              dispatch(
                setReconciliationDateFrom(
                  event.target
                    .value
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(
              event
            ) =>
              dispatch(
                setReconciliationDateTo(
                  event.target
                    .value
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />

          <button
            onClick={() =>
              dispatch(
                clearReconciliationFilters()
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
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading reconciliation...
        </div>
      ) : (
        <ReconciliationTable
          reconciliations={
            filtered
          }
        />
      )}
    </div>
  );
}