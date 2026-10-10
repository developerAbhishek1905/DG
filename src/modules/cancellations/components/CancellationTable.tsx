import { Ban, Loader2, RotateCcw, UserRoundPen } from "lucide-react";import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { CancellationRequest } from "../types/cancellation.types";

import {
  cancelComplaint,
  getReasonsDropdown,
} from "../services/cancellationApi";

import Pagination from "../../../components/ui/Pagination";

// interface Props {
//   requests: CancellationRequest[];
//   onRefresh: () => Promise<void>;

//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;

//   onPageChange: (page: number) => void;
//   onLimitChange: (limit: number) => void;
// }

interface Props {
  requests: CancellationRequest[];
  onRefresh: () => Promise<void>;

  onStatusChange?: (
    request: CancellationRequest,
    status: "REOPEN",
  ) => Promise<void>;

  onReassignDealer?: (request: CancellationRequest) => void;

  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

interface CancellationRowForm {
  reasonId: string;
  followUpDate: string;
  remark: string;
}

interface CancellationReasonOption {
  id: string;
  reasonName: string;
  reasonType?: string;
}

type CancellationTableRow = CancellationRequest & {
  address?: {
    city?: string;
  };
  city?: string;
  quoteAmount?: number | string;
  units?: number;
  complaintType?: string;
  createdBy?:
    | {
        _id?: string;
        name?: string;
      }
    | string
    | null;
  updatedAt?: string;
  createdAt?: string;
  cancellationRemarks?: Array<{
    reasonId?: string;
    followUpDate?: string;
    remark?: string;
  }>;
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDateTimeLocal = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatQuote = (value?: number | string) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) return "-";

  return `₹${amount.toLocaleString("en-IN")}`;
};

const headings = [
  "Complaint",
  "Customer",
  "City",
  "Product",
  "Quote",
  "Created By",
  "Technician",
  "Reason",
  "Updated",
  "Follow-up",
  "Follow-up Date",
  "Remark",
  "Actions",
];

