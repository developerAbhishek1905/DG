import {
  AlertTriangle,
  CircleDollarSign,
  Landmark,
  WalletCards,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import OutstandingCard from "../components/OutstandingCard";

import {
  getAllDealerLedgerSummaries,
  getLedgerOverviewStats,
} from "../services/ledgerApi";

import type {
  DealerLedgerSummary,
  LedgerOverviewStats,
} from "../types/ledger.types";

import DealerLedgerSearch from "../components/DealerLedgerSearch";

export default function LedgerOverviewPage() {
  const [
    stats,
    setStats,
  ] =
    useState<
      LedgerOverviewStats | null
    >(null);

  const [
    summaries,
    setSummaries,
  ] =
    useState<
      DealerLedgerSummary[]
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

          const [
            statsData,
            summaryData,
          ] =
            await Promise.all([
              getLedgerOverviewStats(),
              getAllDealerLedgerSummaries(),
            ]);

          setStats(
            statsData
          );

          setSummaries(
            summaryData
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, []);

  if (
    loading ||
    !stats
  ) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading ledger...
      </div>
    );
  }

  const cards = [
    {
      label:
        "Total Dealers",

      value:
        stats.totalDealers,

      icon:
        Landmark,
    },

    {
      label:
        "Total Outstanding",

      value: `₹${stats.totalOutstanding.toLocaleString(
        "en-IN"
      )}`,

      icon:
        CircleDollarSign,
    },

    {
      label:
        "Total Credits",

      value: `₹${stats.totalCredits.toLocaleString(
        "en-IN"
      )}`,

      icon:
        WalletCards,
    },

    {
      label:
        "High Outstanding",

      value: `₹${stats.overdueOutstanding.toLocaleString(
        "en-IN"
      )}`,

      icon:
        AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dealer Ledger
        </h1>

        <p className="mt-1 text-sm text-gray-500">
      Search dealers and monitor credits, payments
      and outstanding balances.
    </p>
      </div>
       {/* Dealer Search */}
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <div className="mb-3">
      <h2 className="text-sm font-semibold text-gray-900">
        Find Dealer
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        Search and open a dealer's complete ledger.
      </p>
    </div>

    <DealerLedgerSearch
      dealers={summaries}
    />
  </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <div
                key={
                  card.label
                }
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {
                        card.label
                      }
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {
                        card.value
                      }
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                    <Icon
                      size={21}
                    />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Dealer Outstanding
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current financial position of each dealer.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaries.map(
          (summary) => (
            <OutstandingCard
              key={
                summary.dealer.id
              }
              summary={
                summary
              }
            />
          )
        )}
      </div>
    </div>
  );
}