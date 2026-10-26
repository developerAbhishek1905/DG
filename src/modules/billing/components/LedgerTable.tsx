import {
  getBillingTypeLabel,
  getLedgerStatusLabel,
} from "../constants/billing.constants";
import { useState } from "react";
import { CheckCircle2, Eye, Pencil } from "lucide-react";

import type { DealerLedger } from "../types/billing.types";

interface Props {
  ledgers: DealerLedger[];
  loading?: boolean;
  approvingId?: string | null;

  onApprove?: (ledger: DealerLedger) => void;
  onView?: (ledger: DealerLedger) => void;
  onEdit?: (ledger: DealerLedger) => void;
}

export default function LedgerTable({
  ledgers,
  loading = false,
  approvingId,
  onApprove,
  onView,
  onEdit,
}: Props) {
  const [remarkTip, setRemarkTip] = useState<{
    text: string;
    top: number;
    left: number;
  } | null>(null);

  const showRemark = (
    event: React.MouseEvent<HTMLElement>,
    text: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = 320;

    setRemarkTip({
      text,
      // keep the popover inside the viewport horizontally
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      top: rect.bottom + 6,
    });
  };

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

              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                Units
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

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Closing Remark
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

                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">
  {ledger?.complaintId?.units ?? "-"}
</td>

                  <td className="px-4 py-3">
                    <span className="whitespace-nowrap text-xs font-medium text-gray-700">
                      {ledger.entrySource === "AUTO_BILL"
                        ? "Auto Bill"
                        : getBillingTypeLabel(ledger.billingType)}
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

                  <td className="max-w-[220px] px-4 py-3">
                    {(() => {
                      const remark =
                        ledger?.complaintId?.closureApprovalRemark?.trim() ||
                        ledger?.closingRemark?.trim() ||
                        "";

                      return remark ? (
                        <p
                          onMouseEnter={(e) => showRemark(e, remark)}
                          onMouseLeave={() => setRemarkTip(null)}
                          className="cursor-help truncate text-xs text-gray-600"
                        >
                          {remark}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">-</p>
                      );
                    })()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        ledger.status,
                      )}`}
                    >
                      {getLedgerStatusLabel(ledger.status)}
                    </span>
                  </td>

                <td className="px-4 py-3">
  <div className="flex items-center justify-center gap-1.5">
    {/* {onView && (
      <button
        type="button"
        title="View Ledger"
        onClick={() => onView(ledger)}
        className="rounded-lg p-2 transition bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
      >
        <Eye size={16} />
      </button>
    )} */}

    {/* {onEdit && 
    ledger.status === "PENDING" && 
    ( */}
      <button
        type="button"
        title="Edit Ledger"
        onClick={() => onEdit(ledger)}
        className="rounded-lg p-2 transition bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
      >
        <Pencil size={16} />
      </button>
    {/* )} */}

    {ledger.status === "PENDING" && onApprove && (
      <button
        type="button"
        title="Approve Ledger"
        disabled={approvingId === ledger._id}
        onClick={() => onApprove(ledger)}
        className="rounded-lg p-2 transition bg-green-50 text-green-600 hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

      {remarkTip && (
        <div
          style={{
            position: "fixed",
            top: remarkTip.top,
            left: remarkTip.left,
            width: 320,
          }}
          className="pointer-events-none z-[100] rounded-lg border border-gray-200 bg-white p-3 shadow-xl"
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#123B7A]">
            Closing Remark
          </p>

          <p className="max-h-48 overflow-y-auto whitespace-pre-wrap break-words text-xs leading-5 text-gray-700">
            {remarkTip.text}
          </p>
        </div>
      )}
    </div>
  );
}
