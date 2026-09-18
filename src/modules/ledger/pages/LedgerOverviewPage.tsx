// import {
//   AlertTriangle,
//   CircleDollarSign,
//   Landmark,
//   WalletCards,
// } from "lucide-react";

// import { useEffect, useState } from "react";

// import OutstandingCard from "../components/OutstandingCard";

// // import {
// //   getAllDealerLedgerSummaries,
// //   getLedgerOverviewStats,
// // } from "../services/ledgerApi";
// import {
//   // getAllDealerLedgerSummaries,
//   getAllDealerLedgers,
//   // getLedgerOverviewStats,
// } from "../services/ledgerApi";

// import type {
//   DealerLedgerSummary,
//   LedgerOverviewStats,
//   LedgerTransaction,
// } from "../types/ledger.types";

// // import type {
// //   DealerLedgerSummary,
// //   LedgerOverviewStats,
// // } from "../types/ledger.types";

// import DealerLedgerSearch from "../components/DealerLedgerSearch";

// export default function LedgerOverviewPage() {
//   const [stats, setStats] = useState<LedgerOverviewStats | null>(null);

//   const [summaries, setSummaries] = useState<DealerLedgerSummary[]>([]);

//   const [loading, setLoading] = useState(true);

//   const [
//   transactions,
//   setTransactions,
// ] = useState<LedgerTransaction[]>([]);

//   // useEffect(() => {
//   //   const load = async () => {
//   //     try {
//   //       setLoading(true);

//   //       const [statsData, summaryData] = await Promise.all([
//   //         getLedgerOverviewStats(),
//   //         getAllDealerLedgerSummaries(),
//   //       ]);

//   //       setStats(statsData);

//   //       setSummaries(summaryData);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   load();
//   // }, []);

//   useEffect(() => {
//   const load = async () => {
//     try {
//       setLoading(true);

//       const [
//         statsData,
//         // summaryData,
//         // ledgerData,
//       ] = await Promise.all([
//         // getLedgerOverviewStats(),

//         // getAllDealerLedgerSummaries(),

//         getAllDealerLedgers({
//           page: 1,
//           limit: 100,
//         }),
//       ]);

//       setStats(statsData);

//       // setSummaries(
//       //   summaryData,
//       // );

//       // setTransactions(
//       //   ledgerData.data || [],
//       // );
//     } catch (error) {
//       console.error(
//         "Failed to load ledger:",
//         error,
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   load();
// }, []);

//   if (loading || !stats) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center">
//         Loading ledger...
//       </div>
//     );
//   }

//   // const cards = [
//   //   {
//   //     label: "Total Dealers",

//   //     value: stats.totalDealers,

//   //     icon: Landmark,
//   //   },

//   //   {
//   //     label: "Total Outstanding",

//   //     value: `₹${stats.totalOutstanding.toLocaleString("en-IN")}`,

//   //     icon: CircleDollarSign,
//   //   },

//   //   {
//   //     label: "Total Credits",

//   //     value: `₹${stats.totalCredits.toLocaleString("en-IN")}`,

//   //     icon: WalletCards,
//   //   },

//   //   {
//   //     label: "High Outstanding",

//   //     value: `₹${stats.overdueOutstanding.toLocaleString("en-IN")}`,

//   //     icon: AlertTriangle,
//   //   },
//   // ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Dealer Ledger</h1>

//         <p className="mt-1 text-sm text-gray-500">
//           Search dealers and monitor credits, payments and outstanding balances.
//         </p>
//       </div>
//       {/* Dealer Search */}
//       <div className="rounded-xl border border-gray-200 bg-white p-5">
//         <div className="mb-3">
//           <h2 className="text-sm font-semibold text-gray-900">Find Dealer</h2>

//           <p className="mt-1 text-xs text-gray-500">
//             Search and open a dealer's complete ledger.
//           </p>
//         </div>

