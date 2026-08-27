import { Search, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  setComplaintSearch,
  setSelectedStatus,
  clearComplaintFilters,
} from "../store/complaintSlice";

import {
  COMPLAINT_STATUS_OPTIONS,
} from "../constants/complaint.constants";

export default function ComplaintFilters() {
  const dispatch = useAppDispatch();

  const { search, selectedStatus } =
    useAppSelector((state) => state.complaints);

  return (
    <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              dispatch(setComplaintSearch(e.target.value))
            }
            placeholder="Search complaint number, customer..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) =>
            dispatch(
              setSelectedStatus(
                e.target.value as typeof selectedStatus
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="ALL">All Status</option>

          {COMPLAINT_STATUS_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() =>
            dispatch(clearComplaintFilters())
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}