import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleDollarSign,
  Landmark,
  WalletCards,
  Plus,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import DealerLedgerSearch from "../components/DealerLedgerSearch";
import OutstandingCard from "../components/OutstandingCard";
import AddPaymentModal from "../components/AddPaymentModal";
import { getDealerLedgerOverview } from "../services/ledgerApi";
import type { DealerLedgerSummary } from "../types/ledger.types";
import type {
  DealerLedgerOverviewItem,
  DealerLedgerOverviewSummary,
} from "../services/ledgerApi";

const emptyStats: DealerLedgerOverviewSummary = {
  totalDealers: 0,
  unpaidBillsCount: 0,
  unpaidBillsAmount: 0,
  currentOutstanding: 0,
  creditAmount: 0,
  securityDeposit: 0,
};

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Keep the existing OutstandingCard and DealerLedgerSearch data contract.
// Additional overview fields are carried along for optional display inside OutstandingCard.
export type OverviewDealerSummary = DealerLedgerSummary & {
  unpaidBillsCount: number;
  unpaidBillsAmount: number;
  currentOutstanding: number;
  creditAmount: number;

  securityDeposit: number;
  openingBalanceType: "DR" | "CR";
  openingBalance: number;
  creditLimit:number;
};

const toDealerSummary = (
  row: DealerLedgerOverviewItem,
): OverviewDealerSummary => ({
  dealer: {
    id: row.dealerId,
    name: row.dealerName || "-",
    dealerCode: row.headCode || "",
    phone: row.mobileNumber || "",
    city: "",
  },
  // Compatibility with the existing OutstandingCard props.
  // The running balance is NOT calculated from ledger transaction totals.
  totalDebit: row.currentOutstanding,
  totalCredit: row.creditAmount,
  outstanding: row.currentOutstanding - row.creditAmount,
  openingBalance: row.openingBalance,
  unpaidBillsCount: row.unpaidBillsCount,
  unpaidBillsAmount: row.unpaidBillsAmount,
  currentOutstanding: row.currentOutstanding,
  creditLimit:row.creditLimit,
  creditAmount: row.creditAmount,
  securityDeposit: row.securityDeposit,
  openingBalanceType: row.openingBalanceType,
});

export default function LedgerOverviewPage() {
  const [summaries, setSummaries] = useState<OverviewDealerSummary[]>([]);
  const [stats, setStats] = useState<DealerLedgerOverviewSummary>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);

      // The existing page shows all dealers as cards and passes them to
      // DealerLedgerSearch, so fetch all overview pages, not just the first 100.
      const first = await getDealerLedgerOverview({ page: 1, limit: 100 });
      const allRows = [...(first.data ?? [])];
      const totalPages = first.pagination?.totalPages ?? 1;

      for (let page = 2; page <= totalPages; page += 1) {
        const next = await getDealerLedgerOverview({ page, limit: 100 });
        allRows.push(...(next.data ?? []));
      }

      setSummaries(allRows.map(toDealerSummary));
      setStats(first.summary ?? emptyStats);
    } catch (error) {
      console.error("Failed to load dealer overview:", error);
      toast.error("Failed to load dealer ledger overview");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview, refreshKey]);

  const cards = useMemo(
    () => [
      {
        label: "Total Dealers",
        value: stats.totalDealers.toLocaleString("en-IN"),
        icon: Landmark,
      },
      {
        label: "Unpaid Bills",
        value: money(stats.unpaidBillsAmount),
        icon: ReceiptText,
      },
      {
        label: "Current Outstanding",
        value: money(stats.currentOutstanding),
        icon: CircleDollarSign,
      },
      {
        label: "Credit Amount",
        value: money(stats.creditAmount),
        icon: WalletCards,
      },
      {
        label: "Security Deposit",
        value: money(stats.securityDeposit),
        icon: ShieldCheck,
      },
    ],
    [stats],
  );

  if (loading && summaries.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading ledger...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header — unchanged */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dealer Ledger</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search dealers and monitor credits, payments and outstanding
            balances.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPaymentModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e3064]"
        >
          <Plus size={18} />
          Add Payment
        </button>
      </div>

      {/* Dealer Search — existing component */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Find Dealer</h2>
          <p className="mt-1 text-xs text-gray-500">
            Search and open a dealer's complete ledger.
          </p>
        </div>
        <DealerLedgerSearch dealers={summaries} />
      </div>

      {/* Stats — same card design, new totals */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-2 break-words text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dealer Outstanding — existing layout and cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Dealer Outstanding
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Current financial position of each dealer.
        </p>
      </div>

      {summaries.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No dealers found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summaries.map((summary) => (
            <OutstandingCard key={summary.dealer.id} summary={summary} />
          ))}
        </div>
      )}

      {showPaymentModal && (
        <AddPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            setRefreshKey((key) => key + 1);
          }}
        />
      )}
    </div>
  );
}
