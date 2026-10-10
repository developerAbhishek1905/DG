// import { ArrowLeft, Eye, RotateCcw, Search } from "lucide-react";

import {
  ArrowLeft,
  CircleCheck,
  Eye,
  RotateCcw,
  Search,
  Star,
} from "lucide-react";

import { useEffect, useMemo, useState, useCallback, memo } from "react";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  getClosures,
  approveClosure,
  createRatingReview,
} from "../services/closureApi";

import { toast } from "react-toastify";

import {
  clearClosureFilters,
  setClosureHistoryType,
  setClosureSearch,
  setClosureStatus,
} from "../store/closureSlice";

import type {
  ClosureRecord,
  ClosureStatus,
  ClosureType,
} from "../types/closure.types";
import RatingReviewModal from "../components/RatingReviewModal";
import SummaryCard from "../../../components/ui/SummaryCard";
import Pagination from "../../../components/ui/Pagination";
import SearchSelect, {
  type SearchSelectOption,
} from "../../../components/ui/SearchSelect";
import { useDebounce } from "../../../hooks/useDebounce";
import { searchCities } from "../../dealers/services/addressApi";
import {
  searchDealerDropdown,
  searchProductCategories,
  searchProducts,
} from "../../dealers/services/dealerApi";
import { searchUserDropdown } from "../../pending/services/pendingApi";

interface ClosureSummary {
  total: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  rated: number;
  notRated: number;
}

const initialSummary: ClosureSummary = {
  total: 0,
  pendingApproval: 0,
  approved: 0,
  rejected: 0,
  rated: 0,
  notRated: 0,
};
const formatDateTime = (value?: string | null) => {
  if (!value) {
    return {
      date: "-",
      time: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "-",
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }),

    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

function useRemoteOptions<T>(
  search: string,
  loader: (search: string) => Promise<T[]>,
  mapper: (item: T) => SearchSelectOption,
  enabled = true,
) {
  const [options, setOptions] = useState<SearchSelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!enabled) {
      setOptions([]);
      setLoading(false);
      return;
    }

    let active = true;

    const fetchOptions = async () => {
      setLoading(true);

      try {
        const response = await loader(debouncedSearch);

        if (active) {
          setOptions(response.map(mapper));
        }
      } catch (error) {
        console.error("Dropdown API error:", error);

        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOptions();

    return () => {
      active = false;
    };
  }, [debouncedSearch, enabled, loader, mapper]);

  return { options, loading };
}

export default function ClosureHistoryPage() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { search, status, type } = useAppSelector((state) => state.closures);

  const [closures, setClosures] = useState<ClosureRecord[]>([]);

  const [loading, setLoading] = useState(true);

  const [reviewClosure, setReviewClosure] = useState<ClosureRecord | null>(
    null,
  );

  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [dealerId, setDealerId] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  // const [remarks, setRemarks] = useState<Record<string, string>>({});

  const [approvingId, setApprovingId] = useState<string | null>(null);

  const [summary, setSummary] = useState<ClosureSummary>(initialSummary);

  const [cityId, setCityId] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<
    "ALL" | "PENDING" | "APPROVED"
  >("ALL");

  const [dealerSearch, setDealerSearch] = useState("");
