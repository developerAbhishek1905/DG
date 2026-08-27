import TransactionRow from "./TransactionRow";

import type {
  LedgerTransaction,
} from "../types/ledger.types";

interface Props {
  transactions: LedgerTransaction[];
}

export default function LedgerTable({
  transactions,
}: Props) {
  if (
    !transactions.length
  ) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No ledger transactions found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Transaction",
                "Type",
                "Reference",
                "Description",
                "Credit",
                "Debit",
                "Balance",
                "Status",
                "Date",
                "Action",
              ].map(
                (heading) => (
                  <th
                    key={
                      heading
                    }
                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {transactions.map(
              (
                transaction
              ) => (
                <TransactionRow
                  key={
                    transaction.id
                  }
                  transaction={
                    transaction
                  }
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}