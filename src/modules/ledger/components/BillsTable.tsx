import { CheckCircle2, Eye } from "lucide-react";
import type { DealerLedger } from "../types/billing.types";

interface Props {
  transactions: DealerLedger[];
  loading?: boolean;
  approvingId?: string | null;
  onApprove?: (ledger: DealerLedger) => void;
  onView?: (ledger: DealerLedger) => void;
}

const formatAmount = (amount?: number) =>
  Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const formatDate = (date?: string) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
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
      return "bg-amber-50 text-amber-700";
    case "BILLED":
      return "bg-blue-50 text-blue-700";
    case "REVERSED":
      return "bg-purple-50 text-purple-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getBillingTypeLabel = (type?: string) => {
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
      return type || "-";
  }
};

export default function BillsTable({
  transactions,
  loading = false,
  approvingId = null,
  onApprove,
  onView,
}: Props) {
  const headerClass =
    "whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-gray-500";

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading bills...
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No bills found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1450px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={headerClass}>Date</th>
              <th className={headerClass}>Complaint</th>
              <th className={headerClass}>Transaction</th>
              <th className={headerClass}>Product</th>
              <th className={headerClass}>Category</th>
              <th className={headerClass}>Billing Type</th>
              <th className={`${headerClass} text-right`}>
                Base Amount
              </th>
              <th className={`${headerClass} text-right`}>%</th>
              <th className={`${headerClass} text-right`}>Debit</th>
              <th className={`${headerClass} text-right`}>Credit</th>
              <th className={headerClass}>Status</th>
              <th className={`${headerClass} text-center`}>Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {transactions.map((ledger) => {
              const debit =
                ledger.entryType === "DEBIT"
                  ? Number(ledger.amount || 0)
                  : 0;

              const credit =
                ledger.entryType === "CREDIT"
                  ? Number(ledger.amount || 0)
                  : 0;

              return (
                <tr
                  key={ledger._id}
                  className="transition hover:bg-gray-50"
                >
                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {formatDate(ledger.billingDate || ledger.createdAt)}
                  </td>

                  {/* Complaint */}
                  <td className="px-4 py-4">
                    <p className="whitespace-nowrap text-sm font-medium text-[#123B7A]">
                      {ledger.complaintNumber || "-"}
                    </p>
                  </td>

                  {/* Transaction */}
                  <td className="px-4 py-4">
                    <span className="whitespace-nowrap text-xs font-medium text-gray-700">
                      {ledger.transactionType || "-"}
                    </span>
                  </td>

                  {/* Product */}
                  <td className="px-4 py-4">
                    <p
                      title={ledger.productName}
                      className="max-w-[180px] truncate text-sm text-gray-700"
                    >
                      {ledger.productName || "-"}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <p
                      title={ledger.category}
                      className="max-w-[180px] truncate text-sm text-gray-600"
                    >
                      {ledger.category || "-"}
                    </p>
                  </td>

                  {/* Billing Type */}
                  <td className="px-4 py-4">
                    <span className="whitespace-nowrap text-xs font-medium text-gray-700">
                      {getBillingTypeLabel(ledger.billingType)}
                    </span>
                  </td>

                  {/* Base Amount */}
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium text-gray-700">
                    ₹{formatAmount(ledger.baseAmount)}
                  </td>

                  {/* Percentage */}
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-600">
                    {Number(ledger.percentage || 0)}%
                  </td>

                  {/* Debit */}
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    {debit > 0 ? (
                      <span className="text-sm font-semibold text-red-600">
                        ₹{formatAmount(debit)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  {/* Credit */}
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    {credit > 0 ? (
                      <span className="text-sm font-semibold text-green-600">
                        ₹{formatAmount(credit)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        ledger.status,
                      )}`}
                    >
                      {ledger.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {onView && (
                        <button
                          type="button"
                          title="View Ledger"
                          onClick={() => onView(ledger)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-[#123B7A]"
                        >
                          <Eye size={15} />
                        </button>
                      )}

                      {ledger.status === "PENDING" && onApprove && (
                        <button
                          type="button"
                          title="Approve"
                          disabled={approvingId === ledger._id}
                          onClick={() => onApprove(ledger)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-200 text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle2 size={15} />
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