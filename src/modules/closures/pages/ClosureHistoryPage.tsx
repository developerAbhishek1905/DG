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

  const handleApproveClosure = async (
    closure: ClosureRecord,
    remark: string,
  ) => {
    console.log(closure);
    console.log(remark);

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

        ...(status !== "ALL" && {
          status,
        }),

        ...(type !== "ALL" && {
          type,
        }),
      });
      console.log(response);

      setClosures(response ?? []);

      setTotal(response.pagination?.total ?? 0);
      setTotalPages(response.pagination?.totalPages ?? 1);
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

        <p className="mt-1 text-sm text-gray-500">
          Review submitted complaint closures.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 xl:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) => dispatch(setClosureSearch(event.target.value))}
            placeholder="Search complaint, customer or dealer..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
          />
        </div>

        <select
          value={type}
          onChange={(event) =>
            dispatch(
              setClosureHistoryType(event.target.value as ClosureType | "ALL"),
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">All Types</option>

          <option value="VISIT">Visit</option>

          <option value="PART">Part</option>

          <option value="SERVICE">Service</option>

          <option value="INSTALLATION">Installation</option>

          <option value="UNINSTALLATION">Uninstallation</option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setClosureStatus(event.target.value as ClosureStatus | "ALL"),
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">All Status</option>

          <option value="DRAFT">Draft</option>

          <option value="SUBMITTED">Submitted</option>

          <option value="VERIFIED">Verified</option>

          <option value="REJECTED">Rejected</option>
        </select>

        <button
          onClick={() => dispatch(clearClosureFilters())}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading closure history...
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto xl:overflow-x-hidden">
            <table
              className="
        w-full
        min-w-[1100px]
        table-auto
        text-left
        xl:min-w-0
        xl:table-fixed
      "
            >
              <colgroup>
                <col className="xl:w-[11%]" /> {/* Complaint */}
                <col className="xl:w-[11%]" /> {/* Customer */}
                <col className="xl:w-[13%]" /> {/* Dealer */}
                <col className="xl:w-[11%]" /> {/* Product */}
                <col className="xl:w-[8%]" /> {/* Category */}
                <col className="xl:w-13%]" /> {/* Status */}
                <col className="xl:w-[7%]" /> {/* Closed At */}
                <col className="xl:w-[18%]" /> {/* Remark */}
                <col className="xl:w-[8%]" /> {/* Action */}
              </colgroup>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {[
                    "Complaint",
                    "Customer",
                    "Dealer",
                    "Product",
                    "Category",
                    "Status",
                    "Closed At",
                    "Remark",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="
  whitespace-nowrap
  px-3 py-3
  text-[10px] font-semibold
  uppercase tracking-wide
  text-gray-500
  xl:px-2
"
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
                      colSpan={9}
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

  console.log(remark);
  const isApproved = closure.closureApproved === true;

  return (
    <tr
      className={`
        transition-colors
        ${
          isApproved
            ? "border-l-4 border-l-green-500 bg-green-50"
            : "hover:bg-gray-50"
        }
      `}
    >
      {/* Complaint */}

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

      {/* Customer */}

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

      {/* Dealer */}

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

      {/* Product */}

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

      {/* Category */}

      <td className="min-w-0 px-3 py-3 xl:px-2">
        {closure.category ? (
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {closure.category}
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>

      {/* Status */}

      <td className="min-w-0 px-3 py-3 xl:px-2">
        <ClosureStatusBadge status={closure.status} />
      </td>

      {/* Closed At */}

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

      {/* Remark */}

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

      {/* Action */}

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
        <Star
          size={14}
          className="fill-amber-400 text-amber-400"
        />

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
    </tr>
  );
});