const [citySearch, setCitySearch] = useState<string>("");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  interface FilterOption {
    id: string;
    label: string;
  }

  const [dealers, setDealers] = useState<FilterOption[]>([]);
  const [cities, setCities] = useState<FilterOption[]>([]);
  const [creators, setCreators] = useState<FilterOption[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);

  const [selectedDealer, setSelectedDealer] =
    useState<SearchSelectOption | null>(null);

  const [selectedCity, setSelectedCity] = useState<SearchSelectOption | null>(
    null,
  );

  const [selectedCreator, setSelectedCreator] =
    useState<SearchSelectOption | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<SearchSelectOption | null>(null);

  const [products, setProducts] = useState<SearchSelectOption[]>([]);

  const [productSearch, setProductSearch] = useState("");

  const [dealersLoading, setDealersLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [creatorsLoading, setCreatorsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);


  const handleApproveClosure = async (
    closure: ClosureRecord,
    remark: string,
  ) => {
   

    const trimmedRemark = remark.trim();

    if (!trimmedRemark) {
      toast.error("Please enter remark before approving closure");
      return;
    }

    try {
      setApprovingId(closure._id);

      await approveClosure(closure._id, {
        remark: trimmedRemark,
      });

      toast.success("Closure approved successfully");

      await loadClosures();
    } catch (error) {
      console.error("Approve closure error:", error);

      toast.error("Failed to approve closure");
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);

      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const loadClosures = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getClosures({
        page,
        limit,
        search: debouncedSearch,
        startDate,
        endDate,
        dealerId,
        cityId,
        createdBy,

        categoryId,

        ...(status !== "ALL" && { status }),
        ...(type !== "ALL" && { type }),
      });
     

      setClosures(response.data ?? []);
  

      setTotal(response.pagination?.total ?? 0);
      setTotalPages(response.pagination?.totalPages ?? 1);
      setSummary(response.summary ?? initialSummary);
    } catch (error) {
      console.error("Failed to load closed complaints:", error);

      setClosures([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    startDate,
    endDate,
    dealerId,
    cityId,
    createdBy,
    // productId,
    categoryId,
    status,
    type,
  ]);

  useEffect(() => {
    loadClosures();
  }, [loadClosures]);

  const formatDateTime = (value?: string | null) => {
    if (!value) {
      return {
        date: "-",
        time: "",
      };
    }

    const date = new Date(value);

    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }),

      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleSubmitReview = async (rating: number, review: string) => {
    if (!reviewClosure) {
      return;
    }

    try {
      setReviewSubmitting(true);

      await createRatingReview({
        complaintId: reviewClosure._id,
        rating,
        review,
      });

      toast.success("Rating submitted successfully");

      setReviewClosure(null);

      await loadClosures();
    } catch (error: any) {
      console.error("Submit rating error:", error);

      toast.error(error?.response?.data?.message || "Failed to submit rating");
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      try {
        setDealersLoading(true);

        const response = await searchDealerDropdown(dealerSearch.trim());

        if (!active) return;
        

        setDealers(
          response.map((dealer) => ({
            value: dealer?.value,
            label:
            dealer.label ||
              dealer.technicianFirmName ||
              dealer.technicianName ||
              "Unknown Dealer",
          })),
        );
      } catch {
        if (active) setDealers([]);
      } finally {
        if (active) setDealersLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [dealerSearch]);

 

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
          })),
        );
      } catch {
        if (active) setCreators([]);
      } finally {
        if (active) setCreatorsLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [creatorSearch]);

