import { RotateCcw, Search } from "lucide-react";

import SearchSelect from "../../../components/ui/SearchSelect";

import {
  BILLING_TYPE_OPTIONS,
  LEDGER_STATUS_OPTIONS,
} from "../constants/billing.constants";

import type { BillingType, LedgerStatus } from "../types/billing.types";

export interface BillingFilterValues {
  search: string;

  dealerId: string;

  status: LedgerStatus | "ALL";

  billingType: BillingType | "ALL";

  // Kept for API compatibility. Billing Type already covers
  // Opening Balance / Cancellation / Adjustment, so it has no
  // separate control and always stays "ALL".
  transactionType:
    | "OPENING_BALANCE"
    | "CLOSURE"
    | "CANCELLATION"
    | "ADJUSTMENT"
    | "ALL";

  fromDate: string;

  toDate: string;
}

export interface BillingDealerOption {
  _id: string;
  name: string;
  code?: string;
}

interface Props {
  filters: BillingFilterValues;

  dealers?: BillingDealerOption[];
  dealersLoading?: boolean;
  selectedDealerLabel?: string;
  onDealerSearch?: (search: string) => void;
  onDealerSelect?: (dealer: BillingDealerOption | null) => void;

  total?: number;

  onChange: (filters: BillingFilterValues) => void;

  onReset: () => void;
}

const labelCls = "mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]";

const controlCls =
  "h-8 w-full rounded-md border border-gray-300 bg-white px-2.5 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100";

export default function BillingFilters({
  filters,
  dealers = [],
  dealersLoading = false,
  selectedDealerLabel = "",
  onDealerSearch,
  onDealerSelect,
  total,
  onChange,
  onReset,
}: Props) {
  const updateFilter = <K extends keyof BillingFilterValues>(
    key: K,
    value: BillingFilterValues[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.dealerId ||
      filters.status !== "ALL" ||
      filters.billingType !== "ALL" ||
      filters.fromDate ||
      filters.toDate,
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div>
          <label className={labelCls}>Search</label>

          <div className="relative">
            <Search
              size={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Complaint, dealer, product..."
              className={`${controlCls} pl-7`}
            />
          </div>
        </div>

        {/* Dealer */}
        <SearchSelect
          label="Dealer"
          placeholder="All dealers"
          value={selectedDealerLabel}
          options={dealers.map((dealer) => ({
            value: dealer._id,
            label: dealer.code
              ? `${dealer.name} - ${dealer.code}`
              : dealer.name,
            data: dealer,
          }))}
          loading={dealersLoading}
          filterMode="server"
          onSearch={onDealerSearch}
          onSelect={(option) =>
            onDealerSelect?.(option.data as BillingDealerOption)
          }
          onClear={() => onDealerSelect?.(null)}
        />

        {/* Billing Type */}
        <div>
          <label className={labelCls}>Billing Type</label>

          <select
            value={filters.billingType}
            onChange={(e) =>
              updateFilter(
                "billingType",
                e.target.value as BillingFilterValues["billingType"],
              )
            }
            className={controlCls}
          >
            <option value="ALL">All Billing Types</option>
            {BILLING_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={labelCls}>Status</label>

          <select
            value={filters.status}
            onChange={(e) =>
              updateFilter(
                "status",
                e.target.value as BillingFilterValues["status"],
              )
            }
            className={controlCls}
          >
            <option value="ALL">All Status</option>
            {LEDGER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className={labelCls}>From Date</label>

          <input
            type="date"
            value={filters.fromDate}
            max={filters.toDate || undefined}
            onChange={(e) => updateFilter("fromDate", e.target.value)}
            className={controlCls}
          />
        </div>

        {/* To Date */}
        <div>
          <label className={labelCls}>To Date</label>

          <input
            type="date"
            value={filters.toDate}
            min={filters.fromDate || undefined}
            onChange={(e) => updateFilter("toDate", e.target.value)}
            className={controlCls}
          />
        </div>

        {/* Count + Reset */}
        <div className="flex items-end justify-between gap-3 sm:col-span-2">
          <p className="text-xs text-gray-500">
            {typeof total === "number" && (
              <>
                <span className="font-semibold text-gray-800">{total}</span>{" "}
                {total === 1 ? "entry" : "entries"} found
              </>
            )}
          </p>

          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-gray-300 px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
