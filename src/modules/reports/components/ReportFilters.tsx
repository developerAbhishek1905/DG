import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  resetReportFilters,
  setReportDateFrom,
  setReportDateTo,
  setReportPeriod,
  setReportSearch,
  setReportStatus,
} from "../store/reportSlice";

import type {
  ReportPeriod,
} from "../types/report.types";

interface Props {
  statuses?: string[];
}

export default function ReportFilters({
  statuses = [],
}: Props) {
  const dispatch =
    useAppDispatch();

  const { filters } =
    useAppSelector(
      (state) =>
        state.reports
    );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <div className="relative md:col-span-2">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={
              filters.search
            }
            onChange={(event) =>
              dispatch(
                setReportSearch(
                  event.target.value
                )
              )
            }
            placeholder="Search report..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#123B7A]"
          />
        </div>

        <select
          value={
            filters.period
          }
          onChange={(event) =>
            dispatch(
              setReportPeriod(
                event.target
                  .value as ReportPeriod
              )
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        >
          <option value="TODAY">
            Today
          </option>

          <option value="7_DAYS">
            Last 7 Days
          </option>

          <option value="30_DAYS">
            Last 30 Days
          </option>

          <option value="THIS_MONTH">
            This Month
          </option>

          <option value="CUSTOM">
            Custom Range
          </option>
        </select>

        {statuses.length >
          0 && (
          <select
            value={
              filters.status
            }
            onChange={(event) =>
              dispatch(
                setReportStatus(
                  event.target.value
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="ALL">
              All Status
            </option>

            {statuses.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status.replaceAll(
                    "_",
                    " "
                  )}
                </option>
              )
            )}
          </select>
        )}

        <input
          type="date"
          value={
            filters.dateFrom
          }
          disabled={
            filters.period !==
            "CUSTOM"
          }
          onChange={(event) =>
            dispatch(
              setReportDateFrom(
                event.target.value
              )
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-100"
        />

        <input
          type="date"
          value={
            filters.dateTo
          }
          disabled={
            filters.period !==
            "CUSTOM"
          }
          onChange={(event) =>
            dispatch(
              setReportDateTo(
                event.target.value
              )
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-100"
        />

        <button
          type="button"
          onClick={() =>
            dispatch(
              resetReportFilters()
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
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