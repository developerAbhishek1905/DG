import { Search } from "lucide-react";
import type { ComplaintStatus } from "../types/complaint.types";

interface ComplaintFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: ComplaintStatus | "ALL";
  onStatusChange: (value: ComplaintStatus | "ALL") => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

const statuses: Array<ComplaintStatus | "ALL"> = [
  "ALL",
  "REGISTERED",
  "ALLOCATED",
  "APPOINTMENT_SCHEDULED",
  "PENDING",
  "WORK_IN_PROGRESS",
  "WORK_COMPLETED",
  "DG_VERIFICATION",
  "CLOSED",
  "CANCELLED",
  "SUSPENDED"
];

export default function ComplaintFilters({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: ComplaintFiltersProps) {
  const handleClearFilters = () => {
    onSearchChange("");
    onStatusChange("ALL");
    onFromDateChange("");
    onToDateChange("");
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        {/* Search */}

        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Search
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Complaint no, customer, phone..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
            />
          </div>
        </div>

        {/* Status */}

        <div className="w-full xl:w-52">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={selectedStatus}
            onChange={(e) =>
              onStatusChange(e.target.value as ComplaintStatus | "ALL")
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "ALL" ? "All Status" : status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}

        <div className="w-full xl:w-48">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            From Date
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            max={toDate || undefined}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
          />
        </div>

        {/* To Date */}

        <div className="w-full xl:w-48">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            To Date
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            min={fromDate || undefined}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
          />
        </div>

        {/* Clear */}

        <button
          type="button"
          onClick={handleClearFilters}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
