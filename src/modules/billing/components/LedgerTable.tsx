import { CheckCircle2, Eye } from "lucide-react";

import type { DealerLedger } from "../types/billing.types";

interface Props {
  ledgers: DealerLedger[];

  loading?: boolean;

  approvingId?: string | null;

  onApprove?: (ledger: DealerLedger) => void;

  onView?: (ledger: DealerLedger) => void;
}

export default function LedgerTable({
  ledgers,
  loading = false,
  approvingId,
  onApprove,
  onView,
}: Props) {
  const formatAmount = (value?: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700";

      case "PENDING":
        return "bg-yellow-50 text-yellow-700";

      case "BILLED":
        return "bg-blue-50 text-blue-700";

      case "REVERSED":
        return "bg-purple-50 text-purple-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getBillingTypeLabel = (type: string) => {
    switch (type) {
      case "FIXED":
        return "Fixed";

      case "PARTIAL_PAYMENT":
        return "Partial Payment";

      case "PROFIT_SHARING":
        return "Profit Sharing";

      case "CANCELLATION":
        return "Cancellation";

      case "OPENING_BALANCE":
        return "Opening Balance";

      case "ADJUSTMENT":
        return "Adjustment";

      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading ledger...
      </div>
    );
  }

  if (!ledgers.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-700">
          No ledger records found
        </p>

        <p className="mt-1 text-xs text-gray-400">Try changing your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1300px] w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Date
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Complaint
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Dealer
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Product
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Category
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Billing Type
              </th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                Customer Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                Profit Amount
              </th>


              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                %
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                Amount
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                Status
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {ledgers.map((ledger) => {
              const dealer =
                typeof ledger.dealerId === "object" ? ledger.dealerId : null;

              return (
                <tr key={ledger._id} className="transition hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600">
                    {formatDate(ledger.billingDate || ledger.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    <p className="whitespace-nowrap text-sm font-semibold text-[#123B7A]">
                      {ledger.complaintNumber || "-"}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {ledger.transactionType}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="whitespace-nowrap text-sm font-medium text-gray-800">
                      {ledger.dealerName ||
                        dealer?.technicianFirmName ||
                        dealer?.technicianName ||
                        "-"}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {ledger.dealerCode || dealer?.headCode || "-"}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ledger.productName || "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ledger.category || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span className="whitespace-nowrap text-xs font-medium text-gray-700">
                      {getBillingTypeLabel(ledger.billingType)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right text-sm text-gray-600">
                    {formatAmount(ledger.calculation.customerAmount)}
                  </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">
                    {formatAmount(ledger.calculation.profitAmount)}
                  </td>

                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {ledger.percentage || 0}%
                  </td>

                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {formatAmount(ledger.amount)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        ledger.status,
                      )}`}
                    >
                      {ledger.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {onView && (
                        <button
                          type="button"
                          title="View Ledger"
                          onClick={() => onView(ledger)}
                          className="rounded-lg p-2 text-[#123B7A] transition hover:bg-blue-50"
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      {ledger.status === "PENDING" && onApprove && (
                        <button
                          type="button"
                          title="Approve Ledger"
                          disabled={approvingId === ledger._id}
                          onClick={() => onApprove(ledger)}
                          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
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
