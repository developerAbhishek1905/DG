import {
  BarChart3,
  RotateCcw,
  Search,
  Clock,
  Phone,
  MapPin,
  UserRound,
  SearchCheck,
  PackageX,
  UserX,
} from "lucide-react";

// import { useCallback, useEffect, useState } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import PendingTable from "../components/PendingTable";

import Pagination from "../../../components/ui/Pagination";
import SLAStats from "../components/SLAStats";

import {
  getPendingComplaints,
  searchUserDropdown,
  // sendPendingReminder,
  // updatePendingAction,
} from "../services/pendingApi";

import type {
  PendingAction,
  PendingComplaint,
  PendingReason,
  PendingStatus,
  SLAStatus,
} from "../types/pending.types";
import SummaryCard from "../../../components/ui/SummaryCard";
import SearchSelect, {
  type SearchSelectOption,
} from "../../../components/ui/SearchSelect";
import {
  searchDealerDropdown,
  searchProductCategories,
} from "../../dealers/services/dealerApi";
import { getCitiesByStateAndDistrict } from "../../cityMaster";
import { searchCities } from "../../dealers/services/addressApi";

export interface ComplaintStatusSummary {
  total: number;

  statusCounts: Record<string, number>;
}

export interface ComplaintSummary {
  total: number;

  statusCounts: Record<string, number>;

  reasonCounts: Record<string, number>;
}

export interface PendingSummary {
  total: number;

  statusCounts: {
    PENDING_ON_CALL: number;
    PENDING_ON_VISIT: number;
  };
}

