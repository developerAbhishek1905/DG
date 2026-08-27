import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  WalletCards,
} from "lucide-react";

import type {
  DealerLedgerSummary,
} from "../types/ledger.types";

interface Props {
  summary: DealerLedgerSummary;
}

export default function LedgerSummary({
  summary,
}: Props) {
  const stats = [
    {
      label:
        "Opening Balance",

      value:
        summary.openingBalance,

      icon:
        WalletCards,
    },

    {
      label:
        "Total Credits",

      value:
        summary.totalCredits,

      icon:
        ArrowUpCircle,
    },

    {
      label:
        "Total Debits",

      value:
        summary.totalDebits,

      icon:
        ArrowDownCircle,
    },

    {
      label:
        "Outstanding",

      value:
        summary.outstandingAmount,

      icon:
        CircleDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(
        (stat) => {
          const Icon =
            stat.icon;

          return (
            <div
              key={
                stat.label
              }
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {
                      stat.label
                    }
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ₹
                    {stat.value.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                  <Icon
                    size={21}
                  />
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}