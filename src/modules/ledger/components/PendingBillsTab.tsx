import { useEffect, useState } from "react";

import { TableSkeletonRows } from "../../../components/ui/TableSkeleton";
import DateRangeFilter from "./DateRangeFilter";
import {
  getDealerPendingBills,
  type DealerPendingBills,
} from "../services/ledgerApi";

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

export default function PendingBillsTab({ dealerId }: { dealerId: string }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<DealerPendingBills | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getDealerPendingBills(dealerId, { fromDate: from, toDate: to })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
          setError("Failed to load pending bills.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dealerId, from, to]);

  return (
    <div className="space-y-4">
      <DateRangeFilter
        from={from}
        to={to}
        onChange={(start, end) => {
          setFrom(start);
          setTo(end);
        }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Complaint No.</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Customer / Service</th>
                <th className="px-4 py-3 text-right font-semibold">Bill Amount</th>
                <th className="px-4 py-3 text-right font-semibold">Settled</th>
                <th className="px-4 py-3 text-right font-semibold">Pending</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Age</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableSkeletonRows cols={9} />
              ) : !data || data.rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    No pending bills found.
                  </td>
                </tr>
              ) : (
                data.rows.map((bill) => (
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
                    <td className="px-4 py-2.5 text-right font-semibold text-amber-700">
                      {amount(bill.remainingAmount)}
                    </td>

                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          bill.paymentStatus === "PARTIALLY_PAID"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {bill.paymentStatus === "PARTIALLY_PAID"
                          ? "Partially Paid"
                          : "Unpaid"}
                      </span>
                    </td>

                    <td className="px-4 py-2.5 text-right text-gray-600">
                      {bill.ageDays}d
                    </td>
                  </tr>
                ))
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
                  <td className="px-4 py-3 text-right text-amber-700">
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
