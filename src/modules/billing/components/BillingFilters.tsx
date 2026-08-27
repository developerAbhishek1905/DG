import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  clearBillingFilters,
  setBillingSearch,
  setBillingStatus,
  setBillingType,
} from "../store/billingSlice";

import type {
  BillingStatus,
  RateType,
} from "../types/billing.types";

export default function BillingFilters() {
  const dispatch =
    useAppDispatch();

  const {
    search,
    status,
    type,
  } = useAppSelector(
    (state) =>
      state.billing
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              dispatch(
                setBillingSearch(
                  event.target.value
                )
              )
            }
            placeholder="Search bill, complaint or dealer..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setBillingStatus(
                event.target.value as
                  | BillingStatus
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="DRAFT">
            Draft
          </option>

          <option value="GENERATED">
            Generated
          </option>

          <option value="UNDER_REVIEW">
            Under Review
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="REJECTED">
            Rejected
          </option>

          <option value="PAID">
            Paid
          </option>
        </select>

        <select
          value={type}
          onChange={(event) =>
            dispatch(
              setBillingType(
                event.target.value as
                  | RateType
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Closure Types
          </option>

          <option value="VISIT">
            Visit
          </option>

          <option value="SERVICE">
            Service
          </option>

          <option value="PART">
            Part
          </option>

          <option value="INSTALLATION">
            Installation
          </option>

          <option value="UNINSTALLATION">
            Uninstallation
          </option>
        </select>

        <button
          onClick={() =>
            dispatch(
              clearBillingFilters()
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <RotateCcw
            size={16}
          />

          Reset
        </button>
      </div>
    </div>
  );
}