import {
  ArrowLeft,
  Building2,
  Phone,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAppSelector,
} from "../../../app/hooks";

import LedgerFilters from "../components/LedgerFilters";
import LedgerSummary from "../components/LedgerSummary";
import LedgerTable from "../components/LedgerTable";

import {
  getDealerLedger,
  getDealerLedgerSummary,
} from "../services/ledgerApi";

import type {
  DealerLedgerSummary,
  LedgerTransaction,
} from "../types/ledger.types";

export default function DealerLedgerPage() {
  const navigate =
    useNavigate();

  const {
    dealerId,
  } =
    useParams<{
      dealerId: string;
    }>();

  const {
    search,
    transactionType,
    status,
    dateFrom,
    dateTo,
  } = useAppSelector(
    (state) =>
      state.ledger
  );

  const [
    summary,
    setSummary,
  ] =
    useState<
      DealerLedgerSummary | null
    >(null);

  const [
    transactions,
    setTransactions,
  ] =
    useState<
      LedgerTransaction[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    if (!dealerId) {
      return;
    }

    const load =
      async () => {
        try {
          setLoading(true);

          const [
            summaryData,
            transactionData,
          ] =
            await Promise.all([
              getDealerLedgerSummary(
                dealerId
              ),

              getDealerLedger(
                dealerId
              ),
            ]);

          setSummary(
            summaryData ??
              null
          );

          setTransactions(
            transactionData
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, [dealerId]);

  const filtered =
    useMemo(
      () =>
        transactions.filter(
          (item) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              item.transactionNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              item.referenceNumber
                ?.toLowerCase()
                .includes(
                  query
                ) ||
              item.complaintNumber
                ?.toLowerCase()
                .includes(
                  query
                ) ||
              item.description
                .toLowerCase()
                .includes(
                  query
                );

            const matchesType =
              transactionType ===
                "ALL" ||
              item.transactionType ===
                transactionType;

            const matchesStatus =
              status === "ALL" ||
              item.status ===
                status;

            const itemDate =
              item.transactionDate.split(
                "T"
              )[0];

            const matchesFrom =
              !dateFrom ||
              itemDate >=
                dateFrom;

            const matchesTo =
              !dateTo ||
              itemDate <= dateTo;

            return (
              matchesSearch &&
              matchesType &&
              matchesStatus &&
              matchesFrom &&
              matchesTo
            );
          }
        ),
      [
        transactions,
        search,
        transactionType,
        status,
        dateFrom,
        dateTo,
      ]
    );

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading dealer ledger...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Dealer ledger not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(
            "/ledger"
          )
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft
          size={17}
        />

        Back to Ledger
      </button>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
              <Building2
                size={22}
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {
                  summary.dealer
                    .name
                }
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {
                  summary.dealer
                    .dealerCode
                }
              </p>
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-500">
            {summary.dealer
              .phone && (
              <div className="flex items-center gap-2">
                <Phone
                  size={15}
                />

                {
                  summary.dealer
                    .phone
                }
              </div>
            )}

            {summary.dealer
              .city && (
              <p>
                {
                  summary.dealer
                    .city
                }
              </p>
            )}
          </div>
        </div>
      </div>

      <LedgerSummary
        summary={summary}
      />

      <LedgerFilters />

      <LedgerTable
        transactions={
          filtered
        }
      />
    </div>
  );
}