import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  clearAppointmentFilters,
  setAppointmentDate,
  setAppointmentSearch,
  setAppointmentStatus,
  setAppointmentType,
} from "../store/appointmentSlice";

import type {
  AppointmentStatus,
  AppointmentType,
} from "../types/appointment.types";

export default function AppointmentFilters() {
  const dispatch =
    useAppDispatch();

  const {
    search,
    status,
    type,
    date,
  } = useAppSelector(
    (state) =>
      state.appointments
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
                setAppointmentSearch(
                  event.target.value
                )
              )
            }
            placeholder="Search complaint, customer or dealer..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setAppointmentStatus(
                event.target.value as
                  | AppointmentStatus
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="SCHEDULED">
            Scheduled
          </option>

          <option value="CONFIRMED">
            Confirmed
          </option>

          <option value="RESCHEDULED">
            Rescheduled
          </option>

          <option value="COMPLETED">
            Completed
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>

          <option value="NO_SHOW">
            No Show
          </option>
        </select>

        <select
          value={type}
          onChange={(event) =>
            dispatch(
              setAppointmentType(
                event.target.value as
                  | AppointmentType
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Types
          </option>

          <option value="SERVICE">
            Service
          </option>

          <option value="INSTALLATION">
            Installation
          </option>

          <option value="UNINSTALLATION">
            Uninstallation
          </option>

          <option value="INSPECTION">
            Inspection
          </option>

          <option value="VISIT">
            Visit
          </option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(event) =>
            dispatch(
              setAppointmentDate(
                event.target.value
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        />

        <button
          type="button"
          onClick={() =>
            dispatch(
              clearAppointmentFilters()
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
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