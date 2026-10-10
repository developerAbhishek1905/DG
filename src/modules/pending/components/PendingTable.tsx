import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getComplaintFollowUpRemarks,
  getPendingFollowUpStatuses,
  saveComplaintFollowUp,
  getPendingFollowUpReasons,
} from "../services/pendingApi";

import type {
  FollowUpRemark,
  FollowUpStatusOption,
  PendingComplaint,
} from "../types/pending.types";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  complaints: PendingComplaint[];
  onRefresh: () => Promise<void>;
}

interface RowForm {
  followUpReasonId: string;
  followUpDate: string;
  remark: string;
}

export default function PendingTable({ complaints, onRefresh }: Props) {
  const [statuses, setStatuses] = useState<FollowUpStatusOption[]>([]);
  const [pendingReasons, setPendingReasons] = useState<FollowUpReasonOption[]>(
    [],
  );
  const [forms, setForms] = useState<Record<string, RowForm>>({});

  const [savingId, setSavingId] = useState<string | null>(null);

  const [remarksModal, setRemarksModal] = useState<{
    complaintNumber: string;
    remarks: FollowUpRemark[];
  } | null>(null);

  const [remarksLoading, setRemarksLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const total = complaints.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const paginatedComplaints = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return complaints.slice(startIndex, startIndex + limit);
  }, [complaints, page, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Load pending statuses
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadPendingReasons = async () => {
      try {
        const response = await getPendingFollowUpReasons();

        const pendingOnly = (response.data || []).filter(
          (reason: FollowUpReasonOption) =>
            reason.reasonType?.toLowerCase().includes("pending"),
        );

        setPendingReasons(pendingOnly);
      } catch (error) {
        console.error("Failed to load pending reasons:", error);

        toast.error("Failed to load pending reasons");
      }
    };

    loadPendingReasons();
  }, []);

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const response = await getPendingFollowUpStatuses();

        setStatuses(response.data || []);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load follow-up statuses");
      }
    };

    loadStatuses();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Update Row
  |--------------------------------------------------------------------------
  */

  const updateForm = (id: string, field: keyof RowForm, value: string) => {
    setForms((previous) => ({
      ...previous,

      [id]: {
        followUpReasonId: previous[id]?.followUpReasonId || "",

        followUpDate: previous[id]?.followUpDate || "",

        remark: previous[id]?.remark || "",

        [field]: value,
      },
    }));
  };

  const handleSave = async (
    complaint: PendingComplaint,
    sendToDealer: boolean,
  ) => {
    const form = forms[complaint._id];

    if (!form?.followUpReasonId) {
      toast.error("Select follow-up reason");
      return;
    }

    if (!form?.followUpDate) {
      toast.error("Select follow-up date");
      return;
    }

    if (!form?.remark?.trim()) {
      toast.error("Enter remark");
      return;
    }

    try {
      setSavingId(complaint._id);

      await saveComplaintFollowUp(complaint._id, {
        followUpReasonId: form.followUpReasonId,

        followUpDate: form.followUpDate,

        remark: form.remark.trim(),

        sendToDealer,
      });

      toast.success(
        sendToDealer
          ? "Remark saved and sent to dealer"
          : "Remark saved successfully",
      );
      await onRefresh();
      setForms((previous) => {
        const updated = { ...previous };

        delete updated[complaint._id];

        return updated;
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to save remark");
    } finally {
      setSavingId(null);
    }
  };
  /*
  |--------------------------------------------------------------------------
  | View Remarks
  |--------------------------------------------------------------------------
  */

  const handleViewRemarks = async (complaint: PendingComplaint) => {
    try {
      setRemarksLoading(true);

      const response = await getComplaintFollowUpRemarks(complaint._id);

      setRemarksModal({
        complaintNumber: response.data.complaintNumber,

        remarks: response.data.remarks || [],
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to load remarks");
    } finally {
      setRemarksLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Date formatter
  |--------------------------------------------------------------------------
  */

  const formatDateTimeLocal = (value?: string) => {
    if (!value) return "";

    const date = new Date(value);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");

    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN");
  };

  const formatTableDate = (value?: string) => {
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
        month: "2-digit",
        year: "2-digit",
      }),

      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[1650px] table-fixed text-left text-sm">
          {/* <colgroup>
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[7%]" />
            <col className="w-[8%]" />
            <col className="w-[9%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[8%]" />
          </colgroup> */}

          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-2 py-3">Complaint</th>
              <th className="px-2 py-3">Customer</th>
              <th className="px-2 py-3">City</th>
              <th className="px-2 py-3">Product</th>

              <th className="px-2 py-3">Quote</th>
              <th className="px-2 py-3">Created By</th>

              <th className="px-2 py-3">Technician</th>
              <th className="px-2 py-3">Reason</th>
              <th className="px-2 py-3">Updated</th>
              <th className="px-2 py-3">Follow-up</th>
              <th className="px-2 py-3">Follow-up Date</th>
              <th className="px-2 py-3">Remark</th>
              <th className="px-2 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedComplaints.map((complaint) => {
              const form = forms[complaint._id] || {
                followUpReasonId: complaint.customerFollowUpReasonId || "",

                followUpDate: complaint.customerFollowUpDate
                  ? formatDateTimeLocal(complaint.customerFollowUpDate)
                  : "",

                remark: complaint.latestRemark || "",
              };
              const isSaving = savingId === complaint._id;

              return (
                <tr
                  key={complaint._id}
                  className="border-b align-top last:border-b-0 hover:bg-gray-50"
                >
                  {/* Complaint Number + Type */}

                  <td className="px-2 py-3 align-top">
                    <div className="space-y-1">
                      <p className="whitespace-nowrap text-[11px] font-semibold text-blue-600">
                        {complaint.complaintNumber}
                      </p>

                      <span
                        className={`inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${
                          complaint.complaintType === "WARRANTY"
                            ? "bg-purple-50 text-purple-700"
                            : complaint.complaintType === "REPEAT"
                              ? "bg-orange-50 text-orange-700"
                              : complaint.complaintType === "INQUIRY"
                                ? "bg-sky-50 text-sky-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {complaint.complaintType === "WARRANTY"
                          ? "REPEAT"
                          : complaint.complaintType || "-"}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}

                  <td className="min-w-0 overflow-hidden px-2 py-3 align-top">
                    <p
                      className="truncate text-xs font-semibold text-gray-900"
                      title={complaint.customerName}
                    >
                      {complaint.customerName}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-500">
                      {complaint.phone}
                    </p>
                  </td>

                  {/* City */}

                  <td className="min-w-0 overflow-hidden px-2 py-3 align-top">
                    <p
                      className="truncate text-xs font-medium text-gray-700"
                      title={complaint.address?.city || ""}
                    >
                      {complaint.address?.city || "-"}
                    </p>
                  </td>

                  {/* Product + Units */}

                  <td className="px-2 py-3 align-top">
                    <p
                      className="truncate text-xs font-medium text-gray-800"
                      title={complaint.productName}
                    >
                      {complaint.productName || "-"}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500">
                      Units:{" "}
                      <span className="font-semibold text-gray-700">
                        {complaint.units ?? "-"}
                      </span>
                    </p>
                  </td>

                  {/* Quote Amount */}

                  <td className="px-2 py-3 align-top">
                    <span className="whitespace-nowrap text-xs font-semibold text-gray-800">
                      {complaint.quoteAmount != null
                        ? `₹${complaint.quoteAmount.toLocaleString("en-IN")}`
                        : "-"}
                    </span>
                  </td>

                  {/* Created By */}

                  <td className="px-2 py-3 align-top">
                    <p
                      className="truncate text-[11px] font-medium text-gray-700"
                      title={
                        typeof complaint.createdBy === "object"
                          ? complaint.createdBy?.name || ""
                          : ""
                      }
                    >
                      {typeof complaint.createdBy === "object"
                        ? complaint.createdBy?.name || "-"
                        : "-"}
                    </p>
                  </td>

                  {/* Technician */}

                  <td className="px-2 py-3 align-top">
                    <p className="text-xs font-medium">
                      {complaint.allocatedDealerId?.technicianFirmName || "-"}
                    </p>

                    <p
                      className="truncate text-xs font-medium text-gray-800"
                      title={complaint.allocatedDealerId?.technicianName || ""}
                    >
                      {complaint.allocatedDealerId?.technicianName || "-"}
                    </p>

                    <span
                      className={`
      mt-1 inline-block rounded-full px-2 py-0.5
      text-[10px] font-medium
      ${
        complaint.allocatedDealerId?.status === "ACTIVE"
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-600"
      }
    `}
                    >
                      {complaint.allocatedDealerId?.status || "-"}
                    </span>
                  </td>

                  {/* Reason */}
                  {/* <td className="px-2 py-3 align-top">
                    <p className="break-words text-[11px] leading-4 text-gray-700">
                      {complaint.pendingReason
                        ?.replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase()) || "-"}
                    </p>
                  </td> */}

                  {/* Reason */}

                  <td className="px-2 py-3 align-top">
                    <span
                      title={formatReason(complaint.pendingReason)}
                      className={`
      inline-flex max-w-full
      items-center rounded-lg
      px-2.5 py-1.5
      text-[11px] font-semibold
      leading-4 ring-1 ring-inset
      whitespace-normal break-words
      ${getReasonColor(complaint.pendingReason)}
    `}
                    >
                      {formatReason(complaint.pendingReason)}
                    </span>
                  </td>

                  {/* Updated */}

                  <td className="px-2 py-3 align-top">
                    <p className="whitespace-nowrap text-[11px] font-medium text-gray-700">
                      {formatTableDate(complaint.updatedAt).date}
                    </p>

                    <p className="mt-0.5 whitespace-nowrap text-[10px] text-gray-400">
                      {formatTableDate(complaint.updatedAt).time}
                    </p>
                  </td>

                  {/* Follow-up status */}

                  <td className="min-w-0 overflow-hidden px-1 py-3 align-top">
                    <select
                      value={form.followUpReasonId}
                      onChange={(event) =>
                        updateForm(
                          complaint._id,
                          "followUpReasonId",
                          event.target.value,
                        )
                      }
                      className="
    block w-full min-w-0 max-w-full
    rounded-md border border-gray-300
    bg-white px-1 py-2 text-[10px]
    outline-none focus:border-blue-500
  "
                    >
                      <option value="">Select Reason</option>

                      {pendingReasons.map((reason) => (
                        <option key={reason.id} value={reason.id}>
                          {reason.reasonName}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Follow-up Date */}

                  <td className="min-w-0 overflow-hidden px-1 py-3 align-top">
                    <div className="min-w-0 max-w-full overflow-hidden">
                      <input
                        type="datetime-local"
                        value={form.followUpDate}
                        onChange={(event) =>
                          updateForm(
                            complaint._id,
                            "followUpDate",
                            event.target.value,
                          )
                        }
                        className="
    block w-full min-w-0 max-w-full
    rounded-md border border-gray-300
    px-1 py-2 text-[10px]
    outline-none focus:border-blue-500
  "
                      />
                    </div>
                  </td>

                  {/* Remark */}

                  <td className="min-w-0 overflow-hidden px-1 py-3 align-top">
                    <input
                      type="text"
                      value={form.remark}
                      onChange={(event) =>
                        updateForm(complaint._id, "remark", event.target.value)
                      }
                      placeholder="Remark..."
                      className="
    block w-full min-w-0 max-w-full
    rounded-md border border-gray-300
    px-2 py-2 text-[10px]
    outline-none focus:border-blue-500
  "
                    />
                  </td>

                  {/* Actions */}

                  <td className="min-w-0 overflow-hidden px-1 py-3 align-top">
                    <div className="flex min-w-0 flex-col gap-1">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSave(complaint, false)}
                        className="
        w-full rounded-md bg-blue-600
        px-1 py-1.5 text-[10px]
        font-medium text-white
        hover:bg-blue-700
        disabled:opacity-50
      "
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSave(complaint, true)}
                        className="
        w-full rounded-md bg-green-600
        px-1 py-1.5 text-[10px]
        font-medium leading-3 text-white
        hover:bg-green-700
        disabled:opacity-50
      "
                      >
                        Save & Send
                      </button>

                      <button
                        type="button"
                        onClick={() => handleViewRemarks(complaint)}
                        className="
        w-full rounded-md border
        border-gray-300 px-1 py-1.5
        text-[10px] font-medium text-gray-600
        hover:bg-gray-50
      "
                      >
                        Remarks
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!complaints.length && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No pending complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Remarks Modal */}

      {remarksModal && (
        <RemarksModal
          complaintNumber={remarksModal.complaintNumber}
          remarks={remarksModal.remarks}
          onClose={() => setRemarksModal(null)}
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}

interface RemarksModalProps {
  complaintNumber: string;
  remarks: FollowUpRemark[];
  onClose: () => void;
}

function RemarksModal({
  complaintNumber,
  remarks,
  onClose,
}: RemarksModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Follow-up Remarks
            </h2>

            <p className="mt-1 text-sm text-gray-500">{complaintNumber}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-sm"
          >
            Close
          </button>
        </div>

        {/* Remarks */}

        <div className="max-h-[65vh] space-y-3 overflow-y-auto p-5">
          {!remarks.length ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No remarks found.
            </div>
          ) : (
            remarks.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {item.followUpStatus.replaceAll("_", " ")}
                  </span>

                  {item.sentToDealer && (
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      Sent to Dealer
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-800">{item.remark}</p>

                <div className="mt-4 grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
                  <div>
                    Follow-up:{" "}
                    {new Date(item.followUpDate).toLocaleString("en-IN")}
                  </div>

                  <div>
                    Saved: {new Date(item.createdAt).toLocaleString("en-IN")}
                  </div>

                  <div>
                    Updated: {new Date(item.updatedAt).toLocaleString("en-IN")}
                  </div>

                  {item.createdBy?.name && <div>By: {item.createdBy.name}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const reasonColors = [
  "bg-red-100 text-red-700 ring-red-200",
  "bg-orange-100 text-orange-700 ring-orange-200",
  "bg-amber-100 text-amber-800 ring-amber-200",
  "bg-blue-100 text-blue-700 ring-blue-200",
  "bg-purple-100 text-purple-700 ring-purple-200",
  "bg-pink-100 text-pink-700 ring-pink-200",
  "bg-teal-100 text-teal-700 ring-teal-200",
  "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "bg-indigo-100 text-indigo-700 ring-indigo-200",
];

const getReasonColor = (reason?: string) => {
  if (!reason?.trim()) {
    return "bg-gray-100 text-gray-500 ring-gray-200";
  }

  const normalizedReason = reason.trim().toLowerCase();

  let hash = 0;

  for (let i = 0; i < normalizedReason.length; i++) {
    hash = (hash * 31 + normalizedReason.charCodeAt(i)) | 0;
  }

  return reasonColors[(hash >>> 0) % reasonColors.length];
};

const formatReason = (reason?: string) => {
  if (!reason?.trim()) return "-";

  return reason
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
