import { AlertTriangle, Eye } from "lucide-react";
import { usePermission } from "../../../hooks/usePermission";
import { useNavigate } from "react-router-dom";

import type { DealerLedgerSummary } from "../types/ledger.types";

interface Props {
  summaries: DealerLedgerSummary[];
}

const formatAmount = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const HIGH_OUTSTANDING = 2000;

const headings = [
  { label: "Dealer", align: "text-left" },
  { label: "City", align: "text-left" },
  { label: "Unpaid Bills", align: "text-right" },
  { label: "Current Outstanding", align: "text-right" },
  { label: "Balance", align: "text-right" },
  { label: "Credit Limit", align: "text-right" },
  { label: "Security Deposit", align: "text-right" },
  { label: "Action", align: "text-center" },
];

export default function OutstandingTable({ summaries }: Props) {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              {headings.map((heading) => (
                <th
                  key={heading.label}
                  className={`px-4 py-3 font-semibold ${heading.align}`}
                >
                  {heading.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {summaries.map((summary) => {
              const dealer = summary.dealer;

              const outstanding = Number(
                summary.unpaidBillsAmount ?? summary.currentOutstanding ?? 0,
              );

              const unpaidCount = Number(summary.unpaidBillsCount ?? 0);
              const high = outstanding > HIGH_OUTSTANDING;

              return (
                <tr key={dealer?.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">
                      {dealer?.name || "Unknown Dealer"}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {[dealer?.firmName, dealer?.dealerCode]
                        .filter(Boolean)
                        .join(" · ") || "-"}
                    </p>
                  </td>

                  <td className="min-w-[120px] px-4 py-3 text-gray-700">
                    {dealer?.city || "-"}
                  </td>

                  <td className="px-4 py-3 text-right text-gray-700">
                    {unpaidCount}
                  </td>

                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      high ? "text-amber-600" : "text-gray-900"
                    }`}
                  >
                    <span className="inline-flex items-center justify-end gap-1.5">
                      {high && (
                        <span title="High outstanding">
                          <AlertTriangle size={14} className="text-amber-500" />
                        </span>
                      )}
                      {formatAmount(outstanding)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {formatAmount(Number(summary.openingBalance ?? 0))}
                    <span className="ml-1 text-xs text-gray-500">
                      {summary.openingBalanceType ?? "DR"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-blue-700">
                    {formatAmount(Number(summary.creditLimit ?? 0))}
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {formatAmount(Number(summary.securityDeposit ?? 0))}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {hasPermission("ledger.dealer.view") && (
                    <button
                      type="button"
                      disabled={!dealer?.id}
                      onClick={() => navigate(`/ledger/${dealer.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Eye size={14} />
                      View Ledger
                    </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
