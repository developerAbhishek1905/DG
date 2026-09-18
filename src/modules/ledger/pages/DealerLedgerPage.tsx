// import { ArrowLeft, Building2, Phone } from "lucide-react";

// // import { useEffect, useMemo, useState } from "react";

// import {
//   useCallback,
//   useEffect,
//   useState,
// } from "react";

// import { useNavigate, useParams } from "react-router-dom";

// // import { useAppSelector } from "../../../app/hooks";

// import LedgerFilters from "../components/LedgerFilters";
// import LedgerSummary from "../components/LedgerSummary";
// import LedgerTable from "../components/LedgerTable";

// // import { getDealerLedger, getDealerLedgerSummary } from "../services/ledgerApi";

// // import type {
// //   DealerLedgerSummary,
// //   LedgerTransaction,
// // } from "../types/ledger.types";

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

// export default function DealerLedgerPage() {
//   const navigate = useNavigate();

//   const { dealerId } = useParams<{
//     dealerId: string;
//   }>();

//   // const { search, transactionType, status, dateFrom, dateTo } = useAppSelector(
//   //   (state) => state.ledger,
//   // );

//   const [filters, setFilters] =
//   useState({
//     search: "",
//     transactionType: "ALL",
//     status: "ALL",
//     dateFrom: "",
//     dateTo: "",
//   });

//   const [summary, setSummary] = useState<DealerLedgerSummary | null>(null);

//   const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);

//   const [loading, setLoading] = useState(true);

  
//   // useEffect(() => {
//   //   if (!dealerId) {
//   //     return;
//   //   }

//   //   const load = async () => {
//   //     try {
//   //       setLoading(true);

//   //       const [summaryData, transactionData] = await Promise.all([
//   //         getDealerLedgerSummary(dealerId),

//   //         getDealerLedger(dealerId),
//   //       ]);

//   //       setSummary(summaryData ?? null);

//   //       setTransactions(transactionData);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   load();
//   // }, [dealerId]);

//   useEffect(() => {
//   if (!dealerId) {
//     return;
//   }

//   const load = async () => {
//     try {
//       setLoading(true);

//       const [
//         summaryData,
//         // ledgerData,
//       ] = await Promise.all([
//         // getDealerLedgerSummary(
//         //   dealerId,
//         // ),

//         getAllDealerLedgers({
//           dealerId,
//           page: 1,
//           limit: 100,
//         }),
//       ]);

//       setSummary(
//         summaryData ?? null,
//       );

//       // setTransactions(
//       //   ledgerData.data || [],
//       // );
//     } catch (error) {
//       console.error(
//         "Failed to load dealer ledger:",
//         error,
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   load();
// }, [dealerId]);

//   // const filtered = useMemo(
//   //   () =>
//   //     transactions.filter((item) => {
//   //       const query = search.trim().toLowerCase();

//   //       const matchesSearch =
//   //         !query ||
//   //         item.transactionNumber.toLowerCase().includes(query) ||
//   //         item.referenceNumber?.toLowerCase().includes(query) ||
//   //         item.complaintNumber?.toLowerCase().includes(query) ||
//   //         item.description.toLowerCase().includes(query);

//   //       const matchesType =
//   //         transactionType === "ALL" || item.transactionType === transactionType;

//   //       const matchesStatus = status === "ALL" || item.status === status;

//   //       const itemDate = item.transactionDate.split("T")[0];

//   //       const matchesFrom = !dateFrom || itemDate >= dateFrom;

//   //       const matchesTo = !dateTo || itemDate <= dateTo;

//   //       return (
//   //         matchesSearch &&
//   //         matchesType &&
//   //         matchesStatus &&
//   //         matchesFrom &&
//   //         matchesTo
//   //       );
//   //     }),
//   //   [transactions, search, transactionType, status, dateFrom, dateTo],
//   // );

// const loadDealerLedger =
//   useCallback(async () => {
//     if (!dealerId) {
//       return;
//     }

//     try {
//       setLoading(true);

//       const [
//         summaryData,
//         // ledgerData,
//       ] = await Promise.all([
//         // getDealerLedgerSummary(
//         //   dealerId,
//         // ),

//         getAllDealerLedgers({
//           dealerId,

//           search:
//             filters.search ||
//             undefined,

//           transactionType:
//             filters.transactionType ===
//             "ALL"
//               ? undefined
//               : filters.transactionType,

