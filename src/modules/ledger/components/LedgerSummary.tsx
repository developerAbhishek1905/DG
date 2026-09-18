// import {
//   ArrowDownCircle,
//   ArrowUpCircle,
//   CircleDollarSign,
//   WalletCards,
// } from "lucide-react";

// import type {
//   DealerLedgerSummary,
// } from "../types/ledger.types";

// interface Props {
//   summary: DealerLedgerSummary;
// }

// export default function LedgerSummary({
//   summary,
// }: Props) {
//   // const stats = [
//   //   {
//   //     label:
//   //       "Opening Balance",

//   //     value:
//   //       summary.openingBalance,

//   //     icon:
//   //       WalletCards,
//   //   },

//   //   {
//   //     label:
//   //       "Total Credits",

//   //     value:
//   //       summary.totalCredits,

//   //     icon:
//   //       ArrowUpCircle,
//   //   },

//   //   {
//   //     label:
//   //       "Total Debits",

//   //     value:
//   //       summary.totalDebits,

//   //     icon:
//   //       ArrowDownCircle,
//   //   },

//   //   {
//   //     label:
//   //       "Outstanding",

//   //     value:
//   //       summary.outstandingAmount,

//   //     icon:
//   //       CircleDollarSign,
//   //   },
//   // ];

//   return (
//     <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//       {stats.map(
//         (stat) => {
//           const Icon =
//             stat.icon;

//           return (
//             <div
//               key={
//                 stat.label
//               }
//               className="rounded-xl border border-gray-200 bg-white p-5"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">
//                     {
//                       stat.label
//                     }
//                   </p>

//                   <p className="mt-2 text-2xl font-bold text-gray-900">
//                     ₹
//                     {/* {stat.value.toLocaleString(
//                       "en-IN"
//                     )} */}
//                   </p>
//                 </div>

//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
//                   <Icon
//                     size={21}
//                   />
//                 </div>
//               </div>
//             </div>
//           );
//         }
//       )}
//     </div>
//   );
// }

import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  Clock3,
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
  /*
  |--------------------------------------------------------------------------
  | Safe Values
  |--------------------------------------------------------------------------
  */

  const totalDebit = Number(
    summary.totalDebit || 0,
  );

  const totalCredit = Number(
    summary.totalCredit || 0,
  );

  const outstanding = Number(
    summary.outstanding || 0,
  );

  const pendingAmount = Number(
    summary.pendingAmount || 0,
  );

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const stats = [
    {
      label: "Total Debit",
      value: totalDebit,
      icon: ArrowDownCircle,
    },

    {
      label: "Total Credit",
      value: totalCredit,
      icon: ArrowUpCircle,
    },

    {
      label: "Pending Amount",
      value: pendingAmount,
      icon: Clock3,
    },

    {
      label: "Outstanding",
      value: outstanding,
      icon: CircleDollarSign,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Format Currency
  |--------------------------------------------------------------------------
  */

  const formatAmount = (
    amount: number,
  ) => {
    return Math.abs(
      amount,
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    );
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        const isOutstanding =
          stat.label ===
          "Outstanding";

        const isNegative =
          isOutstanding &&
          stat.value < 0;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Value */}

              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    isNegative
                      ? "text-green-600"
                      : isOutstanding &&
                          stat.value >
                            0
                        ? "text-amber-600"
                        : "text-gray-900"
                  }`}
                >
                  ₹
                  {formatAmount(
                    stat.value,
                  )}
                </p>

                {isNegative && (
                  <p className="mt-1 text-xs font-medium text-green-600">
                    Credit Balance
                  </p>
                )}
              </div>

              {/* Icon */}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}