useEffect(() => {
  let active = true;

  const timer = setTimeout(async () => {
    try {
      setCitiesLoading(true);

      console.log(citySearch)

              const response = await searchCities({
          search: citySearch.trim(),
        });

      console.log("City API response:", response);

      if (!active) return;

      const payload = response as any;

      const cityList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];

      const options: SearchSelectOption[] = cityList.map(
        (city: any) => ({
          value: String(city.city_id),
          label: city.city_name,
        }),
      );

      setCities(options);
    } catch (error) {
      console.error("Failed to load cities:", error);

      if (active) {
        setCities([]);
      }
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
        setCategoriesLoading(true);

        const response = await searchProductCategories({
          search: categorySearch.trim(),
        });

        if (!active) return;

        setCategories(
          response.map((category) => ({
            value: category._id,
            label: `${category.category} - ${category.description}`,
          })),
        );
      } catch (error) {
        if (active) {
          console.error("Failed to load categories:", error);
          setCategories([]);
        }
      } finally {
        if (active) setCategoriesLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [categorySearch]);

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate("/complaints")}
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Closure History</h1>
      </div>

      {/* <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <SummaryCard
          label="Total Closures"
          count={summary.total}
          color="blue"
          compact
        />

        <SummaryCard
          label="Pending Approval"
          count={summary.pendingApproval}
          color="orange"
          compact
        />

        <SummaryCard
          label="Approved"
          count={summary.approved}
          color="green"
          compact
        />

        <SummaryCard
          label="Rejected"
          count={summary.rejected}
          color="red"
          compact
        />

        <SummaryCard
          label="Rated"
          count={summary.rated}
          color="yellow"
          compact
        />

        <SummaryCard
          label="Not Rated"
          count={summary.notRated}
          color="purple"
          compact
        />
      </div> */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div className="flex flex-col">
            <label className="mb-1 block text-[11px] font-medium text-[#123B7A]">
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
                onChange={(event) => {
                  dispatch(setClosureSearch(event.target.value));
                  setPage(1);
                }}
                placeholder="Complaint, customer..."
                className="h-8 w-full rounded-md border border-gray-300 pl-8 pr-2 text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* From Date */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#123B7A]">
              From Date
            </label>

            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => {
                setStartDate(event.target.value);
                setPage(1);
              }}
              className="h-8 w-full rounded-md border border-gray-300 px-2 text-xs"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#123B7A]">
              To Date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => {
                setEndDate(event.target.value);
                setPage(1);
              }}
              className="h-8 w-full rounded-md border border-gray-300 px-2 text-xs"
            />
          </div>

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
             
              setSelectedDealer(option);
              setDealerId(String(option?.value));
              setPage(1);
            }}
            onClear={() => {
              setSelectedDealer(null);
              setDealerId("");
              setDealerSearch("");
              setPage(1);
            }}
          />

          {/* City */}
          <SearchSelect
            label="City"
            placeholder="Search city..."
            value={selectedCity?.label || ""}
            options={cities}
            loading={citiesLoading}
            filterMode="server"
            onSearch={setCitySearch}
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

          {/* Category */}
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
              onClick={() => {
                dispatch(clearClosureFilters());

                setStartDate("");
                setEndDate("");
                setDealerId("");
                setCityId("");
                setCreatedBy("");
                setCategoryId("");

                setSelectedDealer(null);
                setSelectedCity(null);
                setSelectedCreator(null);
                setSelectedCategory(null);

                setDealerSearch("");
                setCitySearch("");
                setCreatorSearch("");
                setCategorySearch("");

                setApprovalFilter("ALL");
                setPage(1);
              }}
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

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading closure history...
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1600px] w-full table-auto text-left text-sm">
              <colgroup>
                <col className="w-[160px]" /> {/* Complaint */}
                <col className="w-[170px]" /> {/* Customer */}
                <col className="w-[140px]" /> {/* City */}
                <col className="w-[170px]" /> {/* Product */}
                <col className="w-[110px]" /> {/* Quote */}
                <col className="w-[150px]" /> {/* Created By */}
                <col className="w-[180px]" /> {/* Technician */}
                <col className="w-[170px]" /> {/* Reason */}
                <col className="w-[140px]" /> {/* Updated */}
                <col className="w-[220px]" /> {/* Remark */}
                <col className="w-[120px]" /> {/* Actions */}
              </colgroup>

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    "Complaint",
                    "Customer",
                    "City",
                    "Product",
                    "Quote",
                    "Created By",
                    "Technician",
                    "Reason",
                    "Updated",
                    "Remark",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 last:text-right"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {closures.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      No closed complaints found.
                    </td>
                  </tr>
                ) : (
                  closures.map((closure) => (
                    <ClosureRow
                      key={closure._id}
                      closure={closure}
                      isApproving={approvingId === closure._id}
                      onApprove={handleApproveClosure}
                      onNavigate={(id) => navigate(`/complaints/${id}`)}
                      onReview={setReviewClosure}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 px-4 py-3">
            <Pagination
              page={page}
              limit={limit}
              total={total}
              totalPages={totalPages}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}
      <RatingReviewModal
        open={Boolean(reviewClosure)}
        complaintNumber={reviewClosure?.complaintNumber}
        dealerName={
          reviewClosure?.allocatedDealerId?.technicianFirmName ||
          reviewClosure?.dealerName ||
          ""
        }
        loading={reviewSubmitting}
        onClose={() => {
          if (!reviewSubmitting) {
            setReviewClosure(null);
          }
        }}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

function ClosureTypeBadge({ type }: { type: ClosureType }) {
  return (
    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
      {type}
    </span>
  );
}

function ClosureStatusBadge({ status }: { status: ClosureStatus }) {
  const styles = {
    DRAFT: "border-gray-200 bg-gray-50 text-gray-600",

    SUBMITTED: "border-blue-200 bg-blue-50 text-blue-700",

    VERIFIED: "border-green-200 bg-green-50 text-green-700",

    REJECTED: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

interface ClosureRowProps {
  closure: ClosureRecord;

  isApproving: boolean;

  onApprove: (closure: ClosureRecord, remark: string) => Promise<void>;

  onNavigate: (id: string) => void;

  onReview: (closure: ClosureRecord) => void;
}

const ClosureRow = memo(function ClosureRow({
  closure,
  isApproving,
  onApprove,
  onNavigate,
  onReview,
}: ClosureRowProps) {
  const [remark, setRemark] = useState("");

  const isApproved = closure.closureApproved === true;

  return (
    <>
      {/* <tr
        className={`
        transition-colors
        ${
          isApproved
            ? "border-l-4 border-l-green-500 bg-green-50"
            : "hover:bg-gray-50"
        }
      `}
      >
        <td className="min-w-0 px-3 py-3 xl:px-2">
          <button
            type="button"
            onClick={() => onNavigate(closure._id)}
            className="
            whitespace-nowrap
            text-[11px] font-semibold
            text-[#123B7A]
            hover:underline
          "
          >
            {closure.complaintNumber || "-"}
          </button>
        </td>

  

        <td className="min-w-0 px-3 py-3 xl:px-2">
          <p
            className="truncate text-xs font-medium text-gray-900"
            title={closure.customerName || closure.customerId?.name || ""}
          >
            {closure.customerName || closure.customerId?.name || "-"}
          </p>

          <p className="mt-1 truncate text-[10px] text-gray-500">
            {closure.phone || closure.customerId?.phone || "-"}
          </p>
        </td>

       

        <td className="min-w-0 px-3 py-3 xl:px-2">
          <p
            className="truncate text-[11px] font-medium text-gray-700"
            title={
              closure.allocatedDealerId?.technicianFirmName ||
              closure.dealerName ||
              ""
            }
          >
            {closure.allocatedDealerId?.technicianFirmName ||
              closure.dealerName ||
              "-"}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-gray-500">
            {closure.allocatedDealerId?.technicianName || ""}
          </p>
        </td>

     

        <td className="min-w-0 px-3 py-3 xl:px-2">
          <p
            className="truncate text-[11px] font-medium text-gray-700"
            title={closure.productName || ""}
          >
            {closure.productName || "-"}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-gray-500">
            {closure.productType || ""}
          </p>
        </td>

       

        <td className="min-w-0 px-3 py-3 xl:px-2">
          {closure.category ? (
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {closure.category}
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </td>

      

        <td className="min-w-0 px-3 py-3 xl:px-2">
          <ClosureStatusBadge status={closure.status} />
          <p className="leading-4 text-green-800 text-[10px] px-1 py-2">
            {closure?.closingReason}
          </p>
        </td>

   

        <td className="px-2 py-3">
          {closure.closedAt ? (
            <>
              <p className="whitespace-nowrap text-[10px] font-medium text-gray-600">
                {new Date(closure.closedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[9px] text-gray-400">
                {new Date(closure.closedAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </>
          ) : (
            "-"
          )}
        </td>

        

        <td className="min-w-0 px-2 py-3 align-middle">
          {isApproved ? (
            <div className="min-w-0">
              <p
                title={closure.closureApprovalRemark || ""}
                className="
                line-clamp-2
                text-[11px] font-medium
                leading-4 text-green-800
              "
              >
                {closure.closureApprovalRemark || "-"}
              </p>

              {closure.closureApprovedAt && (
                <p className="mt-1 whitespace-nowrap text-[9px] text-green-600">
                  {new Date(closure.closureApprovedAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={remark}
              onChange={(event) => setRemark(event.target.value)}
              placeholder="Enter remark..."
              className="
              h-8 w-full min-w-0
              rounded-md
              border border-gray-300
              px-2 text-[10px]
              outline-none
              placeholder:text-gray-400
              focus:border-[#123B7A]
            "
            />
          )}
        </td>

       

        <td className="px-1 py-3 text-center align-middle">
          <div className="flex items-center justify-center gap-1">
            {!isApproved && (
              <button
                type="button"
                disabled={isApproving || !remark.trim()}
                onClick={() => onApprove(closure, remark)}
                title="Approve Closure"
                className="
              flex h-8 w-8
              items-center justify-center
              rounded-md
              text-green-600
              hover:bg-green-100
              hover:text-green-700
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
              >
                <CircleCheck
                  size={17}
                  className={isApproving ? "animate-pulse" : ""}
                />
              </button>
            )}

            {closure.rating && closure.rating > 0 ? (
              <div
                title={`Rated ${closure.rating}/5`}
                className="
          flex items-center gap-1
          whitespace-nowrap
          rounded-md
          bg-amber-50
          px-2 py-1
        "
              >
                <Star size={14} className="fill-amber-400 text-amber-400" />

                <span className="text-[11px] font-semibold text-amber-700">
                  {closure.rating}/5
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onReview(closure)}
                title="Rate & Review Dealer"
                className="
          flex h-8 w-8
          items-center justify-center
          rounded-md
          text-amber-500
          hover:bg-amber-50
          hover:text-amber-600
        "
              >
                <Star size={17} />
              </button>
            )}
          </div>
        </td>
      </tr> */}
      <tr
        className={`transition-colors ${
          isApproved
            ? "border-l-4 border-l-green-500 bg-green-50"
            : "hover:bg-gray-50"
        }`}
      >
        {/* Complaint */}
        <td className="whitespace-nowrap px-3 py-3">
          <button
            type="button"
            onClick={() => onNavigate(closure._id)}
            className="text-xs font-semibold text-[#123B7A] hover:underline"
          >
            {closure.complaintNumber || "-"}
          </button>
        </td>

        {/* Customer */}
        <td className="px-3 py-3">
          <p className="whitespace-nowrap text-xs font-semibold text-gray-800">
            {closure.customerName || closure.customerId?.name || "-"}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            {closure.phone || closure.customerId?.phone || "-"}
          </p>
        </td>

        {/* City */}
        <td className="px-3 py-3">
          <span className="whitespace-nowrap text-xs text-gray-700">
            {closure.address?.city || "-"}
          </span>
        </td>

        {/* Product */}
        <td className="px-3 py-3">
          <p className="whitespace-nowrap text-xs font-medium text-gray-800">
            {closure.productName || "-"}
          </p>
          {/* <p className="mt-1 text-[11px] text-gray-500">
            {closure.productType || "-"}
          </p> */}

          {closure.units != null && (
                        <p className="mt-1 text-[10px] text-gray-600">
                          Units: {closure.units}
                        </p>
                      )}
          {closure.category ? (
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {closure.category}
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </td>

        {/* Quote */}
        <td className="whitespace-nowrap px-3 py-3">
          <span className="text-xs font-semibold text-gray-800">
            ₹{Number(closure.quoteAmount ?? 0).toLocaleString("en-IN")}
          </span>
        </td>

        {/* Created By */}
        <td className="px-3 py-3">
          <p className="whitespace-nowrap text-xs text-gray-700">
            {closure.createdBy?.name || "-"}
          </p>
        </td>

        {/* Technician */}
        <td className="px-3 py-3">
          <p className="whitespace-nowrap text-xs font-medium text-gray-800">
            {closure.allocatedDealerId?.technicianFirmName ||
              closure.dealerName ||
              "-"}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            {closure.allocatedDealerId?.technicianName || ""}
          </p>
        </td>

        {/* Reason */}
        {/* <td className="px-3 py-3">
          <p className="max-w-[170px] whitespace-normal text-xs text-gray-700">
            {closure.closingReason || "-"}
          </p>
        </td> */}
        <td className="min-w-0 px-3 py-3 xl:px-2">
          <ClosureStatusBadge status={closure.status} />
          <p className="leading-4 text-green-800 text-[10px] px-1 py-2">
            {closure?.closingReason}
          </p>
        </td>

        {/* Updated */}
        <td className="whitespace-nowrap px-3 py-3">
          <p className="text-xs text-gray-700">
            {formatDateTime(closure.updatedAt).date}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            {formatDateTime(closure.updatedAt).time}
          </p>
        </td>

        {/* Remark */}
        <td className="px-3 py-3">
          {isApproved ? (
            <div>
              <p className="max-w-[220px] whitespace-normal text-xs font-medium text-green-800">
                {closure.closureApprovalRemark || "-"}
              </p>

              {closure.closureApprovedAt && (
                <p className="mt-1 text-[10px] text-green-600">
                  {new Date(closure.closureApprovedAt).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={remark}
              onChange={(event) => setRemark(event.target.value)}
              placeholder="Enter remark..."
              className="h-9 w-[200px] rounded-md border border-gray-300 px-3 text-xs outline-none focus:border-[#123B7A]"
            />
          )}
        </td>

        {/* Actions */}
        <td className="px-3 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            {!isApproved && (
              <button
                type="button"
                disabled={isApproving || !remark.trim()}
                onClick={() => onApprove(closure, remark)}
                title="Approve Closure"
                className="flex h-8 w-8 items-center justify-center rounded-md text-green-600 hover:bg-green-100 disabled:opacity-40"
              >
                <CircleCheck size={17} />
              </button>
            )}

            {closure.rating && closure.rating > 0 ? (
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-amber-700">
                  {closure.rating}/5
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onReview(closure)}
                title="Rate & Review Dealer"
                className="flex h-8 w-8 items-center justify-center rounded-md text-amber-500 hover:bg-amber-50"
              >
                <Star size={17} />
              </button>
            )}
          </div>
        </td>
      </tr>
    </>
  );
});
