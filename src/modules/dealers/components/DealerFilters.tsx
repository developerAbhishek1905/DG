import { RotateCcw, Search } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  clearDealerFilters,
  setDealerCity,
  setDealerSearch,
  setDealerStatus,
} from "../store/dealerSlice";

import type { DealerStatus } from "../types/dealer.types";

interface Props {
  search: string;
  status: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function DealerFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dealer, mobile, email..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">All Status</option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>

            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>
    </div>
  );
}