export default function CancellationTable({
  requests,
  onRefresh,
  onStatusChange,
  onReassignDealer,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: Props) {
  const navigate = useNavigate();

  const [forms, setForms] = useState<Record<string, CancellationRowForm>>({});

  const [savingId, setSavingId] = useState<string | null>(null);

  const [cancellationReasons, setCancellationReasons] = useState<
    CancellationReasonOption[]
  >([]);

  useEffect(() => {
    const loadReasons = async () => {
      try {
        const response = await getReasonsDropdown();

        const reasons = (response.data || []).filter(
          (reason: CancellationReasonOption) =>
            reason.reasonType?.toLowerCase().includes("cancel"),
        );

        setCancellationReasons(reasons);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load cancellation reasons");
      }
    };

    loadReasons();
  }, []);

  const updateForm = (
    id: string,
    field: keyof CancellationRowForm,
    value: string,
  ) => {
    setForms((previous) => ({
      ...previous,
      [id]: {
        reasonId: previous[id]?.reasonId || "",
        followUpDate: previous[id]?.followUpDate || "",
        remark: previous[id]?.remark || "",
        [field]: value,
      },
    }));
  };

  const handleCancelComplaint = async (request: CancellationRequest) => {
    const latestRemark = request.cancellationRemarks?.at(-1);
    const form = forms[request._id];

    const reasonId = form?.reasonId ?? latestRemark?.reasonId ?? "";

    const followUpDate =
      form?.followUpDate ??
      (latestRemark?.followUpDate
        ? formatDateTimeLocal(latestRemark.followUpDate)
        : "");

    const remark = form?.remark ?? latestRemark?.remark ?? "";

    if (!reasonId) {
      toast.error("Please select cancellation reason");
      return;
    }

    if (!followUpDate) {
      toast.error("Please select follow-up date");
      return;
    }

    if (!remark.trim()) {
      toast.error("Please enter remark");
      return;
    }

    try {
      setSavingId(request._id);

      await cancelComplaint(request._id, {
        reasonId,
        followUpDate,
        remark: remark.trim(),
      });

      toast.success("Complaint cancelled successfully");

      setForms((previous) => {
        const updated = { ...previous };
        delete updated[request._id];
        return updated;
      });

      await onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel complaint");
    } finally {
      setSavingId(null);
    }
  };

  

  const inputClass =
    "h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-2 text-[11px] text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <div className="w-full max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-[1870px] min-w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[160px]" />
            <col className="w-[155px]" />
            <col className="w-[115px]" />
            <col className="w-[150px]" />
            <col className="w-[90px]" />
            <col className="w-[125px]" />
            <col className="w-[155px]" />
            <col className="w-[175px]" />
            <col className="w-[130px]" />
            <col className="w-[165px]" />
            <col className="w-[185px]" />
            <col className="w-[180px]" />
            <col className="w-[120px]" />
          </colgroup>

          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {headings.map((heading) => (
                <th
                  key={heading}
                  className={`whitespace-nowrap px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500 ${
                    heading === "Actions" ? "text-right" : ""
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  No cancellation requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => {
                const row = request as CancellationTableRow;
                const isCancelled = row.status === "CANCELLED";
                const isSaving = savingId === row._id;

                const latestRemark = row.cancellationRemarks?.at(-1);
                const form = forms[row._id];

                const reasonId = form?.reasonId ?? latestRemark?.reasonId ?? "";

                const followUpDate =
                  form?.followUpDate ??
                  (latestRemark?.followUpDate
                    ? formatDateTimeLocal(latestRemark.followUpDate)
                    : "");

                const remark = form?.remark ?? latestRemark?.remark ?? "";

                const createdByName =
                  typeof row.createdBy === "object" && row.createdBy !== null
                    ? row.createdBy.name || "-"
                    : "-";

                return (
                  <tr
                    key={row._id}
                    className={`transition-colors ${
                      isCancelled
                        ? "bg-red-50/70 hover:bg-red-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Complaint */}
                    <td className="px-3 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => navigate(`/complaints/${row._id}`)}
                        className="whitespace-nowrap text-left text-[11px] font-semibold text-[#123B7A] hover:underline"
                      >
                        {row.complaintNumber}
                      </button>

                      <div className="mt-1 flex flex-wrap gap-1">
                        {row.complaintType && (
                          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-700">
                            {row.complaintType}
                          </span>
                        )}

                        {isCancelled && (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold text-red-700">
                            CANCELLED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-3 py-3 align-top">
                      <p
                        className="truncate text-[11px] font-medium text-gray-900"
                        title={row.customerName || row.customerId?.name || ""}
                      >
                        {row.customerName || row.customerId?.name || "-"}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-500">
                        {row.phone || row.customerId?.phone || "-"}
                      </p>
                    </td>

                    {/* City */}
                    <td className="px-3 py-3 align-top">
                      <p
                        className="truncate text-[11px] text-gray-700"
                        title={row.address?.city || row.city || ""}
                      >
                        {row.address?.city || row.city || "-"}
                      </p>
                    </td>

                    {/* Product */}
                    <td className="px-3 py-3 align-top">
                      <p
                        className="truncate text-[11px] font-medium text-gray-800"
                        title={row.productName || ""}
                      >
                        {row.productName || "-"}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-gray-500">
                        {row.productType || "-"}
                      </p>

                      {row.units != null && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          Units: {row.units}
                        </p>
                      )}
                    </td>

                    {/* Quote */}
                    <td className="px-3 py-3 align-top">
                      <span className="whitespace-nowrap text-[11px] font-semibold text-gray-800">
                        {formatQuote(row.quoteAmount)}
                      </span>
                    </td>

                    {/* Created By */}
                    <td className="px-3 py-3 align-top">
                      <p
                        className="truncate text-[11px] text-gray-700"
                        title={createdByName}
                      >
                        {createdByName}
                      </p>
                    </td>

                    {/* Technician */}
                    <td className="px-3 py-3 align-top">
                      <p
                        className="truncate text-[11px] font-medium text-gray-800"
                        title={row.allocatedDealerId?.technicianFirmName || ""}
                      >
                        {row.allocatedDealerId?.technicianFirmName || "-"}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-gray-500">
                        {row.allocatedDealerId?.technicianName || ""}
                      </p>
                    </td>

                    {/* Reason */}
                    <td className="px-3 py-3 align-top">
                      <div className="space-y-1.5">
                        <span
                          className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                            isCancelled
                              ? "border-red-200 bg-red-100 text-red-700"
                              : "border-orange-200 bg-orange-50 text-orange-700"
                          }`}
                        >
                          {row.status?.replaceAll("_", " ") || "-"}
                        </span>

                        <p
                          className="break-words text-[10px] font-medium text-red-700"
                          title={row.cancellationReason || ""}
                        >
                          {row.cancellationReason || "-"}
                        </p>

                        {row.cancelledAt && (
                          <p className="text-[10px] text-gray-500">
                            {formatDate(row.cancelledAt)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Updated */}
                    <td className="px-3 py-3 align-top">
                      <span className="text-[10px] text-gray-600">
                        {formatDate(row.updatedAt || row.createdAt)}
                      </span>
                    </td>

                    {/* Follow-up */}
                    <td className="px-2 py-3 align-top">
                      <select
                        value={reasonId}
                        disabled={isCancelled || isSaving}
                        onChange={(event) =>
                          updateForm(row._id, "reasonId", event.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="">Select Reason</option>

                        {reasonId &&
                          !cancellationReasons.some(
                            (reason) => String(reason.id) === String(reasonId),
                          ) && (
                            <option value={reasonId}>
                              {row.cancellationReason || "Selected Reason"}
                            </option>
                          )}

                        {cancellationReasons.map((reason) => (
                          <option key={reason.id} value={reason.id}>
                            {reason.reasonName}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Follow-up Date */}
                    <td className="px-2 py-3 align-top">
                      <input
                        type="datetime-local"
                        value={followUpDate}
                        disabled={isCancelled || isSaving}
                        onChange={(event) =>
                          updateForm(
                            row._id,
                            "followUpDate",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </td>

                    {/* Remark */}
                    <td className="px-2 py-3 align-top">
                      <input
                        type="text"
                        value={remark}
                        disabled={isCancelled || isSaving}
                        placeholder="Enter remark..."
                        onChange={(event) =>
                          updateForm(row._id, "remark", event.target.value)
                        }
                        className={inputClass}
                      />
                    </td>

                    {/* Actions */}
<td className="px-3 py-3 text-right align-top">
  <div className="flex items-center justify-end gap-1.5">
    {isCancelled ? (
      <span className="rounded-md bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700">
        Cancelled
      </span>
    ) : (
      <>
        {/* Reassign Dealer */}
        {/* <button
          type="button"
          onClick={() => onReassignDealer?.(request)}
          disabled={isSaving || !onReassignDealer}
          title="Reassign Dealer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <UserRoundPen size={15} />
        </button> */}
        <button
  type="button"
  onClick={() => onReassignDealer?.(request)}
  disabled={isSaving || !onReassignDealer}
  title={
    request.allocatedDealerId
      ? "Reassign Dealer"
      : "Assign Dealer"
  }
  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
>
  <UserRoundPen size={15} />
</button>

        {/* Reopen Complaint */}
        <button
          type="button"
          onClick={() => onStatusChange?.(request, "REOPEN")}
          disabled={isSaving || !onStatusChange}
          title="Reopen Complaint"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-green-200 text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={15} />
        </button>

        {/* Cancel Complaint */}
        <button
          type="button"
          onClick={() => handleCancelComplaint(request)}
          disabled={isSaving}
          title="Cancel Complaint"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Ban size={15} />
          )}
        </button>
      </>
    )}
  </div>
</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Server-side Pagination */}
      <div className="border-t border-gray-200 px-3 py-3">
        <Pagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </div>
    </div>
  );
}
