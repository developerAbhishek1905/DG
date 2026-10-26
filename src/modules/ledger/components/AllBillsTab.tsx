import { useEffect, useState } from "react";

import { TableSkeletonRows } from "../../../components/ui/TableSkeleton";
import DateRangeFilter from "./DateRangeFilter";
import { getDealerAllBills, type DealerAllBills } from "../services/ledgerApi";

const amount = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const showDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const paymentBadge: Record<string, { label: string; className: string }> = {
  PAID: { label: "Paid", className: "bg-green-50 text-green-700" },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    className: "bg-amber-50 text-amber-700",
  },
  UNPAID: { label: "Unpaid", className: "bg-red-50 text-red-700" },
};

const approvalBadge: Record<string, string> = {
  APPROVED: "bg-green-50 text-green-700",
  BILLED: "bg-blue-50 text-blue-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  REVERSED: "bg-gray-100 text-gray-600",
};

export default function AllBillsTab({ dealerId }: { dealerId: string }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [data, setData] = useState<DealerAllBills | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getDealerAllBills(dealerId, { fromDate: from, toDate: to, paymentStatus })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
          setError("Failed to load dealer bills.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dealerId, from, to, paymentStatus]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <DateRangeFilter
            from={from}
            to={to}
            onChange={(start, end) => {
              setFrom(start);
              setTo(end);
            }}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Payment Status
          </label>

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">All</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Complaint No.</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Customer / Service</th>
                <th className="px-4 py-3 text-right font-semibold">Bill Amount</th>
                <th className="px-4 py-3 text-right font-semibold">Settled</th>
                <th className="px-4 py-3 text-right font-semibold">Pending</th>
                <th className="px-4 py-3 text-center font-semibold">Bill Status</th>
                <th className="px-4 py-3 text-center font-semibold">Payment</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableSkeletonRows cols={9} />
              ) : !data || data.rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    No bills found.
                  </td>
                </tr>
              ) : (
                data.rows.map((bill) => {
                  const badge = paymentBadge[bill.paymentStatus] ?? paymentBadge.UNPAID;

                  return (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-2.5 text-gray-700">
                        {showDate(bill.billingDate)}
                      </td>

                      <td className="px-4 py-2.5 font-medium text-gray-900">
                        {bill.complaintNumber}
                      </td>

                      <td className="px-4 py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            bill.kind === "DUMMY_BILL_REF"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {bill.kind === "DUMMY_BILL_REF" ? "Dummy Bill" : "Bill"}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-gray-600">
                        <p className="text-gray-800">
                          {bill.customerName || bill.productName || "-"}
                        </p>
                        {bill.serviceDescription && (
                          <p className="text-xs text-gray-500">
                            {bill.serviceDescription}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-2.5 text-right">{amount(bill.amount)}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">
                        {amount(bill.paidAmount)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                        {amount(bill.remainingAmount)}
                      </td>

                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            approvalBadge[bill.status] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {bill.status.charAt(0) + bill.status.slice(1).toLowerCase()}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {data && data.rows.length > 0 && (
              <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-900">
                <tr>
                  <td className="px-4 py-3" colSpan={4}>
                    Total ({data.totals.count}{" "}
                    {data.totals.count === 1 ? "bill" : "bills"})
                  </td>
                  <td className="px-4 py-3 text-right">{amount(data.totals.amount)}</td>
                  <td className="px-4 py-3 text-right">
                    {amount(data.totals.paidAmount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {amount(data.totals.remainingAmount)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