//           status:
//             filters.status ===
//             "ALL"
//               ? undefined
//               : filters.status,

//           fromDate:
//             filters.dateFrom ||
//             undefined,

//           toDate:
//             filters.dateTo ||
//             undefined,

//           page: 1,

//           limit: 100,
//         }),
//       ]);

//       setSummary(
//         summaryData ?? null,
//       );

//       // setTransactions(
//       //   ledgerData.data || [],
//       // );
//     } catch (error) {
//       console.error(
//         "Failed to load dealer ledger:",
//         error,
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     dealerId,
//     filters,
//   ]);

// useEffect(() => {
//   loadDealerLedger();
// }, [loadDealerLedger]);

// useEffect(() => {
//   loadDealerLedger();
// }, [loadDealerLedger]);

//   if (loading) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center">
//         Loading dealer ledger...
//       </div>
//     );
//   }

//   if (!summary) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center">
//         Dealer ledger not found.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <button
//         onClick={() => navigate("/ledger")}
//         className="inline-flex items-center gap-2 text-sm text-gray-500"
//       >
//         <ArrowLeft size={17} />
//         Back to Ledger
//       </button>

//       <div className="rounded-xl border border-gray-200 bg-white p-6">
//         <div className="flex flex-col justify-between gap-4 md:flex-row">
//           <div className="flex gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
//               <Building2 size={22} />
//             </div>

//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 {summary.dealer?.name}
//               </h1>

//               <p className="mt-1 text-sm text-gray-500">
//                 {summary.dealer?.dealerCode}
//               </p>
//             </div>
//           </div>

//           <div className="space-y-1 text-sm text-gray-500">
//             {summary.dealer?.phone && (
//               <div className="flex items-center gap-2">
//                 <Phone size={15} />

//                 {summary.dealer.phone}
//               </div>
//             )}

//             {summary.dealer.city && <p>{summary.dealer.city}</p>}
//           </div>
//         </div>
//       </div>

//       <LedgerSummary summary={summary} />

//       {/* <LedgerFilters /> */}

//       <LedgerFilters
//   filters={filters}
//   onChange={(newFilters) => {
//     setFilters(newFilters);
//   }}
//   onReset={() => {
//     setFilters({
//       search: "",
//       transactionType: "ALL",
//       status: "ALL",
//       dateFrom: "",
//       dateTo: "",
//     });
//   }}
// />

//       {/* <LedgerTable transactions={filtered} /> */}
//       <LedgerTable
//   transactions={transactions}
// />
//     </div>
//   );
// }


