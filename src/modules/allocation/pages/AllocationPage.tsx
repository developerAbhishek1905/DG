import {
  ArrowLeft,
  History,
  MapPin,
  Package,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import Card from "../../../components/ui/Card";

import AllocationRulesCard from "../components/AllocationRulesCard";
import EligibleDealerTable from "../components/EligibleDealerTable";
import RecommendedDealerCard from "../components/RecommendedDealerCard";
import ReassignDealerModal from "../components/ReassignDealerModal";

import {
  assignDealer,
  getAllocationComplaint,
  getEligibleDealers,
  getRecommendedDealer,
  reassignDealer,
} from "../services/allocationApi";

import {
  clearAllocationFilters,
  closeReassignModal,
  openReassignModal,
  setAllocationCity,
  setAllocationEligibility,
  setAllocationSearch,
  setSelectedDealerId,
} from "../store/allocationSlice";

import type {
  ComplaintAllocationInfo,
  EligibleDealer,
  ReassignDealerPayload,
} from "../types/allocation.types";

export default function AllocationPage() {
  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  const {
    search,
    city,
    eligibility,
    selectedDealerId,
    reassignModalOpen,
  } = useAppSelector(
    (state) =>
      state.allocation
  );

  const [
    complaint,
    setComplaint,
  ] =
    useState<ComplaintAllocationInfo | null>(
      null
    );

  const [
    dealers,
    setDealers,
  ] =
    useState<
      EligibleDealer[]
    >([]);

  const [
    recommendedDealer,
    setRecommendedDealer,
  ] =
    useState<
      EligibleDealer | undefined
    >();

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    assigning,
    setAssigning,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null
    );

  const loadAllocation =
    async () => {
      try {
        setLoading(true);

        const [
          complaintData,
          dealerData,
          recommended,
        ] =
          await Promise.all([
            getAllocationComplaint(),
            getEligibleDealers(),
            getRecommendedDealer(),
          ]);

        setComplaint(
          complaintData
        );

        setDealers(
          dealerData
        );

        setRecommendedDealer(
          recommended
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAllocation();
  }, []);

  const cities =
    useMemo(
      () =>
        Array.from(
          new Set(
            dealers.map(
              (dealer) =>
                dealer.city
            )
          )
        ),
      [dealers]
    );

  const filteredDealers =
    useMemo(
      () =>
        dealers.filter(
          (dealer) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              dealer.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              dealer.dealerCode
                .toLowerCase()
                .includes(
                  query
                );

            const matchesCity =
              city === "ALL" ||
              dealer.city ===
                city;

            const matchesEligibility =
              eligibility ===
                "ALL" ||
              (eligibility ===
                "ELIGIBLE" &&
                dealer.eligible) ||
              (eligibility ===
                "NOT_ELIGIBLE" &&
                !dealer.eligible);

            return (
              matchesSearch &&
              matchesCity &&
              matchesEligibility
            );
          }
        ),
      [
        dealers,
        search,
        city,
        eligibility,
      ]
    );

  const handleAssign =
    async (
      dealer: EligibleDealer
    ) => {
      if (!complaint) return;

      try {
        setAssigning(true);

        setMessage(null);

        const result =
          await assignDealer(
            complaint.id,
            dealer.id
          );

        setComplaint(
          (current) =>
            current
              ? {
                  ...current,

                  currentDealerId:
                    result.dealerId,

                  currentDealerName:
                    result.dealerName,
                }
              : current
        );

        setMessage(
          `${result.dealerName} assigned successfully.`
        );
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to assign dealer."
        );
      } finally {
        setAssigning(false);
      }
    };

  const handleReassign =
    async (
      payload: ReassignDealerPayload
    ) => {
      const result =
        await reassignDealer(
          payload
        );

      setComplaint(
        (current) =>
          current
            ? {
                ...current,

                currentDealerId:
                  result.dealerId,

                currentDealerName:
                  result.dealerName,
              }
            : current
      );

      dispatch(
        closeReassignModal()
      );

      setMessage(
        `Complaint reassigned to ${result.dealerName}.`
      );
    };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading allocation data...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Complaint not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <button
            onClick={() =>
              navigate(
                "/complaints"
              )
            }
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500"
          >
            <ArrowLeft
              size={17}
            />

            Back to Complaints
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Dealer Allocation
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Select the best eligible dealer for{" "}
            <strong>
              {
                complaint.complaintNumber
              }
            </strong>
            .
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              navigate(
                "/allocation/history"
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <History
              size={17}
            />

            Allocation History
          </button>

          <button
            onClick={
              loadAllocation
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw
              size={17}
            />

            Refresh
          </button>

          {complaint.currentDealerId && (
            <button
              onClick={() =>
                dispatch(
                  openReassignModal(
                    selectedDealerId
                  )
                )
              }
              className="rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
            >
              Reassign Dealer
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {message}
        </div>
      )}

      <Card className="p-5">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <Info
            icon={UserRound}
            label="Customer"
            value={
              complaint.customerName
            }
          />

          <Info
            icon={MapPin}
            label="City"
            value={
              complaint.city
            }
          />

          <Info
            icon={Package}
            label="Product"
            value={
              complaint.productName
            }
          />

          <Info
            label="Priority"
            value={
              complaint.priority
            }
          />

          <Info
            label="Current Dealer"
            value={
              complaint.currentDealerName ??
              "Not assigned"
            }
          />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <RecommendedDealerCard
          dealer={
            recommendedDealer
          }
          onAssign={
            handleAssign
          }
          assigning={
            assigning
          }
        />

        <AllocationRulesCard />
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Eligible Dealer Analysis
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Compare all dealer matches before assignment.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) =>
                dispatch(
                  setAllocationSearch(
                    event.target.value
                  )
                )
              }
              placeholder="Search dealer..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
            />
          </div>

          <select
            value={city}
            onChange={(event) =>
              dispatch(
                setAllocationCity(
                  event.target.value
                )
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <option value="ALL">
              All Cities
            </option>

            {cities.map(
              (cityName) => (
                <option
                  key={
                    cityName
                  }
                  value={
                    cityName
                  }
                >
                  {cityName}
                </option>
              )
            )}
          </select>

          <select
            value={eligibility}
            onChange={(event) =>
              dispatch(
                setAllocationEligibility(
                  event.target
                    .value as
                    | "ALL"
                    | "ELIGIBLE"
                    | "NOT_ELIGIBLE"
                )
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <option value="ALL">
              All Dealers
            </option>

            <option value="ELIGIBLE">
              Eligible
            </option>

            <option value="NOT_ELIGIBLE">
              Not Eligible
            </option>
          </select>

          <button
            onClick={() =>
              dispatch(
                clearAllocationFilters()
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600"
          >
            Reset
          </button>
        </div>

        <EligibleDealerTable
          dealers={
            filteredDealers
          }
          selectedDealerId={
            selectedDealerId
          }
          onSelect={(
            dealerId
          ) =>
            dispatch(
              setSelectedDealerId(
                dealerId
              )
            )
          }
          onAssign={
            handleAssign
          }
        />
      </div>

      <ReassignDealerModal
        open={
          reassignModalOpen
        }
        complaintId={
          complaint.id
        }
        currentDealerName={
          complaint.currentDealerName
        }
        dealers={dealers}
        defaultDealerId={
          selectedDealerId
        }
        onClose={() =>
          dispatch(
            closeReassignModal()
          )
        }
        onSubmit={
          handleReassign
        }
      />
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {Icon && (
          <Icon size={14} />
        )}

        {label}
      </div>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}