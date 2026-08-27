import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { Appointment } from "../types/appointment.types";

import AppointmentStatusBadge from "./AppointmentStatusBadge";

interface Props {
  appointments: Appointment[];

  onAppointmentClick?: (appointment: Appointment) => void;
}

type DurationFilter = "ALL" | "TODAY" | "7_DAYS" | "30_DAYS" | "CUSTOM";

export default function AppointmentCalendar({
  appointments,
  onAppointmentClick,
}: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());



  const [duration, setDuration] = useState<DurationFilter>("ALL");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [selectedDealerIds, setSelectedDealerIds] = useState<string[]>([]);

  const [
  dealerDropdownOpen,
  setDealerDropdownOpen,
] = useState(false);

const [
  dealerSearch,
  setDealerSearch,
] = useState("");

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  /*
   * Unique dealer list
   */
const dealers = useMemo(() => {
  const dealerMap = new Map<
    string,
    {
      id: string;
      name: string;
      dealerCode: string;
    }
  >();

  appointments.forEach((appointment) => {
    dealerMap.set(
      appointment.dealer.id,
      {
        id: appointment.dealer.id,
        name: appointment.dealer.name,
        dealerCode:
          appointment.dealer.dealerCode,
      }
    );
  });

  return Array.from(
    dealerMap.values()
  );
}, [appointments]);

const filteredDealers =
  useMemo(() => {
    const search =
      dealerSearch
        .trim()
        .toLowerCase();

    if (!search) {
      return dealers;
    }

    return dealers.filter(
      (dealer) =>
        dealer.name
          .toLowerCase()
          .includes(search) ||
        dealer.dealerCode
          .toLowerCase()
          .includes(search)
    );
  }, [
    dealers,
    dealerSearch,
  ]);

  const toggleDealer = (
  dealerId: string
) => {
  setSelectedDealerIds(
    (current) =>
      current.includes(
        dealerId
      )
        ? current.filter(
            (id) =>
              id !==
              dealerId
          )
        : [
            ...current,
            dealerId,
          ]
  );
};

  /*
   * Apply dealer + duration filters
   */
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    /*
     * Dealer filter
     */
