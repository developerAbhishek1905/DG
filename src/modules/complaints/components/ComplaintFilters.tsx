// import { Search } from "lucide-react";
// import type { ComplaintStatus } from "../types/complaint.types";

// interface ComplaintFiltersProps {
//   search: string;
//   onSearchChange: (value: string) => void;
//   selectedStatus: ComplaintStatus | "ALL";
//   onStatusChange: (value: ComplaintStatus | "ALL") => void;
//   fromDate: string;
//   toDate: string;
//   onFromDateChange: (value: string) => void;
//   onToDateChange: (value: string) => void;
// }

// const statuses: Array<ComplaintStatus | "ALL"> = [
//   "ALL",
//   "REGISTERED",
//   "ALLOCATED",
//   "APPOINTMENT_SCHEDULED",
//   "PENDING",
//   "WORK_IN_PROGRESS",
//   "WORK_COMPLETED",
//   "DG_VERIFICATION",
//   "CLOSED",
//   "CANCELLED",
//   "SUSPENDED"
// ];

// export default function ComplaintFilters({
//   search,
//   onSearchChange,
//   selectedStatus,
//   onStatusChange,
//   fromDate,
//   toDate,
//   onFromDateChange,
//   onToDateChange,
// }: ComplaintFiltersProps) {
//   const handleClearFilters = () => {
//     onSearchChange("");
//     onStatusChange("ALL");
//     onFromDateChange("");
//     onToDateChange("");
//   };

//   return (
//     <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
//       <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
//         {/* Search */}

//         <div className="flex-1">
//           <label className="mb-1.5 block text-sm font-medium text-gray-700">
//             Search
//           </label>

//           <div className="relative">
//             <Search
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => onSearchChange(e.target.value)}
//               placeholder="Complaint no, customer, phone..."
//               className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
//             />
//           </div>
//         </div>

//         {/* Status */}

//         <div className="w-full xl:w-52">
//           <label className="mb-1.5 block text-sm font-medium text-gray-700">
//             Status
//           </label>

//           <select
//             value={selectedStatus}
//             onChange={(e) =>
//               onStatusChange(e.target.value as ComplaintStatus | "ALL")
//             }
//             className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
//           >
//             {statuses.map((status) => (
//               <option key={status} value={status}>
//                 {status === "ALL" ? "All Status" : status.replaceAll("_", " ")}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* From Date */}

//         <div className="w-full xl:w-48">
//           <label className="mb-1.5 block text-sm font-medium text-gray-700">
//             From Date
//           </label>

//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => onFromDateChange(e.target.value)}
//             max={toDate || undefined}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
//           />
//         </div>

//         {/* To Date */}

//         <div className="w-full xl:w-48">
//           <label className="mb-1.5 block text-sm font-medium text-gray-700">
//             To Date
//           </label>

//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => onToDateChange(e.target.value)}
//             min={fromDate || undefined}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
//           />
//         </div>

//         {/* Clear */}

//         <button
//           type="button"
//           onClick={handleClearFilters}
//           className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// }


import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import SearchSelect, {
  type SearchSelectOption,
} from "../../../components/ui/SearchSelect";

import type { ComplaintStatus } from "../types/complaint.types";

import {
  searchDealerDropdown,
  type DealerDropdownOption,
} from "../../dealers/services/dealerApi";

import { useDebounce } from "../../../hooks/useDebounce";

