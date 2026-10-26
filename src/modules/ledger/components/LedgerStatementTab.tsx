import { useEffect, useState } from "react";

import { TableSkeletonRows } from "../../../components/ui/TableSkeleton";
import DateRangeFilter from "./DateRangeFilter";
import { getDealerStatement, type DealerStatement } from "../services/ledgerApi";

const amount = (value: number) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const showAmount = (value: number) => (value ? amount(value) : "-");

// Positive balance = Dr (dealer owes), negative = Cr
const showBalance = (value: number) =>
  value === 0
    ? amount(0)
    : `${amount(Math.abs(value))} ${value > 0 ? "Dr" : "Cr"}`;

const showDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`;
};

export default function LedgerStatementTab({ dealerId }: { dealerId: string }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<DealerStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getDealerStatement(dealerId, { fromDate: from, toDate: to })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
          setError("Failed to load dealer ledger.");
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
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Particulars</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-right font-semibold">Debit</th>
                <th className="px-4 py-3 text-right font-semibold">Credit</th>
                <th className="px-4 py-3 text-right font-semibold">Balance</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableSkeletonRows cols={6} />
              ) : !data ? null : (
                <>
                  {from && (
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <td className="px-4 py-2.5 text-gray-500">{showDate(from)}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-700" colSpan={4}>
                        Opening Balance
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                        {showBalance(data.openingBalance)}
                      </td>
                    </tr>
                  )}

                  {data.rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                        No ledger entries found.
                      </td>
                    </tr>
                  )}

                  {data.rows.map((row) => (
                    <FragmentRow key={row.key} row={row} />
                  ))}
                </>
              )}
            </tbody>

            {data && data.rows.length > 0 && (
              <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-sm font-semibold text-gray-900">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right">{amount(data.totals.debit)}</td>
                  <td className="px-4 py-3 text-right">{amount(data.totals.credit)}</td>
                  <td className="px-4 py-3 text-right">
                    {showBalance(data.totals.closingBalance)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

function FragmentRow({ row }: { row: DealerStatement["rows"][number] }) {
  return (
    <>
      <tr className="border-t border-gray-100 hover:bg-gray-50">
        <td className="whitespace-nowrap px-4 py-2.5 text-gray-700">
          {showDate(row.date)}
        </td>

        <td className="px-4 py-2.5 font-medium text-gray-900">
          {row.particulars}
          {row.reference && (
            <span className="ml-2 text-xs font-normal text-gray-400">
              {row.reference}
            </span>
          )}
        </td>

        <td className="px-4 py-2.5 text-gray-600">{row.type}</td>
        <td className="px-4 py-2.5 text-right text-gray-900">{showAmount(row.debit)}</td>
        <td className="px-4 py-2.5 text-right text-gray-900">{showAmount(row.credit)}</td>
        <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
          {showBalance(row.balance)}
        </td>
      </tr>

      {row.children.map((child, index) => (
        <tr key={`${row.key}-${index}`} className="bg-gray-50/40 text-xs text-gray-500">
          <td className="whitespace-nowrap py-1.5 pl-8 pr-4">
            <span className="mr-1.5 text-gray-400">↳</span>
            {showDate(child.date)}
          </td>
          <td className="px-4 py-1.5">{child.particulars}</td>
          <td className="px-4 py-1.5" />
          <td className="px-4 py-1.5" />
          <td className="px-4 py-1.5 text-right italic">{amount(child.amount)}</td>
          <td className="px-4 py-1.5" />
        </tr>
      ))}
    </>
  );
}