if (
  selectedDealerIds.length >
  0
) {
  result = result.filter(
    (appointment) =>
      selectedDealerIds.includes(
        appointment.dealer.id
      )
  );
}

    /*
     * Duration filter
     */
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (duration === "TODAY") {
      const todayString = formatDateForComparison(today);

      result = result.filter(
        (appointment) => appointment.appointmentDate === todayString,
      );
    }

    if (duration === "7_DAYS") {
      const end = new Date(today);

      end.setDate(end.getDate() + 7);

      result = filterByDateRange(result, today, end);
    }

    if (duration === "30_DAYS") {
      const end = new Date(today);

      end.setDate(end.getDate() + 30);

      result = filterByDateRange(result, today, end);
    }

    if (duration === "CUSTOM" && startDate && endDate) {
      result = filterByDateRange(
        result,
        new Date(`${startDate}T00:00:00`),
        new Date(`${endDate}T23:59:59`),
      );
    }

    return result;
  }, [  appointments,
  selectedDealerIds,
  duration,
  startDate,
  endDate]);

  /*
   * Calendar days
   */
  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    const result: Array<number | null> = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      result.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      result.push(day);
    }

    return result;
  }, [year, month]);

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const goPrevious = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppointmentsForDay = (day: number) => {
    const dateString = [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");

    return filteredAppointments.filter(
      (appointment) => appointment.appointmentDate === dateString,
    );
  };

  const handleDurationChange = (value: DurationFilter) => {
    setDuration(value);

    if (value !== "CUSTOM") {
      setStartDate("");
      setEndDate("");
    }
  };

const resetFilters = () => {
  setSelectedDealerIds([]);
  setDuration("ALL");
  setStartDate("");
  setEndDate("");
  setDealerSearch("");
  setDealerDropdownOpen(false);
};

  return (
    <div className="space-y-4">
      {/* ===================================
          FILTERS
      ==================================== */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Dealer */}

{/* Dealer Multi Select */}

<div className="relative flex-1">
  <label className="mb-1.5 block text-sm font-medium text-gray-700">
    Dealers
  </label>

  {/* Dropdown Button */}

  <button
    type="button"
    onClick={() =>
      setDealerDropdownOpen(
        (prev) => !prev
      )
    }
    className="flex min-h-[42px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
      {selectedDealerIds.length ===
      0 ? (
        <span className="text-gray-400">
          Select dealers
        </span>
      ) : selectedDealerIds.length <=
        2 ? (
        selectedDealerIds.map(
          (dealerId) => {
            const dealer =
              dealers.find(
                (item) =>
                  item.id ===
                  dealerId
              );

            if (!dealer) {
              return null;
            }

            return (
              <span
                key={
                  dealer.id
                }
                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-[#123B7A]"
              >
                {
                  dealer.name
                }

                <span
                  role="button"
                  tabIndex={0}
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    toggleDealer(
                      dealer.id
                    );
                  }}
                  className="rounded-full p-0.5 hover:bg-blue-100"
                >
                  <X
                    size={12}
                  />
                </span>
              </span>
            );
          }
        )
      ) : (
        <span className="text-sm text-gray-700">
          {
            selectedDealerIds.length
          }{" "}
          dealers selected
        </span>
      )}
    </div>

    <ChevronDown
      size={17}
      className={`ml-2 shrink-0 text-gray-400 transition-transform ${
        dealerDropdownOpen
          ? "rotate-180"
          : ""
      }`}
    />
  </button>

  {/* Dropdown */}

  {dealerDropdownOpen && (
    <div className="absolute left-0 top-full z-30 mt-2 w-full min-w-[320px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

      {/* Search */}

      <div className="border-b border-gray-100 p-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={
              dealerSearch
            }
            onChange={(e) =>
              setDealerSearch(
                e.target.value
              )
            }
            placeholder="Search dealer..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Actions */}

      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
        <button
          type="button"
          onClick={() =>
            setSelectedDealerIds(
              dealers.map(
                (dealer) =>
                  dealer.id
              )
            )
          }
          className="text-xs font-medium text-[#123B7A] hover:underline"
        >
          Select All
        </button>

        <button
          type="button"
          onClick={() =>
            setSelectedDealerIds(
              []
            )
          }
          className="text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          Clear All
        </button>
      </div>

      {/* Dealer Options */}

      <div className="max-h-64 overflow-y-auto p-1.5">
        {filteredDealers.length >
        0 ? (
          filteredDealers.map(
            (dealer) => {
              const selected =
                selectedDealerIds.includes(
                  dealer.id
                );

              return (
                <button
                  key={
                    dealer.id
                  }
                  type="button"
                  onClick={() =>
                    toggleDealer(
                      dealer.id
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${
                    selected
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm ${
                        selected
                          ? "font-medium text-[#123B7A]"
                          : "font-medium text-gray-800"
                      }`}
                    >
                      {
                        dealer.name
                      }
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {
                        dealer.dealerCode
                      }
                    </p>
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      selected
                        ? "bg-[#123B7A] text-white"
                        : ""
                    }`}
                  >
                    {selected && (
                      <Check
                        size={
                          13
                        }
                      />
                    )}
                  </div>
                </button>
              );
            }
          )
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">
              No dealers
              found.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-3 py-2.5">
        <span className="text-xs text-gray-500">
          {
            selectedDealerIds.length
          }{" "}
          selected
        </span>

        <button
          type="button"
          onClick={() =>
            setDealerDropdownOpen(
              false
            )
          }
          className="rounded-md bg-[#123B7A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B2854]"
        >
          Done
        </button>
      </div>
    </div>
  )}
</div>

          {/* Duration */}

          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Duration
            </label>

            <select
              value={duration}
              onChange={(e) =>
                handleDurationChange(e.target.value as DurationFilter)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All</option>

              <option value="TODAY">Today</option>

              <option value="7_DAYS">Next 7 Days</option>

              <option value="30_DAYS">Next 30 Days</option>

              <option value="CUSTOM">Custom Date Range</option>
            </select>
          </div>

          {/* Custom Start Date */}

          {duration === "CUSTOM" && (
            <>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  From
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  To
                </label>

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </>
          )}

          {/* Reset */}

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Filter Summary */}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          <span className="text-xs text-gray-500">Showing</span>

          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {filteredAppointments.length} Appointments
          </span>

{selectedDealerIds.length >
  0 && (
  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
    {selectedDealerIds.length ===
    1
      ? dealers.find(
          (dealer) =>
            dealer.id ===
            selectedDealerIds[0]
        )?.name
      : `${selectedDealerIds.length} dealers selected`}
  </span>
)}

          {duration !== "ALL" && (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {getDurationLabel(duration, startDate, endDate)}
            </span>
          )}
        </div>
      </div>

      {/* ===================================
          CALENDAR
      ==================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Calendar Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={goPrevious}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>

          <h2 className="font-semibold text-gray-900">{monthName}</h2>

          <button
            type="button"
            onClick={goNext}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Days Header */}

        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-xs font-semibold uppercase text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar */}

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-32 border-b border-r border-gray-100 bg-gray-50/40"
                />
              );
            }

            const dayAppointments = getAppointmentsForDay(day);

            return (
              <div
                key={day}
                className="min-h-32 border-b border-r border-gray-100 p-2"
              >
                {/* Day */}

                <p className="text-xs font-semibold text-gray-500">{day}</p>

                {/* Appointments */}

                <div className="mt-2 space-y-2">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <button
                      type="button"
                      key={appointment.id}
                      onClick={() => onAppointmentClick?.(appointment)}
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 p-2 text-left transition hover:bg-blue-50"
                    >
                      <p className="truncate text-xs font-semibold text-gray-800">
                        {appointment.customer.name}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-500">
                        {appointment.appointmentTime}
                      </p>

                      {appointment.dealer && (
                        <p className="mt-1 truncate text-[10px] text-gray-400">
                          {appointment.dealer.name}
                        </p>
                      )}

                      <div className="mt-2 origin-left scale-90">
                        <AppointmentStatusBadge status={appointment.status} />
                      </div>
                    </button>
                  ))}

                  {dayAppointments.length > 3 && (
                    <p className="text-[11px] font-medium text-gray-400">
                      +{dayAppointments.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================
   HELPERS
========================================= */

function filterByDateRange(
  appointments: Appointment[],
  start: Date,
  end: Date,
) {
  return appointments.filter((appointment) => {
    const appointmentDate = new Date(`${appointment.appointmentDate}T00:00:00`);

    return appointmentDate >= start && appointmentDate <= end;
  });
}

function formatDateForComparison(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDurationLabel(
  duration: DurationFilter,
  startDate: string,
  endDate: string,
) {
  switch (duration) {
    case "TODAY":
      return "Today";

    case "7_DAYS":
      return "Next 7 Days";

    case "30_DAYS":
      return "Next 30 Days";

    case "CUSTOM":
      if (startDate && endDate) {
        return `${startDate} → ${endDate}`;
      }

      return "Custom Date Range";

    default:
      return "All";
  }
}
