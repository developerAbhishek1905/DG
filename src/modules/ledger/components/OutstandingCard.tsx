import { AlertTriangle, Building2, Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { DealerLedgerSummary } from "../types/ledger.types";

interface Props {
  summary: DealerLedgerSummary;
}

const formatAmount = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export default function OutstandingCard({ summary }: Props) {
  const navigate = useNavigate();

  const dealer = summary.dealer;

  const currentOutstanding = Number(
    summary.unpaidBillsAmount ?? summary.currentOutstanding ?? 0,
  );

  const unpaidBillsCount = Number(summary.unpaidBillsCount ?? 0);

  const openingBalance = Number(summary.openingBalance ?? 0);
  console.log(openingBalance);

  const balanceType = summary.openingBalanceType ?? "DR";

  const creditLimit = Number(summary.creditLimit ?? 0);

  const securityDeposit = Number(summary.securityDeposit ?? 0);

  const highOutstanding = currentOutstanding > 2000;

  const handleViewLedger = () => {
    if (!dealer?.id) return;

    navigate(`/ledger/${dealer.id}`);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border-2 border-[#6D28D9] bg-white p-5">
      {/* Dealer Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#6D28D9]">
            <Building2 size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {dealer?.name || "Unknown Dealer"}
            </p>

            <p className="mt-1 truncate text-xs text-gray-500">
              {dealer?.dealerCode || "-"}
            </p>
          </div>
        </div>

        {highOutstanding && (
          <div title="High outstanding">
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
        )}
      </div>

      {/* Current Outstanding */}

      <div className="mt-5">
        <p className="text-xs text-gray-500">Current Outstanding</p>

        <p
          className={`mt-1 text-2xl font-bold ${
            highOutstanding ? "text-amber-600" : "text-gray-900"
          }`}
        >
          {formatAmount(currentOutstanding)}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {unpaidBillsCount} unpaid {unpaidBillsCount === 1 ? "bill" : "bills"}
        </p>
      </div>

      {/* Balance / Credit Limit / Security Deposit */}

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Balance</p>

          <p className="mt-1 text-sm font-semibold text-gray-800">
            {formatAmount(openingBalance)}
            <span className="ml-1 text-xs">{summary.openingBalanceType}</span>
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Credit Limit</p>

          <p className="mt-1 text-sm font-semibold text-blue-700">
            {formatAmount(creditLimit)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Security Deposit</p>

          <p className="mt-1 text-sm font-semibold text-gray-800">
            {formatAmount(securityDeposit)}
          </p>
        </div>
      </div>

      {/* View Ledger */}

      <button
        type="button"
        disabled={!dealer?.id}
        onClick={handleViewLedger}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Eye size={16} />
        View Ledger
      </button>
    </div>
  );
}
