import { RotateCcw, Search, X } from "lucide-react";

import { useEffect, useMemo, useState, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import CancellationTable from "../components/CancellationTable";
import ApproveCancellationModal from "../components/ApproveCancellationModal";
import RejectCancellationModal from "../components/RejectCancellationModal";

import {
  approveCancellation,
  getCancellationRequests,
  rejectCancellation,
} from "../services/cancellationApi";

import {
  clearCancellationFilters,
  closeApproveCancellationModal,
  closeRejectCancellationModal,
  openApproveCancellationModal,
  openRejectCancellationModal,
  setCancellationReason,
  setCancellationSearch,
  setCancellationStatus,
  setCancellationVerification,
} from "../store/cancellationSlice";

import type {
  ApproveCancellationPayload,
  CancellationReasonType,
  CancellationRequest,
  CancellationStatus,
  RejectCancellationPayload,
  VerificationStatus,
} from "../types/cancellation.types";
import { updateAppointmentStatus } from "../../appointments/services/appointmentApi";
import { toast } from "react-toastify";
import SummaryCard from "../../../components/ui/SummaryCard";
import { useDebounce } from "../../../hooks/useDebounce";
import SearchSelect from "../../../components/ui/SearchSelect";
import { searchCities } from "../../dealers/services/addressApi";
import {
  searchDealerDropdown,
  searchProductCategories,
  searchProducts,
} from "../../dealers/services/dealerApi";
import { searchUserDropdown } from "../../pending/services/pendingApi";
import { getComplaintById } from "../../complaints/services/complaintApi";
import DealerInfoCard from "../../complaints/components/DealerInfoCard";

interface CancellationSummary {
  total: number;
  statusCounts: Record<string, number>;
  reasonCounts: Record<string, number>;
}

const initialSummary: CancellationSummary = {
  total: 0,
  statusCounts: {},
  reasonCounts: {},
};

export default function CancellationListPage() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dealerId, setDealerId] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [requests, setRequests] = useState<CancellationRequest[]>([]);

  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [summary, setSummary] = useState<CancellationSummary>(initialSummary);

  const [selectedReason, setSelectedReason] = useState("ALL");

  const [cityId, setCityId] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [selectedCity, setSelectedCity] = useState<SearchSelectOption | null>(
    null,
  );

  const [selectedDealer, setSelectedDealer] =
    useState<SearchSelectOption | null>(null);

  const [selectedCreator, setSelectedCreator] =
    useState<SearchSelectOption | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<SearchSelectOption | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<SearchSelectOption | null>(null);

  const [cities, setCities] = useState<SearchSelectOption[]>([]);
  const [dealers, setDealers] = useState<SearchSelectOption[]>([]);
  const [creators, setCreators] = useState<SearchSelectOption[]>([]);
  const [products, setProducts] = useState<SearchSelectOption[]>([]);
  const [categories, setCategories] = useState<SearchSelectOption[]>([]);

  const [citySearch, setCitySearch] = useState("");
  const [dealerSearch, setDealerSearch] = useState("");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const [citiesLoading, setCitiesLoading] = useState(false);
  const [dealersLoading, setDealersLoading] = useState(false);
  const [creatorsLoading, setCreatorsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  interface AssignmentDealer {
    _id: string;
    technicianName?: string;
    technicianFirmName?: string;
    mobileNumber?: string;
    headCode?: string;
    rating?: number;
    status?: string;
  }

  interface AssignmentComplaint {
    _id: string;
    complaintNumber: string;
    status: string;
    allocatedDealerId?: AssignmentDealer | null;
  }

  const [assignmentComplaint, setAssignmentComplaint] =
    useState<AssignmentComplaint | null>(null);

  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  const {
    // search,
    status,
    reason,
    verification,

    selectedCancellationId,

    approveModalOpen,

    rejectModalOpen,
  } = useAppSelector((state) => state.cancellations);

  // const [requests, setRequests] = useState<CancellationRequest[]>([]);

  // const [loading, setLoading] = useState(true);

  const reasonColors = [
    "green",
    "purple",
    "pink",
    "cyan",
    "indigo",
    "yellow",
  ] as const;

  const handleResetFilters = () => {
    setSearch("");
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

    setSelectedReason("ALL");

    dispatch(clearCancellationFilters());

    setPage(1);
  };

  const formatReason = (value: string) =>
    value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCancellationRequests({
        page,
        limit,
        search: debouncedSearch,
        startDate,
        endDate,
        dealerId,
        cityId,
        createdBy,
        // productId,
        categoryId,
        reason: selectedReason,
        status,
        verification,
      });
      setRequests(response.data || []);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);

      // Requires summary in backend response
      setSummary(response.summary ?? initialSummary);
    } catch (error) {
      console.error("Failed to load cancellation requests:", error);
      toast.error("Failed to load cancellation requests");
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
    productId,
    categoryId,
    selectedReason,
    status,
    verification,
  ]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  // const filtered = useMemo(
  //   () =>
  //     requests.filter((request) => {
  //       const query = search.trim().toLowerCase();

  //       const matchesSearch =
  //         !query ||
  //         request.complaintNumber.toLowerCase().includes(query) ||
  //         request.customer.name.toLowerCase().includes(query) ||
  //         request.dealer?.name.toLowerCase().includes(query);

  //       const matchesStatus = status === "ALL" || request.status === status;

  //       const matchesReason = reason === "ALL" || request.reason === reason;

  //       const matchesVerification =
  //         verification === "ALL" ||
  //         request.verification.status === verification;

  //       return (
  //         matchesSearch && matchesStatus && matchesReason && matchesVerification
  //       );
  //     }),
  //   [requests, search, status, reason, verification],
  // );

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      try {
        setCitiesLoading(true);

        const response = await searchCities({
          search: citySearch.trim(),
        });

        if (!active) return;

        const cityList = Array.isArray(response) ? response : [];

        setCities(
          cityList.map((city) => ({
            value: String(city.city_id),
            label: city.city_name,
            data: city,
          })),
        );
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
        setDealersLoading(true);

        const response = await searchDealerDropdown(dealerSearch.trim());

        if (!active) return;

        setDealers(
          response.map((dealer) => ({
            value: dealer._id,
            label:
              dealer.technicianFirmName ||
              dealer.technicianName ||
              "Unknown Dealer",
            data: dealer,
          })),
        );
      } catch (error) {
        if (!active) return;

        console.error("Failed to load dealers:", error);
        setDealers([]);
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
            data: user,
          })),
        );
      } catch (error) {
        if (!active) return;

        console.error("Failed to load users:", error);
        setCreators([]);
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
        setProductsLoading(true);

        const response = await searchProducts(productSearch.trim());

        if (!active) return;

        setProducts(
          response.map((product) => ({
            value: product.product_id,
            label: product.product_name,
            data: product,
          })),
        );
      } catch (error) {
        if (!active) return;

        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        if (active) setProductsLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [productSearch]);

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
            value: String(category._id),
            label: `${category.category} - ${category.description}`,
            data: category,
          })),
        );
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

  const selectedRequest = requests.find(
    (request) => request.id === selectedCancellationId,
  );

  const handleApprove = async (payload: ApproveCancellationPayload) => {
    await approveCancellation(payload);

    dispatch(closeApproveCancellationModal());

    await loadRequests();
  };

  const handleReject = async (payload: RejectCancellationPayload) => {
    await rejectCancellation(payload);

    dispatch(closeRejectCancellationModal());

    await loadRequests();
  };
  const handleReassignDealer = async (request: CancellationRequest) => {
    if (request.status === "CANCELLED") {
      toast.error("Cancelled complaint cannot be reassigned");
      return;
    }

    try {
      setAssignmentLoading(true);
      setAssignmentOpen(true);
      setAssignmentComplaint(null);

      const response = await getComplaintById(request._id);

      // Your getComplaintById service may return either
      // the complaint directly or { data: complaint }.
      const complaint = "data" in response ? response.data : response;

      setAssignmentComplaint(complaint as AssignmentComplaint);
    } catch (error) {
      console.error("Failed to fetch complaint:", error);
      toast.error("Failed to load complaint details");
      setAssignmentOpen(false);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleCancellationAction = async (
    complaint: CancellationRequest,
    action: "REOPEN" | "CLOSE",
  ) => {
    try {
      console.log("Complaint:", complaint._id);

      console.log("Action:", action);

      // API call here

      await loadRequests();
    } catch (error) {
      console.error("Failed to update complaint:", error);
    }
  };

  const handleStatusChange = async (
    complaint: CancellationRequest,
    status: "REOPEN",
  ) => {
    try {
      await updateAppointmentStatus(complaint._id, status, {});

      toast.success("Complaint reopened successfully");

      await loadRequests();
    } catch (error) {
      console.error("Failed to reopen complaint:", error);
      toast.error("Failed to reopen complaint");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Cancellation Requests
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
        <button
          type="button"
          onClick={() => {
            setSelectedReason("ALL");
            setPage(1);
          }}
          className="text-left"
        >
          <SummaryCard
            label="Total Cancellation"
            count={summary.total}
            color="blue"
            compact
          />
        </button>

        {Object.entries(summary.statusCounts).map(([status, count], index) => (
          <SummaryCard
            key={status}
            label={formatReason(status)}
            count={count}
            color={index % 2 === 0 ? "orange" : "red"}
            compact
          />
        ))}

        {Object.entries(summary.reasonCounts).map(([reason, count], index) => (
          <button
            key={reason}
            type="button"
            onClick={() => {
              setSelectedReason(selectedReason === reason ? "ALL" : reason);
              setPage(1);
            }}
            className={`min-w-0 rounded-lg text-left ${
              selectedReason === reason
                ? "ring-2 ring-blue-600 ring-offset-1"
                : ""
            }`}
          >
            <SummaryCard
              label={formatReason(reason)}
              count={count}
              color={reasonColors[index % reasonColors.length]}
              compact
            />
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div className="flex flex-col">
            <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
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
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Complaint, customer..."
                className="h-8 w-full rounded-md border border-gray-300 bg-white pl-8 pr-2 text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* From Date */}
          <div className="min-w-0">
            <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
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
              className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-xs outline-none focus:border-blue-500"
            />
          </div>

          {/* To Date */}
          <div className="min-w-0">
            <label className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]">
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
              className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-xs outline-none focus:border-blue-500"
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
              onClick={handleResetFilters}
              className="flex h-8 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          Loading cancellation requests...
        </div>
      ) : (
        <CancellationTable
          requests={requests}
          onRefresh={loadRequests}
          onStatusChange={handleStatusChange}
          onReassignDealer={handleReassignDealer}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
        />
      )}

      <ApproveCancellationModal
        open={approveModalOpen}
        request={selectedRequest}
        onClose={() => dispatch(closeApproveCancellationModal())}
        onSubmit={handleApprove}
      />

      <RejectCancellationModal
        open={rejectModalOpen}
        request={selectedRequest}
        onClose={() => dispatch(closeRejectCancellationModal())}
        onSubmit={handleReject}
      />

      {assignmentOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Assign / Reassign Dealer
                </h2>

                {assignmentComplaint && (
                  <p className="mt-1 text-xs text-gray-500">
                    {assignmentComplaint.complaintNumber}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setAssignmentOpen(false);
                  setAssignmentComplaint(null);
                }}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto p-4">
              {assignmentLoading ? (
                <div className="py-12 text-center text-sm text-gray-500">
                  Loading complaint...
                </div>
              ) : assignmentComplaint ? (
                <DealerInfoCard
                  complaintId={assignmentComplaint._id}
                  dealer={
                    assignmentComplaint.allocatedDealerId
                      ? {
                          id: assignmentComplaint.allocatedDealerId._id,
                          name:
                            assignmentComplaint.allocatedDealerId
                              .technicianName || "",
                          firmName:
                            assignmentComplaint.allocatedDealerId
                              .technicianFirmName || "",
                          phone:
                            assignmentComplaint.allocatedDealerId
                              .mobileNumber || "",
                          headCode:
                            assignmentComplaint.allocatedDealerId.headCode ||
                            "",
                          rating:
                            assignmentComplaint.allocatedDealerId.rating ?? 0,
                          status:
                            assignmentComplaint.allocatedDealerId.status ||
                            "ACTIVE",
                        }
                      : null
                  }
                  allocationStatus={
                    assignmentComplaint.allocatedDealerId
                      ? "ASSIGNED"
                      : "UNASSIGNED"
                  }
                  onDealerAssigned={async () => {
                    await loadRequests();

                    setAssignmentOpen(false);
                    setAssignmentComplaint(null);

                    toast.success("Dealer assigned successfully");
                  }}
                />
              ) : (
                <div className="py-12 text-center text-sm text-gray-500">
                  Complaint not found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
