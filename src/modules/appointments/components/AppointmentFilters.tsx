import { RotateCcw, Search } from "lucide-react";

import { COMPLAINT_STATUS_OPTIONS } from "../../complaints/constants/complaint.constants";

/*
| Appointments are complaints, so the filters use the real complaint
| statuses / complaint types the backend stores and filters on.
*/

const TYPE_OPTIONS = [
  { value: "REGULAR", label: "Regular" },
  { value: "REPEAT", label: "Repeat" },
  { value: "WARRANTY", label: "Warranty" },
  { value: "INQUIRY", label: "Inquiry" },
];

interface AppointmentFiltersProps {
  search: string;
  status: string;
  type: string;
  date: string;
  total?: number;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDateChange: (value: string) => void;

  onReset: () => void;
}

const labelCls =
  "mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]";

const controlCls =
  "h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100";

export default function AppointmentFilters({
  search,
  status,
  type,
  date,
  total,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onDateChange,
  onReset,
}: AppointmentFiltersProps) {
  const hasActiveFilters = Boolean(
    search || status !== "ALL" || type !== "ALL" || date,
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelCls}>Search</label>

          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Complaint, customer, phone, dealer..."
              className={`${controlCls} pl-9`}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Status</label>

          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={controlCls}
          >
            <option value="ALL">All Status</option>

            {COMPLAINT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Complaint Type</label>

          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className={controlCls}
          >
            <option value="ALL">All Types</option>

            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Complaint Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className={controlCls}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          {typeof total === "number" && (
            <>
              <span className="font-semibold text-gray-800">{total}</span>{" "}
              {total === 1 ? "complaint" : "complaints"} found
            </>
          )}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