import {
  ArrowLeft,
  Building2,
  Phone,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import LedgerFilters from "../components/LedgerFilters";
import LedgerSummary from "../components/LedgerSummary";
import LedgerTable from "../components/LedgerTable";

import {
  getAllDealerLedgers,
} from "../services/ledgerApi";

import type {
  DealerLedgerSummary,
  LedgerTransaction,
} from "../types/ledger.types";

import {
  useDebounce,
} from "../../../hooks/useDebounce";

/*
|--------------------------------------------------------------------------
| Filter Type
|--------------------------------------------------------------------------
*/

interface LedgerFilterValues {
  search: string;

  transactionType: string;

  status: string;

  dateFrom: string;

  dateTo: string;
}

/*
|--------------------------------------------------------------------------
| Initial Filters
|--------------------------------------------------------------------------
*/

const initialFilters: LedgerFilterValues = {
  search: "",

  transactionType: "ALL",

  status: "ALL",

  dateFrom: "",

  dateTo: "",
};

export default function DealerLedgerPage() {
  const navigate =
    useNavigate();

  const { dealerId } =
    useParams<{
      dealerId: string;
    }>();

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [
    filters,
    setFilters,
  ] =
    useState<LedgerFilterValues>(
      initialFilters,
    );

  const [
    summary,
    setSummary,
  ] =
    useState<DealerLedgerSummary | null>(
      null,
    );

  const [
    transactions,
    setTransactions,
  ] =
    useState<LedgerTransaction[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    limit,
    setLimit,
  ] =
    useState(20);

  const [
    total,
    setTotal,
  ] =
    useState(0);

  const [
    totalPages,
    setTotalPages,
  ] =
    useState(0);

  /*
  |--------------------------------------------------------------------------
  | Debounce Search
  |--------------------------------------------------------------------------
  */

  const debouncedSearch =
    useDebounce(
      filters.search,
      500,
    );

  /*
  |--------------------------------------------------------------------------
  | Load Dealer Ledger
  |--------------------------------------------------------------------------
  */

  const loadDealerLedger =
    useCallback(async () => {
      if (!dealerId) {
        return;
      }

      try {
        setLoading(true);

        const response =
          await getAllDealerLedgers({
            dealerId,

            search:
              debouncedSearch ||
              undefined,

            transactionType:
              filters.transactionType ===
              "ALL"
                ? undefined
                : filters.transactionType,

            status:
              filters.status ===
              "ALL"
                ? undefined
                : filters.status,

            fromDate:
              filters.dateFrom ||
              undefined,

            toDate:
              filters.dateTo ||
              undefined,

            page,

            limit,
          });

        console.log(
          "Dealer ledger response:",
          response,
        );

        /*
        |--------------------------------------------------------------------------
        | Transactions
        |--------------------------------------------------------------------------
        */

        setTransactions(
          response.data || [],
        );

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        setTotal(
          response.pagination?.total ||
            0,
        );

        setTotalPages(
          response.pagination
            ?.totalPages || 0,
        );

        /*
        |--------------------------------------------------------------------------
        | Summary
        |--------------------------------------------------------------------------
        |
        | This assumes your API returns dealer information inside
        | response.summary.
        |
        */

        if (response.summary) {
          setSummary(
            response.summary as DealerLedgerSummary,
          );
        }
      } catch (error) {
        console.error(
          "Failed to load dealer ledger:",
          error,
        );

        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }, [
      dealerId,
      debouncedSearch,
      filters.transactionType,
      filters.status,
      filters.dateFrom,
      filters.dateTo,
      page,
      limit,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadDealerLedger();
  }, [loadDealerLedger]);

  /*
  |--------------------------------------------------------------------------
  | Filter Change
  |--------------------------------------------------------------------------
  */

  const handleFilterChange = (
    newFilters: LedgerFilterValues,
  ) => {
    setFilters(newFilters);

    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

  const handleReset = () => {
    setFilters({
      search: "",
      transactionType: "ALL",
      status: "ALL",
      dateFrom: "",
      dateTo: "",
    });

    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading && !summary) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading dealer ledger...
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Dealer
  |--------------------------------------------------------------------------
  */

  if (!summary) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Dealer ledger not found.
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
      {/* Back */}

      <button
        type="button"
        onClick={() =>
          navigate("/ledger")
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft
          size={17}
        />

        Back to Ledger
      </button>

      {/* Dealer Header */}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
              <Building2
                size={22}
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {summary.dealer
                  ?.name || "-"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {summary.dealer
                  ?.dealerCode ||
                  "-"}
              </p>
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-500">
            {summary.dealer
              ?.phone && (
              <div className="flex items-center gap-2">
                <Phone
                  size={15}
                />

                {
                  summary.dealer
                    .phone
                }
              </div>
            )}

            {summary.dealer
              ?.city && (
              <p>
                {
                  summary.dealer
                    .city
                }
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}

      <LedgerSummary
        summary={summary}
      />

      {/* Filters */}

      <LedgerFilters
        filters={filters}
        onChange={
          handleFilterChange
        }
        onReset={
          handleReset
        }
      />

      {/* Table */}

      <LedgerTable
        transactions={
          transactions
        }
      />

      {/* Pagination */}

      {!loading &&
        total > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-gray-500">
              Showing{" "}
              {(page - 1) *
                limit +
                1}
              {" - "}
              {Math.min(
                page * limit,
                total,
              )}{" "}
              of {total}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(
                    Number(
                      e.target
                        .value,
                    ),
                  );

                  setPage(1);
                }}
                className="rounded-lg border border-gray-300 px-2 py-2 text-xs"
              >
                <option
                  value={10}
                >
                  10
                </option>

                <option
                  value={20}
                >
                  20
                </option>

                <option
                  value={50}
                >
                  50
                </option>
              </select>

              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage(
                    (prev) =>
                      prev - 1,
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-2 text-xs font-medium text-gray-600">
                Page {page} of{" "}
                {totalPages ||
                  1}
              </span>

              <button
                type="button"
                disabled={
                  page >=
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (prev) =>
                      prev + 1,
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
    </div>
  );
}