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
import {
  getCategoryDropdown,
  type CategoryDropdown,
} from "../../categoryMaster/services/categoryApi";

// interface ComplaintFiltersProps {
//   search: string;
//   onSearchChange: (value: string) => void;

//   selectedStatus: ComplaintStatus | "ALL";
//   onStatusChange: (value: ComplaintStatus | "ALL") => void;

//   fromDate: string;
//   toDate: string;

//   onFromDateChange: (value: string) => void;
//   onToDateChange: (value: string) => void;

//   selectedDealerId: string;
//   onDealerChange: (dealerId: string) => void;
// }

type ComplaintType = "REGULAR" | "WARRANTY" | "INQUIRY";

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

  // NEW
  selectedComplaintType: ComplaintType | "ALL";
  onComplaintTypeChange: (value: ComplaintType | "ALL") => void;

  // NEW
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
}

const complaintTypes: Array<ComplaintType | "ALL"> = [
  "ALL",
  "REGULAR",
  "WARRANTY",
  "INQUIRY",
];

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

  // NEW
  selectedComplaintType,
  onComplaintTypeChange,

  selectedCategoryId,
  onCategoryChange,
}: ComplaintFiltersProps) {
  // =========================================
  // DEALER SEARCH
  // =========================================

  const [dealerSearch, setDealerSearch] = useState("");

  const [dealerOptions, setDealerOptions] = useState<SearchSelectOption[]>([]);

  const [dealerLoading, setDealerLoading] = useState(false);

  const [selectedDealerLabel, setSelectedDealerLabel] = useState("");

  const debouncedDealerSearch = useDebounce(dealerSearch, 400);

  // =========================================
  // CATEGORY / SERVICE SEARCH
  // =========================================

  const [categorySearch, setCategorySearch] = useState("");

  const [categoryOptions, setCategoryOptions] = useState<SearchSelectOption[]>(
    [],
  );

  const [categoryLoading, setCategoryLoading] = useState(false);

  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("");

  const debouncedCategorySearch = useDebounce(categorySearch, 400);
  // =========================================
  // LOAD DEALERS
  // =========================================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoryLoading(true);

        const categories = await getCategoryDropdown(debouncedCategorySearch);

        const options: SearchSelectOption[] = categories.map(
          (item: CategoryDropdown) => ({
            value: item._id,

            // This is what user sees
            label: item.description,

            data: item,
          }),
        );

        setCategoryOptions(options);
      } catch (error) {
        console.error("Failed to load category dropdown:", error);
        setCategoryOptions([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, [debouncedCategorySearch]);

  const handleCategorySelect = (option: SearchSelectOption) => {
    onCategoryChange(String(option.value));
    setSelectedCategoryLabel(option.label);
  };

  const handleCategoryClear = () => {
    onCategoryChange("");
    setSelectedCategoryLabel("");
    setCategorySearch("");
  };

  useEffect(() => {
    const loadDealers = async () => {
      try {
        setDealerLoading(true);

        const dealers = await searchDealerDropdown(debouncedDealerSearch);

        const options: SearchSelectOption[] = dealers.map(
          (dealer: DealerDropdownOption) => ({
            value: dealer.value,

            label: `${dealer.technicianFirmName}${
              dealer.technicianName ? ` - ${dealer.technicianName}` : ""
            }${dealer.city ? ` (${dealer.city})` : ""}`,

            data: dealer,
          }),
        );

        setDealerOptions(options);
      } catch (error) {
        console.error("Failed to load dealer dropdown:", error);

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

  const handleDealerSelect = (option: SearchSelectOption) => {
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

  // const handleClearFilters = () => {
  //   onSearchChange("");

  //   onStatusChange("ALL");

  //   onFromDateChange("");

  //   onToDateChange("");

  //   onDealerChange("");

  //   setSelectedDealerLabel("");

  //   setDealerSearch("");
  // };

  const handleClearFilters = () => {
  onSearchChange("");
  onStatusChange("ALL");

  onComplaintTypeChange("ALL");
  onCategoryChange("");

  onFromDateChange("");
  onToDateChange("");

  onDealerChange("");

  setSelectedDealerLabel("");
  setDealerSearch("");

  setSelectedCategoryLabel("");
  setCategorySearch("");
};

  // return (
  //   <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
  //     <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
  //       {/* =========================================
  //           MAIN SEARCH
  //       ========================================= */}

  //       <div className="w-full lg:min-w-[280px] lg:flex-1">
  //         <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
  //           Search
  //         </label>

  //         <div className="relative">
  //           <Search
  //             size={13}
  //             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
  //           />

  //           <input
  //             type="search"
  //             value={search}
  //             onChange={(e) => onSearchChange(e.target.value)}
  //             placeholder="Complaint no, customer, phone..."
  //             autoComplete="off"
  //             className="
  //               h-8
  //               w-full
  //               rounded-md
  //               border
  //               border-gray-300
  //               bg-white
  //               pl-7
  //               pr-3
  //               text-xs
  //               text-gray-700
  //               outline-none
  //               transition
  //               placeholder:text-gray-400
  //               focus:border-blue-500
  //               focus:ring-1
  //               focus:ring-blue-100
  //             "
  //           />
  //         </div>
  //       </div>

  //       {/* =========================================
  //           DEALER
  //       ========================================= */}

  //       <div className="w-full lg:w-[230px] lg:shrink-0">
  //         <SearchSelect
  //           label="Dealer"
  //           value={selectedDealerId ? selectedDealerLabel : ""}
  //           placeholder="Search dealer..."
  //           options={dealerOptions}
  //           loading={dealerLoading}
  //           onSearch={setDealerSearch}
  //           onSelect={handleDealerSelect}
  //           onClear={handleDealerClear}
  //         />
  //       </div>

  //       <div className="w-full lg:w-[230px] lg:shrink-0">
  //         <SearchSelect
  //           label="Product / Service"
  //           value={selectedCategoryId ? selectedCategoryLabel : ""}
  //           placeholder="Search description..."
  //           options={categoryOptions}
  //           loading={categoryLoading}
  //           onSearch={setCategorySearch}
  //           onSelect={handleCategorySelect}
  //           onClear={handleCategoryClear}
  //         />
  //       </div>

  //       <div className="w-full lg:w-[155px] lg:shrink-0">
  //         <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
  //           Complaint Type
  //         </label>

  //         <select
  //           value={selectedComplaintType}
  //           onChange={(e) =>
  //             onComplaintTypeChange(e.target.value as ComplaintType | "ALL")
  //           }
  //           className="
  //     h-8
  //     w-full
  //     rounded-md
  //     border
  //     border-gray-300
  //     bg-white
  //     px-2
  //     text-xs
  //     text-gray-700
  //     outline-none
  //     focus:border-blue-500
  //     focus:ring-1
  //     focus:ring-blue-100
  //   "
  //         >
  //           {complaintTypes.map((type) => (
  //             <option key={type} value={type}>
  //               {type === "ALL" ? "All Types" : type.replaceAll("_", " ")}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       {/* =========================================
  //           STATUS
  //       ========================================= */}

  //       <div className="w-full lg:w-[155px] lg:shrink-0">
  //         <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
  //           Status
  //         </label>

  //         <select
  //           value={selectedStatus}
  //           onChange={(e) =>
  //             onStatusChange(e.target.value as ComplaintStatus | "ALL")
  //           }
  //           className="
  //             h-8
  //             w-full
  //             rounded-md
  //             border
  //             border-gray-300
  //             bg-white
  //             px-2
  //             text-xs
  //             text-gray-700
  //             outline-none
  //             focus:border-blue-500
  //             focus:ring-1
  //             focus:ring-blue-100
  //           "
  //         >
  //           {statuses.map((status) => (
  //             <option key={status} value={status}>
  //               {status === "ALL" ? "All Status" : status.replaceAll("_", " ")}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       {/* =========================================
  //           FROM DATE
  //       ========================================= */}

  //       <div className="w-full lg:w-[140px] lg:shrink-0">
  //         <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
  //           From Date
  //         </label>

  //         <input
  //           type="date"
  //           value={fromDate}
  //           onChange={(e) => onFromDateChange(e.target.value)}
  //           max={toDate || undefined}
  //           className="
  //             h-8
  //             w-full
  //             rounded-md
  //             border
  //             border-gray-300
  //             bg-white
  //             px-2
  //             text-xs
  //             text-gray-700
  //             outline-none
  //             focus:border-blue-500
  //             focus:ring-1
  //             focus:ring-blue-100
  //           "
  //         />
  //       </div>

  //       {/* =========================================
  //           TO DATE
  //       ========================================= */}

  //       <div className="w-full lg:w-[140px] lg:shrink-0">
  //         <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
  //           To Date
  //         </label>

  //         <input
  //           type="date"
  //           value={toDate}
  //           onChange={(e) => onToDateChange(e.target.value)}
  //           min={fromDate || undefined}
  //           className="
  //             h-8
  //             w-full
  //             rounded-md
  //             border
  //             border-gray-300
  //             bg-white
  //             px-2
  //             text-xs
  //             text-gray-700
  //             outline-none
  //             focus:border-blue-500
  //             focus:ring-1
  //             focus:ring-blue-100
  //           "
  //         />
  //       </div>

  //       {/* =========================================
  //           CLEAR
  //       ========================================= */}

  //       <button
  //         type="button"
  //         onClick={handleClearFilters}
  //         className="
  //           h-8
  //           w-full
  //           shrink-0
  //           rounded-md
  //           border
  //           border-gray-300
  //           px-3
  //           text-xs
  //           font-medium
  //           text-gray-600
  //           transition
  //           hover:bg-gray-50
  //           hover:text-gray-900
  //           lg:w-auto
  //         "
  //       >
  //         Clear
  //       </button>
  //     </div>
  //   </div>
  // );

return (
  <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">

    {/* =====================================================
        ROW 1
        Search | Dealer | Product/Service | Complaint Type
    ====================================================== */}

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">

      {/* SEARCH */}
      <div className="lg:col-span-4">
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
            onChange={(e) => onSearchChange(e.target.value)}
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

      {/* DEALER */}
      <div className="lg:col-span-3">
        <SearchSelect
          label="Dealer"
          value={selectedDealerId ? selectedDealerLabel : ""}
          placeholder="Search dealer..."
          options={dealerOptions}
          loading={dealerLoading}
          onSearch={setDealerSearch}
          onSelect={handleDealerSelect}
          onClear={handleDealerClear}
        />
      </div>

      {/* PRODUCT / SERVICE */}
      <div className="lg:col-span-3">
        <SearchSelect
          label="Product / Service"
          value={selectedCategoryId ? selectedCategoryLabel : ""}
          placeholder="Search description..."
          options={categoryOptions}
          loading={categoryLoading}
          onSearch={setCategorySearch}
          onSelect={handleCategorySelect}
          onClear={handleCategoryClear}
        />
      </div>

      {/* COMPLAINT TYPE */}
      <div className="lg:col-span-2">
        <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
          Complaint Type
        </label>

        <select
          value={selectedComplaintType}
          onChange={(e) =>
            onComplaintTypeChange(
              e.target.value as ComplaintType | "ALL",
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
          {/* {complaintTypes.map((type) => (
            <option key={type} value={type}>
              {type === "ALL"
                ? "All Types"
                : type.replaceAll("_", " ")}
            </option>
          ))} */}
          {complaintTypes.map((type) => (
  <option key={type} value={type}>
    {type === "ALL"
      ? "All Types"
      : type === "WARRANTY"
        ? "REPEAT"
        : type.replaceAll("_", " ")}
  </option>
))}
        </select>
      </div>
    </div>

    {/* =====================================================
        ROW 2
        Status | From Date | To Date | Clear
    ====================================================== */}

    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:items-end">

      {/* STATUS */}
      <div className="lg:col-span-3">
        <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
          Status
        </label>

        <select
          value={selectedStatus}
          onChange={(e) =>
            onStatusChange(
              e.target.value as ComplaintStatus | "ALL",
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
            <option key={status} value={status}>
              {status === "ALL"
                ? "All Status"
                : status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* FROM DATE */}
      <div className="lg:col-span-3">
        <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
          From Date
        </label>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
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

      {/* TO DATE */}
      <div className="lg:col-span-3">
        <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
          To Date
        </label>

        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
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

      {/* CLEAR */}
      <div className="lg:col-span-3">
        <button
          type="button"
          onClick={handleClearFilters}
          className="
            h-8
            w-full
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
          "
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
);
}
