// import { useEffect, useMemo, useState } from "react";

// import { useAppSelector } from "../../../app/hooks";

// import BillingFilters from "../components/BillingFilters";
// import BillingStats from "../components/BillingStats";
// import BillingTable from "../components/BillingTable";

// import { getBills } from "../services/billingApi";

// import type { Bill } from "../types/billing.types";

// export default function BillListPage() {
//   const [bills, setBills] = useState<Bill[]>([]);

//   const [loading, setLoading] = useState(true);

//   const { search, status, type } = useAppSelector((state) => state.billing);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);

//         setBills(await getBills());
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   const filtered = useMemo(
//     () =>
//       bills.filter((bill) => {
//         const query = search.trim().toLowerCase();

//         return (
//           (!query ||
//             bill.billNumber.toLowerCase().includes(query) ||
//             bill.complaintNumber.toLowerCase().includes(query) ||
//             bill.dealer.name.toLowerCase().includes(query)) &&
//           (status === "ALL" || bill.status === status) &&
//           (type === "ALL" || bill.closureType === type)
//         );
//       }),
//     [bills, search, status, type],
//   );

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Bills</h1>

//         <p className="mt-1 text-sm text-gray-500">
//           Review generated service bills.
//         </p>
//       </div>

//       <BillingStats bills={bills} />

//       <BillingFilters />

//       {loading ? (
//         <div className="rounded-xl border bg-white p-12 text-center">
//           Loading bills...
//         </div>
//       ) : (
//         <BillingTable bills={filtered} />
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

// import { useAppSelector } from "../../../app/hooks";

// import BillingFilters from "../components/BillingFilters";
import BillingFilters, {
  type BillingFilterValues,
} from "../components/BillingFilters";

const initialFilters: BillingFilterValues = {
  search: "",
  dealerId: "",
  status: "ALL",
  billingType: "ALL",
  transactionType: "ALL",
  fromDate: "",
  toDate: "",
};
import LedgerTable from "../components/LedgerTable";

import { approveDealerLedger, getDealerLedgers } from "../services/billingApi";

import type {
  DealerLedger,
  LedgerPagination,
  LedgerSummary,
} from "../types/billing.types";
import { useDebounce } from "../../../hooks/useDebounce";

export default function BillListPage() {
  const [ledgers, setLedgers] = useState<DealerLedger[]>([]);

  const [loading, setLoading] = useState(true);

  const [approvingId, setApprovingId] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState<LedgerPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  /*
  |--------------------------------------------------------------------------
  | Summary
  |--------------------------------------------------------------------------
  */

  const [summary, setSummary] = useState<LedgerSummary>({
    totalAmount: 0,
    approvedAmount: 0,
    pendingAmount: 0,
    totalDebit: 0,
    totalCredit: 0,
    balance: 0,
  });

  const [dealers, setDealers] =
  useState<
    {
      _id: string;
      name: string;
      code?: string;
    }[]
  >([]);

  const [filters, setFilters] = useState<BillingFilterValues>(initialFilters);

  const debouncedSearch =
  useDebounce(
    filters.search,
    500,
  );
  /*
  |--------------------------------------------------------------------------
  | Redux filters
  |--------------------------------------------------------------------------
  */

  // const { search, status, type } = useAppSelector((state) => state.billing);

  /*
  |--------------------------------------------------------------------------
  | Load Ledger
  |--------------------------------------------------------------------------
  */

  // const loadLedgers = useCallback(async () => {
  //   try {
  //     setLoading(true);

  //     const response = await getDealerLedgers({
  //       search,

  //       status: status === "ALL" ? undefined : status,

  //       billingType: type === "ALL" ? undefined : type,

  //       page,

  //       limit,
  //     });

  //     setLedgers(response.data);

  //     setSummary(response.summary);

  //     setPagination(response.pagination);
  //   } catch (error) {
  //     console.error("Failed to load ledger:", error);

  //     toast.error("Failed to load ledger");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [search, status, type, page, limit]);

const loadLedgers = useCallback(async () => {
  try {
    setLoading(true);

    const response =
      await getDealerLedgers({
        search:
          debouncedSearch,

        dealerId:
          filters.dealerId ||
          undefined,

        status:
          filters.status === "ALL"
            ? undefined
            : filters.status,

        billingType:
          filters.billingType === "ALL"
            ? undefined
            : filters.billingType,

        transactionType:
          filters.transactionType === "ALL"
            ? undefined
            : filters.transactionType,

        fromDate:
          filters.fromDate ||
          undefined,

        toDate:
          filters.toDate ||
          undefined,

        page,

        limit,
      });

    setLedgers(
      response.data,
    );

    setSummary(
      response.summary,
    );

    setPagination(
      response.pagination,
    );
  } catch (error) {
    console.error(
      "Failed to load ledgers:",
      error,
    );

    toast.error(
      "Failed to load ledgers",
    );
  } finally {
    setLoading(false);
  }
}, [
  debouncedSearch,
  filters.dealerId,
  filters.status,
  filters.billingType,
  filters.transactionType,
  filters.fromDate,
  filters.toDate,
  page,
  limit,
]);
  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

useEffect(() => {
  loadLedgers();
}, [loadLedgers]);

const handleResetFilters = () => {
  setFilters({
    search: "",
    dealerId: "",
    status: "ALL",
    billingType: "ALL",
    transactionType: "ALL",
    fromDate: "",
    toDate: "",
  });

  setPage(1);
};
  /*
  |--------------------------------------------------------------------------
  | Reset page when filters change
  |--------------------------------------------------------------------------
  */

//   useEffect(() => {
//     setPage(1);
//   }, 
//   // [search, status, type]
//   [
//   debouncedSearch,
//   filters.dealerId,
//   filters.status,
//   filters.billingType,
//   filters.transactionType,
//   filters.fromDate,
//   filters.toDate,
//   page,
//   limit,
// ]
// );

  /*
  |--------------------------------------------------------------------------
  | Approve
  |--------------------------------------------------------------------------
  */

  const handleApprove = async (ledger: DealerLedger) => {
    try {
      setApprovingId(ledger._id);

      await approveDealerLedger(
        ledger._id,
        "Billing verified and approved by DG",
      );

      toast.success("Ledger approved successfully");

      /*
      |--------------------------------------------------------------------------
      | Reload after approval
      |--------------------------------------------------------------------------
      */

      await loadLedgers();
    } catch (error) {
      console.error("Approve ledger failed:", error);

      toast.error("Failed to approve ledger");
    } finally {
      setApprovingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | View
  |--------------------------------------------------------------------------
  */

  const handleView = (ledger: DealerLedger) => {
    console.log("View ledger:", ledger);

    // Open modal / navigate later
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dealer Ledger</h1>

        <p className="mt-1 text-sm text-gray-500">
          Review dealer billing, transactions and approvals.
        </p>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Total Amount</p>

          <p className="mt-2 text-xl font-bold text-gray-900">
            ₹{summary.totalAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Approved</p>

          <p className="mt-2 text-xl font-bold text-green-600">
            ₹{summary.approvedAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Pending</p>

          <p className="mt-2 text-xl font-bold text-yellow-600">
            ₹{summary.pendingAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Balance</p>

          <p className="mt-2 text-xl font-bold text-[#123B7A]">
            ₹{summary.balance.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* FILTERS */}

      {/* <BillingFilters /> */}

<BillingFilters
  filters={filters}
  dealers={dealers}
  onChange={(newFilters) => {
    setFilters(newFilters);
    setPage(1);
  }}
  onReset={
    handleResetFilters
  }
/>
      {/* TABLE */}

      <LedgerTable
        ledgers={ledgers}
        loading={loading}
        approvingId={approvingId}
        onApprove={handleApprove}
        onView={handleView}
      />

      {/* PAGINATION */}

      {!loading && pagination.total > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            Showing {(page - 1) * limit + 1}
            {" - "}
            {Math.min(page * limit, pagination.total)} of {pagination.total}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));

                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-2 py-2 text-xs outline-none"
            >
              <option value={10}>10</option>

              <option value={20}>20</option>

              <option value={50}>50</option>
            </select>

            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-2 text-xs font-semibold text-gray-600">
              Page {page} of {pagination.totalPages || 1}
            </span>

            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