interface ComplaintFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  selectedStatus: ComplaintStatus | "ALL";
  onStatusChange: (value: ComplaintStatus | "ALL") => void;

  fromDate: string;
  toDate: string;

  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;

  selectedDealerId: string;
  onDealerChange: (dealerId: string) => void;
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
  "SUSPENDED",
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

  selectedDealerId,
  onDealerChange,
}: ComplaintFiltersProps) {
  // =========================================
  // DEALER SEARCH
  // =========================================

  const [dealerSearch, setDealerSearch] = useState("");

  const [dealerOptions, setDealerOptions] = useState<
    SearchSelectOption[]
  >([]);

  const [dealerLoading, setDealerLoading] = useState(false);

  const [selectedDealerLabel, setSelectedDealerLabel] =
    useState("");

  const debouncedDealerSearch = useDebounce(dealerSearch, 400);

  // =========================================
  // LOAD DEALERS
  // =========================================

  useEffect(() => {
    const loadDealers = async () => {
      try {
        setDealerLoading(true);

        const dealers =
          await searchDealerDropdown(debouncedDealerSearch);

        const options: SearchSelectOption[] = dealers.map(
          (dealer: DealerDropdownOption) => ({
            value: dealer.value,

            label: `${dealer.technicianFirmName}${
              dealer.technicianName
                ? ` - ${dealer.technicianName}`
                : ""
            }${dealer.city ? ` (${dealer.city})` : ""}`,

            data: dealer,
          }),
        );

        setDealerOptions(options);
      } catch (error) {
        console.error(
          "Failed to load dealer dropdown:",
          error,
        );

        setDealerOptions([]);
      } finally {
        setDealerLoading(false);
      }
    };

    loadDealers();
  }, [debouncedDealerSearch]);

  // =========================================
  // DEALER SELECT
  // =========================================

  const handleDealerSelect = (
    option: SearchSelectOption,
  ) => {
    onDealerChange(String(option.value));

    setSelectedDealerLabel(option.label);
  };

  // =========================================
  // DEALER CLEAR
  // =========================================

  const handleDealerClear = () => {
    onDealerChange("");

    setSelectedDealerLabel("");

    setDealerSearch("");
  };

  // =========================================
  // CLEAR ALL
  // =========================================

  const handleClearFilters = () => {
    onSearchChange("");

    onStatusChange("ALL");

    onFromDateChange("");

    onToDateChange("");

    onDealerChange("");

    setSelectedDealerLabel("");

    setDealerSearch("");
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        {/* =========================================
            MAIN SEARCH
        ========================================= */}

        <div className="w-full lg:min-w-[280px] lg:flex-1">
          <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
            Search
          </label>

          <div className="relative">
            <Search
              size={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              placeholder="Complaint no, customer, phone..."
              autoComplete="off"
              className="
                h-8
                w-full
                rounded-md
                border
                border-gray-300
                bg-white
                pl-7
                pr-3
                text-xs
                text-gray-700
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>
        </div>

        {/* =========================================
            DEALER
        ========================================= */}

        <div className="w-full lg:w-[230px] lg:shrink-0">
          <SearchSelect
            label="Dealer"
            value={
              selectedDealerId
                ? selectedDealerLabel
                : ""
            }
            placeholder="Search dealer..."
            options={dealerOptions}
            loading={dealerLoading}
            onSearch={setDealerSearch}
            onSelect={handleDealerSelect}
            onClear={handleDealerClear}
          />
        </div>

        {/* =========================================
            STATUS
        ========================================= */}

        <div className="w-full lg:w-[155px] lg:shrink-0">
          <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
            Status
          </label>

          <select
            value={selectedStatus}
            onChange={(e) =>
              onStatusChange(
                e.target.value as
                  | ComplaintStatus
                  | "ALL",
              )
            }
            className="
              h-8
              w-full
              rounded-md
              border
              border-gray-300
              bg-white
              px-2
              text-xs
              text-gray-700
              outline-none
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-100
            "
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status === "ALL"
                  ? "All Status"
                  : status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* =========================================
            FROM DATE
        ========================================= */}

        <div className="w-full lg:w-[140px] lg:shrink-0">
          <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
            From Date
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              onFromDateChange(e.target.value)
            }
            max={toDate || undefined}
            className="
              h-8
              w-full
              rounded-md
              border
              border-gray-300
              bg-white
              px-2
              text-xs
              text-gray-700
              outline-none
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-100
            "
          />
        </div>

        {/* =========================================
            TO DATE
        ========================================= */}

        <div className="w-full lg:w-[140px] lg:shrink-0">
          <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
            To Date
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              onToDateChange(e.target.value)
            }
            min={fromDate || undefined}
            className="
              h-8
              w-full
              rounded-md
              border
              border-gray-300
              bg-white
              px-2
              text-xs
              text-gray-700
              outline-none
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-100
            "
          />
        </div>

        {/* =========================================
            CLEAR
        ========================================= */}

        <button
          type="button"
          onClick={handleClearFilters}
          className="
            h-8
            w-full
            shrink-0
            rounded-md
            border
            border-gray-300
            px-3
            text-xs
            font-medium
            text-gray-600
            transition
            hover:bg-gray-50
            hover:text-gray-900
            lg:w-auto
          "
        >
          Clear
        </button>
      </div>
    </div>
  );
}