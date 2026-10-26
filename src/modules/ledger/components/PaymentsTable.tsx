import { useState } from "react";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import {
  ChevronDown,
  ChevronUp,
  Wallet,
} from "lucide-react";

import type { DealerPayment } from "../types/payment.types";

interface Props {
  payments: DealerPayment[];
  loading?: boolean;
}

const formatAmount = (amount?: number) =>
  `₹${Number(amount ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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
    case "COMPLETED":
      return "bg-green-50 text-green-700";
    case "REVERSED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentModeClass = (mode: string) => {
  switch (mode) {
    case "CASH":
      return "bg-green-50 text-green-700";
    case "UPI":
      return "bg-purple-50 text-purple-700";
    case "BANK_TRANSFER":
      return "bg-blue-50 text-blue-700";
    case "CHEQUE":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function PaymentsTable({
  payments,
  loading = false,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    null,
  );

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const headerClass =
    "whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase text-gray-500";

  if (loading) {
    return (
      <TableSkeleton />
    );
  }

  if (!payments.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12 text-gray-500">
        <Wallet size={30} className="mb-3 text-gray-400" />
        <p className="text-sm font-medium">No payments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={headerClass}>Payment</th>
              <th className={headerClass}>Mode / Reference</th>
              <th className={`${headerClass} text-right`}>
                Bills Total
              </th>
              <th className={`${headerClass} text-right`}>
                Additional
              </th>
              <th className={`${headerClass} text-right`}>
                Opening Outstanding
              </th>
              <th className={`${headerClass} text-right`}>
                Closing Outstanding
              </th>
              <th className={headerClass}>Status</th>
              <th className={headerClass}>Remark</th>
              <th className={`${headerClass} text-center`}>
                Bills
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {payments.map((payment) => {
              const isExpanded = expandedId === payment._id;

              return (
                <FragmentRow
                  key={payment._id}
                  payment={payment}
                  isExpanded={isExpanded}
                  onToggle={() => toggleExpand(payment._id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface FragmentRowProps {
  payment: DealerPayment;
  isExpanded: boolean;
  onToggle: () => void;
}

function FragmentRow({
  payment,
  isExpanded,
  onToggle,
}: FragmentRowProps) {
  return (
    <>
      <tr className="transition hover:bg-gray-50">
        {/* Payment Number / Date */}
        <td className="whitespace-nowrap px-3 py-3">
          <p className="font-semibold text-[#123B7A]">
            {payment.paymentNumber}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {formatDate(payment.paymentDate)}
          </p>
        </td>

        {/* Mode / Reference */}
        <td className="px-3 py-3">
          <span
            className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getPaymentModeClass(
              payment.paymentMode,
            )}`}
          >
            {payment.paymentMode.replaceAll("_", " ")}
          </span>

          <p className="mt-1 text-xs text-gray-500">
            {payment.transactionReference || "-"}
          </p>
        </td>

        {/* Selected Bills */}
        <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-gray-800">
          {formatAmount(payment.selectedBillsTotal)}
        </td>

        {/* Additional Amount */}
        <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-green-700">
          {formatAmount(payment.additionalAmount)}
        </td>

        {/* Opening Outstanding */}
        <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-red-600">
          {formatAmount(payment.openingOutstanding)}
        </td>

        {/* Closing Outstanding */}
        <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-gray-900">
          {formatAmount(payment.closingOutstanding)}
        </td>

        {/* Status */}
        <td className="px-3 py-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
              payment.status,
            )}`}
          >
            {payment.status}
          </span>
        </td>

        {/* Remark */}
        <td className="max-w-[170px] px-3 py-3">
          <p
            title={payment.remark}
            className="truncate text-xs text-gray-600"
          >
            {payment.remark || "-"}
          </p>
        </td>

        {/* Expand Bills */}
        <td className="px-3 py-3 text-center">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-[#123B7A] hover:bg-blue-50"
          >
            {payment.complaintBills?.length ?? 0}
            {isExpanded ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={9} className="px-5 py-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase text-gray-600">
                Linked Complaint Bills
              </h3>

              {!payment.complaintBills?.length ? (
                <p className="text-sm text-gray-500">
                  No complaint bills linked to this payment.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-2 text-left">
                        Complaint Number
                      </th>
                      <th className="px-3 py-2 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {payment.complaintBills.map((bill) => (
                      <tr key={bill._id}>
                        <td className="px-3 py-2 font-medium text-[#123B7A]">
                          {bill.complaintNumber}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-gray-800">
                          {formatAmount(bill.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="border-t border-gray-200 bg-gray-50">
                    <tr>
                      <td className="px-3 py-2 font-semibold">
                        Selected Bills Total
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {formatAmount(payment.selectedBillsTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}