export default function PendingListPage() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const [pendingComplaints, setPendingComplaints] = useState<
    PendingComplaint[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    total: 0,

    statusCounts: {
      PENDING_ON_CALL: 0,
      PENDING_ON_VISIT: 0,
    },

    reasonCounts: {} as Record<string, number>,
  });

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // const [reason, setReason] = useState<PendingReason | "ALL">("ALL");

  // const [slaStatus, setSlaStatus] = useState<SLAStatus | "ALL">("ALL");

  // const [status, setStatus] = useState<PendingStatus | "ALL">("ALL");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [dealerId, setDealerId] = useState("");

  const [cityId, setCityId] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedReason, setSelectedReason] = useState("ALL");

  const [selectedCity, setSelectedCity] = useState<SearchSelectOption | null>(
    null,
  );

  const [selectedCreator, setSelectedCreator] =
    useState<SearchSelectOption | null>(null);

  const [selectedDealer, setSelectedDealer] =
    useState<SearchSelectOption | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<SearchSelectOption | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<SearchSelectOption | null>(null);

  interface FilterOption {
    value: string;
    label: string;
  }

  const [cities, setCities] = useState<FilterOption[]>([]);
  const [creators, setCreators] = useState<FilterOption[]>([]);
  const [dealers, setDealers] = useState<FilterOption[]>([]);
  const [products, setProducts] = useState<FilterOption[]>([]);
  const [categories, setCategories] = useState<SearchSelectOption[]>([]);

  const [citiesLoading, setCitiesLoading] = useState(false);
  const [creatorsLoading, setCreatorsLoading] = useState(false);
  const [dealersLoading, setDealersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [dealerSearch, setDealerSearch] = useState("");
  const dealerRequestId = useRef(0);

  const [categorySearch, setCategorySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [creatorSearch, setCreatorSearch] = useState("");
  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Action Modal
  |--------------------------------------------------------------------------
  */

  const [actionComplaint, setActionComplaint] =
    useState<PendingComplaint | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Debounce Search
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Pending Complaints
  |--------------------------------------------------------------------------
  */

  const fetchPendingComplaints = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getPendingComplaints({
        page,
        limit,
        search: debouncedSearch,
        startDate,
        endDate,
        dealerId,
        cityId,
        createdBy,
        productId,
        categoryId,
        reason: selectedReason === "ALL" ? "" : selectedReason,
      });

      setPendingComplaints(response.data || []);

      setSummary({
        total: response.summary?.total || 0,

        statusCounts: {
          PENDING_ON_CALL: response.summary?.statusCounts?.PENDING_ON_CALL || 0,

          PENDING_ON_VISIT:
            response.summary?.statusCounts?.PENDING_ON_VISIT || 0,
        },

        reasonCounts: response.summary?.reasonCounts || {},
      });

      setTotal(response.pagination?.total || response.data?.length || 0);

      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch pending complaints", error);

      setPendingComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    startDate,
    endDate,
    cityId,
    createdBy,
    dealerId,
    productId,
    categoryId,
    selectedReason,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Initial / Filter Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchPendingComplaints();
  }, [fetchPendingComplaints]);

  /*
  |--------------------------------------------------------------------------
  | Reminder
  |--------------------------------------------------------------------------
  */

  const handleReminder = async (id: string) => {
    try {
      await sendPendingReminder(id);

      await fetchPendingComplaints();
    } catch (error) {
      console.error("Failed to send reminder:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Action
  |--------------------------------------------------------------------------
  */

  const handleAction = async (action: PendingAction) => {
    if (!actionComplaint) {
      return;
    }

    try {
      await updatePendingAction({
        pendingId: actionComplaint.id,
        action,
      });

      setActionComplaint(null);

      await fetchPendingComplaints();
    } catch (error) {
      console.error("Failed to update pending complaint:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Filters
  |--------------------------------------------------------------------------
  */

  // const handleReset = () => {
  //   setSearch("");
  //   setDebouncedSearch("");
  //   setCityId("");
  //   setCreatedBy("");
  //   setDealerId("");
  //   setProductId("");
  //   setSelectedReason("ALL");

  //   setReason("ALL");

  //   setSlaStatus("ALL");

  //   setStatus("ALL");

  //   setStartDate("");

  //   setEndDate("");

  //   setDealerId("");

  //   setPage(1);
  //   setLimit(10);
  // };

  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");

    setCityId("");
    setDealerId("");
    setCreatedBy("");
    setProductId("");

    setSelectedCity(null);
    setSelectedDealer(null);
    setSelectedProduct(null);

    setDealerSearch("");
    setCitySearch("");

    setStartDate("");
    setEndDate("");
    setSelectedReason("ALL");

    setPage(1);
    setLimit(10);
  };
  /*
  |--------------------------------------------------------------------------
  | Filter change helpers
  |--------------------------------------------------------------------------
  */

  // const handleReasonChange = (value: PendingReason | "ALL") => {
  //   setReason(value);
  //   setPage(1);
  // };

  const handleReasonChange = (value: string) => {
    setSelectedReason(value);
    setPage(1);
  };
  const handleSLAChange = (value: SLAStatus | "ALL") => {
    setSlaStatus(value);
    setPage(1);
  };

  const handleStatusChange = (value: PendingStatus | "ALL") => {
    setStatus(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  useEffect(() => {
    const requestId = ++dealerRequestId.current;

    const timer = setTimeout(async () => {
      try {
        setDealersLoading(true);

        const response = await searchDealerDropdown(dealerSearch);

        if (requestId !== dealerRequestId.current) return;

        setDealers(
          response.map((dealer) => ({
            value: dealer._id,
            label: dealer.technicianFirmName || dealer.technicianName,
            data: dealer,
          })),
        );
      } catch (error) {
        if (requestId !== dealerRequestId.current) return;

        console.error("Failed to load dealers:", error);
        setDealers([]);
      } finally {
        if (requestId === dealerRequestId.current) {
          setDealersLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [dealerSearch]);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      try {
        setCategoriesLoading(true);

        const response = await searchProductCategories({
          search: categorySearch.trim(),
        });

        if (!active) return;

        const options: SearchSelectOption[] = response.map((category) => ({
          value: category._id,
          label: `${category.category} - ${category.description}`,
          data: category,
        }));

        setCategories(options);
      } catch (error) {
        if (!active) return;

        console.error("Failed to load categories:", error);
        setCategories([]);
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [categorySearch]);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      try {
        setCitiesLoading(true);

        const response = await searchCities({
          search: citySearch.trim(),
        });

        if (!active) return;

        const options: SearchSelectOption[] = response.map((city) => ({
          value: city.city_id,
          label: city.city_name,
          data: city,
        }));

        setCities(options);
      } catch (error) {
        if (!active) return;

        console.error("Failed to load cities:", error);
        setCities([]);
      } finally {
        if (active) {
          setCitiesLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [citySearch]);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      try {
        setCreatorsLoading(true);

        const response = await searchUserDropdown(creatorSearch.trim());

        if (!active) return;

        setCreators(
          response.map((user) => ({
            value: user._id,
            label: user.name,
            data: user,
          })),
        );
      } catch (error) {
        if (!active) return;

        console.error("Failed to load users:", error);
        setCreators([]);
      } finally {
        if (active) {
          setCreatorsLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [creatorSearch]);

  const reasonColors = [
    "green",
    "red",
    "yellow",
    "pink",
    "cyan",
    "indigo",
    "orange",
    "purple",
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending</h1>
        </div>
      </div>
      {/* Summary Cards */}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
        {/* Total */}

        <button
          type="button"
          onClick={() => {
            setSelectedReason("ALL");
            setPage(1);
          }}
          className="rounded-xl text-left"
        >
          <SummaryCard
            label="Total Pending"
            count={summary.total}
            color="blue"
            compact
          />
        </button>

        {/* Status Counts */}

        <SummaryCard
          label="Pending On Call"
          count={summary.statusCounts.PENDING_ON_CALL}
          color="orange"
          compact
        />

        <SummaryCard
          label="Pending On Visit"
          count={summary.statusCounts.PENDING_ON_VISIT}
          color="purple"
          compact
        />

        {/* Reason Counts */}
        {/* 
        {Object.entries(summary.reasonCounts).map(([reason, count], index) => (
          <SummaryCard
            key={reason}
            label={reason
              .replaceAll("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())}
            count={count}
            color={reasonColors[index % reasonColors.length]}
          />
        ))} */}

        {Object.entries(summary.reasonCounts).map(([reason, count], index) => {
          const isActive = selectedReason === reason;

          return (
            <button
              key={reason}
              type="button"
              onClick={() => {
                setSelectedReason(isActive ? "ALL" : reason);
                setPage(1);
              }}
              className={`
          rounded-xl text-left transition-all
          hover:-translate-y-0.5
          focus-visible:outline-2
          focus-visible:outline-blue-600
          ${isActive ? "ring-2 ring-blue-600 ring-offset-2" : ""}
        `}
            >
              <SummaryCard
                label={reason
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                count={count}
                color={reasonColors[index % reasonColors.length]}
                compact
              />
            </button>
          );
        })}
      </div>
      {/* 
     

      {/* Stats */}

      {/* <SLAStats complaints={pendingComplaints} /> */}

      {/* Filters */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div className="flex flex-col">
            <label className="mb-0.5 text-[11px] font-medium leading-4 text-[#123B7A]">
              Search
            </label>

            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaint, customer..."
                className="
        h-8 w-full rounded-md border border-gray-300
        bg-white pl-7 pr-3 text-xs text-gray-700
        outline-none transition
        focus:border-blue-500 focus:ring-1 focus:ring-blue-100
      "
              />
            </div>
          </div>

          {/* City */}
          <SearchSelect
            label="City"
            placeholder="Search city..."
            value={selectedCity?.label || ""}
            options={cities}
            loading={citiesLoading}
            filterMode="server"
            onSearch={(search) => {
              setCitySearch(search);
            }}
            onSelect={(option) => {
              setSelectedCity(option);
              setCityId(String(option.value));
              setPage(1);
            }}
            onClear={() => {
              setSelectedCity(null);
              setCityId("");
              setCitySearch("");
              setPage(1);
            }}
          />

          {/* Created By */}
          <SearchSelect
            label="Created By"
            placeholder="Search user..."
            value={selectedCreator?.label || ""}
            options={creators}
            loading={creatorsLoading}
            filterMode="server"
            onSearch={setCreatorSearch}
            onSelect={(option) => {
              setSelectedCreator(option);
              setCreatedBy(String(option.value));
              setPage(1);
            }}
            onClear={() => {
              setSelectedCreator(null);
              setCreatedBy("");
              setCreatorSearch("");
              setPage(1);
            }}
          />

          {/* Dealer */}
          <SearchSelect
            label="Dealer"
            placeholder="Search dealer..."
            value={selectedDealer?.label || ""}
            options={dealers}
            loading={dealersLoading}
            filterMode="server"
            onSearch={setDealerSearch}
            onSelect={(option) => {
              console.log(option)
              setSelectedDealer(option);
              setDealerId(String(option?.data?.value));
              setPage(1);
            }}
            onClear={() => {
              setSelectedDealer(null);
              setDealerId("");
              setDealerSearch("");
              setPage(1);
            }}
          />

          {/* Product */}
          <SearchSelect
            label="Category"
            placeholder="Search category..."
            value={selectedCategory?.label || ""}
            options={categories}
            loading={categoriesLoading}
            filterMode="server"
            onSearch={setCategorySearch}
            onSelect={(option) => {
              setSelectedCategory(option);
              setCategoryId(String(option.value));
              setPage(1);
            }}
            onClear={() => {
              setSelectedCategory(null);
              setCategoryId("");
              setCategorySearch("");
              setPage(1);
            }}
          />

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="mb-0.5 text-[11px] font-medium leading-4 text-[#123B7A]">
              From Date
            </label>

            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="
      h-8 w-full rounded-md border border-gray-300
      bg-white px-2.5 text-xs text-gray-700
      outline-none transition
      focus:border-blue-500 focus:ring-1 focus:ring-blue-100
    "
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="mb-0.5 text-[11px] font-medium leading-4 text-[#123B7A]">
              To Date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="
      h-8 w-full rounded-md border border-gray-300
      bg-white px-2.5 text-xs text-gray-700
      outline-none transition
      focus:border-blue-500 focus:ring-1 focus:ring-blue-100
    "
            />
          </div>

          {/* Reason */}
          {/* <select
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="ALL">All Reasons</option>
            {Object.keys(summary.reasonCounts).map((reason) => (
              <option key={reason} value={reason}>
                {reason
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </select> */}

          {/* Reset */}
          <div className="flex flex-col">
            <span
              aria-hidden="true"
              className="mb-0.5 block text-[11px] leading-4 opacity-0"
            >
              Reset
            </span>

            <button
              type="button"
              onClick={handleReset}
              className="
      flex h-8 w-full items-center justify-center gap-2
      rounded-md border border-gray-300
      bg-white px-3 text-xs font-medium text-gray-600
      transition hover:bg-gray-50
    "
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
          Loading pending complaints...
        </div>
      ) : (
        <>
          {/* <PendingTable
            complaints={pendingComplaints}
            onReminder={handleReminder}
            onAction={setActionComplaint}
          /> */}

          <PendingTable
            complaints={pendingComplaints}
            onRefresh={fetchPendingComplaints}
          />
        </>
      )}

      {/* Action Modal */}

      {actionComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              DG Team Action
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {actionComplaint.complaintNumber}
            </p>

            <div className="mt-6 grid gap-3">
              <ActionButton
                label="Continue Pending"
                onClick={() => handleAction("CONTINUE")}
              />

              <ActionButton
                label="Resolve"
                onClick={() => handleAction("RESOLVE")}
              />

              <ActionButton
                label="Reassign Dealer"
                onClick={() => handleAction("REASSIGN")}
              />

              <ActionButton
                label="Escalate"
                onClick={() => handleAction("ESCALATE")}
              />

              <ActionButton
                label="Cancel Complaint"
                onClick={() => handleAction("CANCEL")}
                danger
              />
            </div>

            <button
              type="button"
              onClick={() => setActionComplaint(null)}
              className="mt-5 w-full rounded-lg border border-gray-300 py-2.5 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-3 text-left text-sm font-medium ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
