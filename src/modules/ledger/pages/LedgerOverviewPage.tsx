import { useCallback, useEffect, useMemo, useState } from "react";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import {
  CircleDollarSign,
  Landmark,
  WalletCards,
  ReceiptText,
  BookPlus,
  RotateCcw,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

import OutstandingTable from "../components/OutstandingTable";
import { getDealerLedgerOverview } from "../services/ledgerApi";
import type { DealerLedgerSummary } from "../types/ledger.types";
import type {
  DealerLedgerOverviewItem,
  DealerLedgerOverviewSummary,
} from "../services/ledgerApi";

import { useNavigate } from "react-router-dom";

const emptyStats: DealerLedgerOverviewSummary = {
  totalDealers: 0,
  unpaidBillsCount: 0,
  unpaidBillsAmount: 0,
  currentOutstanding: 0,
  creditAmount: 0,
  securityDeposit: 0,
  openingBalance: 0,
};

// Same threshold the table uses to flag a high outstanding
const HIGH_OUTSTANDING = 2000;

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
  creditLimit: number;
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
  creditLimit: row.creditLimit ?? 0,
  creditAmount: row.creditAmount,
  securityDeposit: row.securityDeposit,
  openingBalanceType: row.openingBalanceType,
});

export default function LedgerOverviewPage() {
  const [summaries, setSummaries] = useState<OverviewDealerSummary[]>([]);
  const [stats, setStats] = useState<DealerLedgerOverviewSummary>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState("");
  const [billFilter, setBillFilter] = useState<
    "" | "UNPAID" | "CLEAR" | "HIGH"
  >("");
  const [balanceFilter, setBalanceFilter] = useState<"" | "DR" | "CR">("");
  const [depositFilter, setDepositFilter] = useState<"" | "YES" | "NO">("");
  const [sortBy, setSortBy] = useState<
    "NAME" | "OUTSTANDING_DESC" | "UNPAID_DESC" | "DEPOSIT_DESC"
  >("NAME");
    const navigate = useNavigate();

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
  }, [loadOverview]);

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
    ],
    [stats],
  );

  const filteredSummaries = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();

    const unpaidAmount = (item: OverviewDealerSummary) =>
      Number(item.unpaidBillsAmount ?? item.currentOutstanding ?? 0);

    const rows = summaries.filter((item) => {
      const { dealer } = item;

      if (
        query &&
        ![dealer.name, dealer.dealerCode, dealer.phone, dealer.city].some(
          (field) => String(field ?? "").toLowerCase().includes(query),
        )
      ) {
        return false;
      }

      if (billFilter === "UNPAID" && Number(item.unpaidBillsCount) <= 0) {
        return false;
      }

      if (billFilter === "CLEAR" && Number(item.unpaidBillsCount) > 0) {
        return false;
      }

      if (billFilter === "HIGH" && unpaidAmount(item) <= HIGH_OUTSTANDING) {
        return false;
      }

      if (balanceFilter && item.openingBalanceType !== balanceFilter) {
        return false;
      }

      if (depositFilter === "YES" && Number(item.securityDeposit) <= 0) {
        return false;
      }

      if (depositFilter === "NO" && Number(item.securityDeposit) > 0) {
        return false;
      }

      return true;
    });

    return [...rows].sort((a, b) => {
      switch (sortBy) {
        case "OUTSTANDING_DESC":
          return unpaidAmount(b) - unpaidAmount(a);
        case "UNPAID_DESC":
          return Number(b.unpaidBillsCount) - Number(a.unpaidBillsCount);
        case "DEPOSIT_DESC":
          return Number(b.securityDeposit) - Number(a.securityDeposit);
        default:
          return (a.dealer.name || "").localeCompare(b.dealer.name || "");
      }
    });
  }, [
    summaries,
    tableSearch,
    billFilter,
    balanceFilter,
    depositFilter,
    sortBy,
  ]);

  const hasActiveFilters = Boolean(
    tableSearch.trim() || billFilter || balanceFilter || depositFilter,
  );

  const resetFilters = () => {
    setTableSearch("");
    setBillFilter("");
    setBalanceFilter("");
    setDepositFilter("");
    setSortBy("NAME");
  };

  if (loading && summaries.length === 0) {
    return (
      <TableSkeleton />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header — unchanged */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dealer Ledger</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Add Ledger */}
          <button
            type="button"
onClick={() => navigate("/ledger/add-entry")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-4 py-2.5 text-sm font-semibold text-[#123B7A] transition hover:bg-blue-50"
          >
            <BookPlus size={18} />
            Add Ledger
          </button>
        </div>
      </div>

      {/* Stats — same card design, new totals */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Filters — match the table columns */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="relative md:col-span-2">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search dealer name, code or phone..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={billFilter}
            onChange={(e) => setBillFilter(e.target.value as typeof billFilter)}
            className={filterClass}
          >
            <option value="">All Bills</option>
            <option value="UNPAID">Has Unpaid Bills</option>
            <option value="CLEAR">No Unpaid Bills</option>
            <option value="HIGH">High Outstanding (&gt; ₹2,000)</option>
          </select>

          <select
            value={balanceFilter}
            onChange={(e) =>
              setBalanceFilter(e.target.value as typeof balanceFilter)
            }
            className={filterClass}
          >
            <option value="">All Balances</option>
            <option value="DR">Balance Dr</option>
            <option value="CR">Balance Cr</option>
          </select>

          <select
            value={depositFilter}
            onChange={(e) =>
              setDepositFilter(e.target.value as typeof depositFilter)
            }
            className={filterClass}
          >
            <option value="">Security Deposit: All</option>
            <option value="YES">Deposit Paid</option>
            <option value="NO">No Deposit</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={filterClass}
          >
            <option value="NAME">Sort: Dealer Name</option>
            <option value="OUTSTANDING_DESC">Sort: Highest Outstanding</option>
            <option value="UNPAID_DESC">Sort: Most Unpaid Bills</option>
            <option value="DEPOSIT_DESC">Sort: Highest Deposit</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredSummaries.length}
            </span>{" "}
            of {summaries.length} dealers
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {summaries.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No dealers found.
        </div>
      ) : filteredSummaries.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No dealers match the selected filters.
        </div>
      ) : (
        <OutstandingTable summaries={filteredSummaries} />
      )}
    </div>
  );
}

const filterClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100";
