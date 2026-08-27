import {
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  resetDashboardFilters,
  setDashboardPeriod,
} from "../store/dashboardSlice";

interface Props {
  onRefresh?: () => void;
}

export default function DashboardHeader({
  onRefresh,
}: Props) {
  const dispatch =
    useAppDispatch();

  const {
    period,
  } = useAppSelector(
    (state) =>
      state.dashboard
  );

  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor complaint operations,
          dealer performance and financial
          activity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <CalendarDays
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            value={period}
            onChange={(event) =>
              dispatch(
                setDashboardPeriod(
                  event.target
                    .value as
                    | "TODAY"
                    | "7_DAYS"
                    | "30_DAYS"
                    | "THIS_MONTH"
                )
              )
            }
            className="rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm"
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
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            dispatch(
              resetDashboardFilters()
            );

            onRefresh?.();
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw
            size={16}
          />

          Refresh
        </button>
      </div>
    </div>
  );
}