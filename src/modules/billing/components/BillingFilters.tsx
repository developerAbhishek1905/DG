// import {
//   RotateCcw,
//   Search,
// } from "lucide-react";

// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../../app/hooks";

// import {
//   clearBillingFilters,
//   setBillingSearch,
//   setBillingStatus,
//   setBillingType,
// } from "../store/billingSlice";

// import type {
//   BillingStatus,
//   RateType,
// } from "../types/billing.types";

// export default function BillingFilters() {
//   const dispatch =
//     useAppDispatch();

//   const {
//     search,
//     status,
//     type,
//   } = useAppSelector(
//     (state) =>
//       state.billing
//   );

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-4">
//       <div className="flex flex-col gap-3 xl:flex-row">
//         <div className="relative flex-1">
//           <Search
//             size={17}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             value={search}
//             onChange={(event) =>
//               dispatch(
//                 setBillingSearch(
//                   event.target.value
//                 )
//               )
//             }
//             placeholder="Search bill, complaint or dealer..."
//             className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
//           />
//         </div>

//         <select
//           value={status}
//           onChange={(event) =>
//             dispatch(
//               setBillingStatus(
//                 event.target.value as
//                   | BillingStatus
//                   | "ALL"
//               )
//             )
//           }
//           className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
//         >
//           <option value="ALL">
//             All Status
//           </option>

//           <option value="DRAFT">
//             Draft
//           </option>

//           <option value="GENERATED">
//             Generated
//           </option>

//           <option value="UNDER_REVIEW">
//             Under Review
//           </option>

//           <option value="APPROVED">
//             Approved
//           </option>

//           <option value="REJECTED">
//             Rejected
//           </option>

//           <option value="PAID">
//             Paid
//           </option>
//         </select>

//         <select
//           value={type}
//           onChange={(event) =>
//             dispatch(
//               setBillingType(
//                 event.target.value as
//                   | RateType
//                   | "ALL"
//               )
//             )
//           }
//           className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
//         >
//           <option value="ALL">
//             All Closure Types
//           </option>

//           <option value="VISIT">
//             Visit
//           </option>

//           <option value="SERVICE">
//             Service
//           </option>

//           <option value="PART">
//             Part
//           </option>

//           <option value="INSTALLATION">
//             Installation
//           </option>

//           <option value="UNINSTALLATION">
//             Uninstallation
//           </option>
//         </select>

//         <button
//           onClick={() =>
//             dispatch(
//               clearBillingFilters()
//             )
//           }
//           className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
//         >
//           <RotateCcw
//             size={16}
//           />

//           Reset
//         </button>
//       </div>
//     </div>
//   );
// }

import {
  RotateCcw,
  Search,
} from "lucide-react";

import type {
  BillingType,
  LedgerStatus,
} from "../types/billing.types";

export interface BillingFilterValues {
  search: string;

  dealerId: string;

  status:
    | LedgerStatus
    | "ALL";

  billingType:
    | BillingType
    | "ALL";

  transactionType:
    | "OPENING_BALANCE"
    | "CLOSURE"
    | "CANCELLATION"
    | "ADJUSTMENT"
    | "ALL";

  fromDate: string;

  toDate: string;
}

interface DealerOption {
  _id: string;
  name: string;
  code?: string;
}

interface Props {
  filters: BillingFilterValues;

  dealers?: DealerOption[];

  onChange: (
    filters: BillingFilterValues,
  ) => void;

  onReset: () => void;
}

export default function BillingFilters({
  filters,
  dealers = [],
  onChange,
  onReset,
}: Props) {
  const updateFilter = <
    K extends keyof BillingFilterValues,
  >(
    key: K,
    value: BillingFilterValues[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {/* Search */}

        <div className="relative sm:col-span-2 xl:col-span-2">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              updateFilter(
                "search",
                e.target.value,
              )
            }
            placeholder="Search complaint, dealer, product..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#123B7A]"
          />
        </div>

        {/* Dealer */}

        <select
          value={filters.dealerId}
          onChange={(e) =>
            updateFilter(
              "dealerId",
              e.target.value,
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A]"
        >
          <option value="">
            All Dealers
          </option>

          {dealers.map((dealer) => (
            <option
              key={dealer._id}
              value={dealer._id}
            >
              {dealer.name}
              {dealer.code
                ? ` - ${dealer.code}`
                : ""}
            </option>
          ))}
        </select>

        {/* Status */}

        <select
          value={filters.status}
          onChange={(e) =>
            updateFilter(
              "status",
              e.target.value as
                BillingFilterValues["status"],
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A]"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="BILLED">
            Billed
          </option>

          <option value="REVERSED">
            Reversed
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>

        {/* Billing Type */}

        <select
          value={
            filters.billingType
          }
          onChange={(e) =>
            updateFilter(
              "billingType",
              e.target.value as
                BillingFilterValues["billingType"],
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A]"
        >
          <option value="ALL">
            All Billing Types
          </option>

          <option value="FIXED">
            Fixed
          </option>

          <option value="PARTIAL_PAYMENT">
            Partial Payment
          </option>

          <option value="PROFIT_SHARING">
            Profit Sharing
          </option>

          <option value="CANCELLATION">
            Cancellation
          </option>

          <option value="OPENING_BALANCE">
            Opening Balance
          </option>

          <option value="ADJUSTMENT">
            Adjustment
          </option>
        </select>

        {/* Transaction Type */}

        <select
          value={
            filters.transactionType
          }
          onChange={(e) =>
            updateFilter(
              "transactionType",
              e.target.value as
                BillingFilterValues["transactionType"],
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A]"
        >
          <option value="ALL">
            All Transactions
          </option>

          <option value="CLOSURE">
            Closure
          </option>

          <option value="CANCELLATION">
            Cancellation
          </option>

          <option value="OPENING_BALANCE">
            Opening Balance
          </option>

          <option value="ADJUSTMENT">
            Adjustment
          </option>
        </select>

        {/* From Date */}

        <div>
          <label className="mb-1 block text-xs font-medium text-[#123B7A]">
            From Date
          </label>

          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) =>
              updateFilter(
                "fromDate",
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A]"
          />
        </div>

        {/* To Date */}

        <div>
          <label className="mb-1 block text-xs font-medium text-[#123B7A]">
            To Date
          </label>

          <input
            type="date"
            value={filters.toDate}
            min={
              filters.fromDate ||
              undefined
            }
            onChange={(e) =>
              updateFilter(
                "toDate",
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A]"
          />
        </div>

        {/* Reset */}

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <RotateCcw
              size={16}
            />

            Reset
          </button>
        </div>
      </div>
    </div>
  );
}