//         <DealerLedgerSearch dealers={summaries} />
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {cards.map((card) => {
//           const Icon = card.icon;

//           return (
//             <div
//               key={card.label}
//               className="rounded-xl border border-gray-200 bg-white p-5"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">{card.label}</p>

//                   <p className="mt-2 text-2xl font-bold text-gray-900">
//                     {card.value}
//                   </p>
//                 </div>

//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
//                   <Icon size={21} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold text-gray-900">
//           Dealer Outstanding
//         </h2>

//         <p className="mt-1 text-sm text-gray-500">
//           Current financial position of each dealer.
//         </p>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//         {summaries.map((summary) => (
//           <OutstandingCard key={summary.dealer.id} summary={summary} />
//         ))}
//       </div>
//     </div>
//   );
// }


import {
  AlertTriangle,
  CircleDollarSign,
  Landmark,
  WalletCards,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DealerLedgerSearch from "../components/DealerLedgerSearch";
import OutstandingCard from "../components/OutstandingCard";

import {
  getAllDealerLedgers,
} from "../services/ledgerApi";

import type {
  DealerLedgerSummary,
  LedgerTransaction,
} from "../types/ledger.types";

export default function LedgerOverviewPage() {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [
    transactions,
    setTransactions,
  ] = useState<
    LedgerTransaction[]
  >([]);

  const [
    summaries,
    setSummaries,
  ] = useState<
    DealerLedgerSummary[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Load All Ledger
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const response =
          await getAllDealerLedgers({
            page: 1,

            // Overview needs all dealer records.
            // Increase/backend-adjust this if needed.
            limit: 100,
          });

        console.log(
          "All ledger response:",
          response,
        );

        setTransactions(
          response.data || [],
        );
      } catch (error) {
        console.error(
          "Failed to load ledger:",
          error,
        );

        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Dealer Summary
  |--------------------------------------------------------------------------
  */

  const dealerSummaries =
    useMemo(() => {
      const dealerMap =
        new Map<
          string,
          DealerLedgerSummary
        >();

      transactions.forEach(
        (transaction) => {
          /*
          |--------------------------------------------------------------------------
          | Dealer
          |--------------------------------------------------------------------------
          |
          | Adjust these property names if your API type is different.
          |
          */

          const dealer =
            transaction.dealerId;

          if (
            !dealer ||
            typeof dealer ===
              "string"
          ) {
            return;
          }

          const dealerId =
            dealer._id;

          if (!dealerId) {
            return;
          }

          /*
          |--------------------------------------------------------------------------
          | Existing Summary
          |--------------------------------------------------------------------------
          */

          let current =
            dealerMap.get(
              dealerId,
            );

          if (!current) {
            current = {
              dealer: {
                id: dealerId,

                name:
                  dealer.technicianFirmName ||
                  dealer.technicianName ||
                  transaction.dealerName ||
                  "-",

                dealerCode:
                  dealer.headCode ||
                  transaction.dealerCode ||
                  "",

                phone:
                  dealer.mobileNumber ||
                  "",

                city: "",
              },

              totalDebit: 0,

              totalCredit: 0,

              outstanding: 0,
            };

            dealerMap.set(
              dealerId,
              current,
            );
          }

          /*
          |--------------------------------------------------------------------------
          | Amount
          |--------------------------------------------------------------------------
          */

          const amount =
            Number(
              transaction.amount ||
                0,
            );

          if (
            transaction.entryType ===
            "DEBIT"
          ) {
            current.totalDebit +=
              amount;
          }

          if (
            transaction.entryType ===
            "CREDIT"
          ) {
            current.totalCredit +=
              amount;
          }

          current.outstanding =
            current.totalDebit -
            current.totalCredit;
        },
      );

      return Array.from(
        dealerMap.values(),
      );
    }, [transactions]);

  /*
  |--------------------------------------------------------------------------
  | Sync Dealer Summaries
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setSummaries(
      dealerSummaries,
    );
  }, [dealerSummaries]);

  /*
  |--------------------------------------------------------------------------
  | Overview Stats
  |--------------------------------------------------------------------------
  */

  const stats =
    useMemo(() => {
      const totalDealers =
        summaries.length;

      const totalDebit =
        transactions.reduce(
          (total, item) => {
            if (
              item.entryType !==
              "DEBIT"
            ) {
              return total;
            }

            return (
              total +
              Number(
                item.amount ||
                  0,
              )
            );
          },
          0,
        );

      const totalCredit =
        transactions.reduce(
          (total, item) => {
            if (
              item.entryType !==
              "CREDIT"
            ) {
              return total;
            }

            return (
              total +
              Number(
                item.amount ||
                  0,
              )
            );
          },
          0,
        );

      const totalOutstanding =
        totalDebit -
        totalCredit;

      /*
      |--------------------------------------------------------------------------
      | High Outstanding
      |--------------------------------------------------------------------------
      |
      | Here we're showing the highest individual dealer outstanding.
      |
      */

      const highOutstanding =
        summaries.reduce(
          (highest, item) =>
            Math.max(
              highest,
              Number(
                item.outstanding ||
                  0,
              ),
            ),
          0,
        );

      return {
        totalDealers,

        totalOutstanding,

        totalCredits:
          totalCredit,

        highOutstanding,
      };
    }, [
      transactions,
      summaries,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Cards
  |--------------------------------------------------------------------------
  */

  const cards = [
    {
      label:
        "Total Dealers",

      value:
        stats.totalDealers,

      icon:
        Landmark,
    },

    {
      label:
        "Total Outstanding",

      value: `₹${stats.totalOutstanding.toLocaleString(
        "en-IN",
      )}`,

      icon:
        CircleDollarSign,
    },

    {
      label:
        "Total Credits",

      value: `₹${stats.totalCredits.toLocaleString(
        "en-IN",
      )}`,

      icon:
        WalletCards,
    },

    {
      label:
        "High Outstanding",

      value: `₹${stats.highOutstanding.toLocaleString(
        "en-IN",
      )}`,

      icon:
        AlertTriangle,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading ledger...
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dealer Ledger
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Search dealers and
          monitor credits,
          payments and
          outstanding balances.
        </p>
      </div>

      {/* Dealer Search */}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Find Dealer
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Search and open a
            dealer's complete
            ledger.
          </p>
        </div>

        <DealerLedgerSearch
          dealers={summaries}
        />
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <div
                key={
                  card.label
                }
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {
                        card.label
                      }
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {
                        card.value
                      }
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                    <Icon
                      size={
                        21
                      }
                    />
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>

      {/* Outstanding Header */}

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Dealer Outstanding
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current financial
          position of each
          dealer.
        </p>
      </div>

      {/* Dealer Cards */}

      {summaries.length ===
      0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No dealer ledger
          records found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summaries.map(
            (summary) => (
              <OutstandingCard
                key={
                  summary
                    .dealer.id
                }
                summary={
                  summary
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}