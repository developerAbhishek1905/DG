import {
  Save,
  RotateCcw,
  CircleCheck,
  Crosshair,
  Eye,
  Ban,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { CancellationRequest } from "../types/cancellation.types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  cancelComplaint,
  getReasonsDropdown,
  saveCancellationRemark,
} from "../services/cancellationApi";

// interface Props {
//   requests: CancellationRequest[];

//   onStatusChange?: (
//     complaint: CancellationRequest,
//     status: "REOPEN" | "CANCELLED",
//   ) => void;

//   onRefresh: () => Promise<void>;
// }

interface Props {
  requests: CancellationRequest[];
  onRefresh: () => Promise<void>;
}

interface CancellationRowForm {
  reasonId: string;
  followUpDate: string;
  remark: string;
}

export default function CancellationTable({
  requests,
  // onStatusChange,
  onRefresh,
}: Props) {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Record<string, CancellationRowForm>>({});

  const [savingId, setSavingId] = useState<string | null>(null);
  const [cancellationReasons, setCancellationReasons] = useState<
    CancellationReason[]
  >([]);
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

  // const updateForm = (
  //   id: string,
  //   field: keyof CancellationRowForm,
  //   value: string,
  // ) => {
  //   setForms((previous) => ({
  //     ...previous,

  //     [id]: {
  //       followUpDate: previous[id]?.followUpDate || "",

  //       remark: previous[id]?.remark || "",

  //       [field]: value,
  //     },
  //   }));
  // };

  useEffect(() => {
    const loadCancellationReasons = async () => {
      try {
        const response = await getReasonsDropdown();

        const cancellationOnly = (response.data || []).filter(
          (reason: CancellationReason) =>
            reason.reasonType?.toLowerCase().includes("cancel"),
        );

        setCancellationReasons(cancellationOnly);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load cancellation reasons");
      }
    };

    loadCancellationReasons();
  }, []);

  const handleSaveRemark = async (request: CancellationRequest) => {
    const form = forms[request._id];

    if (!form?.reasonId) {
      toast.error("Please select reason");
      return;
    }

    if (!form?.followUpDate) {
      toast.error("Please select date and time");
      return;
    }

    if (!form?.remark?.trim()) {
      toast.error("Please enter remark");
      return;
    }

    try {
      setSavingId(request._id);

      await saveCancellationRemark(request._id, {
        reasonId: form.reasonId,
        followUpDate: form.followUpDate,
        remark: form.remark.trim(),
      });

      toast.success("Cancellation follow-up saved successfully");

      setForms((previous) => {
        const updated = { ...previous };

        delete updated[request._id];

        return updated;
      });

      await onRefresh();
    } catch (error) {
      console.error(error);

      toast.error("Failed to save cancellation follow-up");
    } finally {
      setSavingId(null);
    }
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

  if (!requests.length) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
        No cancellation requests found.
      </div>
    );
  }

  const handleCancelComplaint = async (request: CancellationRequest) => {
    const form = forms[request._id];

    if (!form?.reasonId) {
      toast.error("Please select cancellation reason");
      return;
    }

    if (!form?.followUpDate) {
      toast.error("Please select date and time");
      return;
    }

    if (!form?.remark?.trim()) {
      toast.error("Please enter remark");
      return;
    }

    try {
      setSavingId(request._id);

      await cancelComplaint(request._id, {
        reasonId: form.reasonId,
        followUpDate: form.followUpDate,
        remark: form.remark.trim(),
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
  return (
    <div className="w-full max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full table-fixed text-left">
        <thead className="border-b bg-gray-50">
          <colgroup>
            <col className="w-[11%]" /> {/* Complaint */}
            <col className="w-[12%]" /> {/* Customer */}
            <col className="w-[13%]" /> {/* Dealer */}
            <col className="w-[10%]" /> {/* Product */}
            <col className="w-[17%]" /> {/* Cancellation Details */}
            <col className="w-[14%]" /> {/* Follow-up */}
            <col className="w-[15%]" /> {/* Remark */}
            <col className="w-[8%]" /> {/* Action */}
          </colgroup>
          <tr>
            {[
              "Complaint",
              "Customer",
              "Dealer",
              "Product",
              "Cancellation Details",
              "Follow-up",
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
    "
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y">
          {requests.map((request) => {
            // const form = forms[request._id];

            // const isCancelled = request.status === "CANCELLED";

            // const reasonId =
            //   form?.reasonId ?? request.cancellationReasonId ?? "";

            // const followUpDate =
            //   form?.followUpDate ??
            //   (request.cancellationFollowUpDate
            //     ? formatDateTimeLocal(request.cancellationFollowUpDate)
            //     : "");

            // const remark =
            //   form?.remark ?? request.cancellationLatestRemark ?? "";

            // const isSaving = savingId === request._id;

            const form = forms[request._id];

            const isCancelled = request.status === "CANCELLED";

            const latestCancellationRemark = request.cancellationRemarks?.length
              ? request.cancellationRemarks[
                  request.cancellationRemarks.length - 1
                ]
              : undefined;

            const reasonId =
              form?.reasonId ?? latestCancellationRemark?.reasonId ?? "";

            const followUpDate =
              form?.followUpDate ??
              (latestCancellationRemark?.followUpDate
                ? formatDateTimeLocal(latestCancellationRemark.followUpDate)
                : "");

            const remark =
              form?.remark ?? latestCancellationRemark?.remark ?? "";

            const isSaving = savingId === request._id;

            return (
              <tr
                key={request._id}
                className={
                  isCancelled
                    ? "border-l-4 border-l-red-500 bg-red-50"
                    : "hover:bg-gray-50"
                }
              >
                {/* Complaint */}

                <td className="px-2 py-3 align-top">
                  <button
                    type="button"
                    onClick={() => navigate(`/complaints/${request._id}`)}
                    className="
      whitespace-nowrap
      text-[11px] font-semibold
      text-[#123B7A]
      hover:underline
    "
                  >
                    {request.complaintNumber}
                  </button>
                </td>

                {/* Customer */}

                <td className="min-w-0 overflow-hidden px-2 py-3 align-top">
                  <p
                    className="truncate text-[11px] font-medium text-gray-900"
                    title={
                      request.customerName || request.customerId?.name || ""
                    }
                  >
                    {request.customerName || request.customerId?.name || "-"}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-gray-500">
                    {request.phone || request.customerId?.phone || "-"}
                  </p>
                </td>

                {/* Dealer */}

                <td className="min-w-0 overflow-hidden px-2 py-3 align-top">
                  <p
                    className="truncate text-[11px] font-medium text-gray-700"
                    title={request.allocatedDealerId?.technicianFirmName || ""}
                  >
                    {request.allocatedDealerId?.technicianFirmName || "-"}
                  </p>

                  <p
                    className="mt-0.5 truncate text-[10px] text-gray-500"
                    title={request.allocatedDealerId?.technicianName || ""}
                  >
                    {request.allocatedDealerId?.technicianName || ""}
                  </p>
                </td>

                {/* Product */}

                <td className="min-w-0 overflow-hidden px-2 py-3 align-top">
                  <p
                    className="truncate text-[11px] font-medium text-gray-700"
                    title={request.productName}
                  >
                    {request.productName || "-"}
                  </p>

                  <p
                    className="mt-0.5 truncate text-[10px] text-gray-500"
                    title={request.productType}
                  >
                    {request.productType || ""}
                  </p>
                </td>

                {/* Cancellation Details */}
                <td className="px-3 py-3 align-top">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <StatusBadge status={request.status} />

                    <p
                      className="truncate text-[10px] font-medium text-red-700"
                      title={request.cancellationReason || ""}
                    >
                      {request.cancellationReason || "-"}
                    </p>

                    {request.cancelledAt && (
                      <p className="whitespace-nowrap text-[9px] text-gray-400">
                        {formatTableDate(request.cancelledAt).date}
                        <span className="mx-1">•</span>
                        {formatTableDate(request.cancelledAt).time}
                      </p>
                    )}
                  </div>
                </td>

                <td className="min-w-0 overflow-hidden px-1 py-3 align-top">
                  <select
                    value={reasonId}
                    disabled={isCancelled}
                    onChange={(event) =>
                      updateForm(request._id, "reasonId", event.target.value)
                    }
                    className="
    block w-full min-w-0
    rounded-md border border-gray-300
    bg-white px-1.5 py-2
    text-[10px] text-gray-700
    outline-none
    focus:border-red-500
    disabled:cursor-not-allowed
    disabled:bg-gray-100
    disabled:text-gray-500
  "
                  >
                    <option value="">Select Reason</option>

                    {cancellationReasons.map((reason) => (
                      <option key={reason.id} value={reason.id}>
                        {reason.reasonName}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Follow-up Date */}

                <td className="min-w-0 overflow-hidden px-1 py-3 align-top">
                  <input
                    type="datetime-local"
                    value={followUpDate}
                    disabled={isCancelled}
                    onChange={(event) =>
                      updateForm(
                        request._id,
                        "followUpDate",
                        event.target.value,
                      )
                    }
                    className="
    w-full min-w-0
    rounded-md border border-gray-300
    px-1 py-2 text-[9px]
    outline-none
    focus:border-blue-500
    disabled:cursor-not-allowed
    disabled:bg-gray-100
    disabled:text-gray-500
  "
                  />
                </td>

                {/* Remark */}

                <td className="min-w-0 overflow-hidden px-1 py-3 align-top">
                  <input
                    type="text"
                    value={remark}
                    disabled={isCancelled}
                    onChange={(event) =>
                      updateForm(request._id, "remark", event.target.value)
                    }
                    placeholder="Remark..."
                    className="
    w-full min-w-0
    rounded-md border border-gray-300
    px-2 py-2 text-[10px]
    outline-none
    focus:border-blue-500
    disabled:cursor-not-allowed
    disabled:bg-gray-100
    disabled:text-gray-500
  "
                  />
                </td>

                {/* Actions */}

                <td className="px-1 py-3 align-top">
                  <div className="flex items-center justify-center gap-1">
                    {/* Save Remark */}

                    {isCancelled ? (
                      <span
                        className="
          inline-flex rounded-full
          border border-red-200
          bg-red-100
          px-2 py-1
          text-[9px] font-semibold
          text-red-700
        "
                      >
                        CANCELLED
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleCancelComplaint(request)}
                          title="Cancel Complaint"
                          className="
          flex h-8 w-8
          items-center justify-center
          rounded-lg
          border border-red-200
          text-red-600
          transition
          hover:bg-red-50
          hover:text-red-700
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
                        >
                          <Ban
                            size={17}
                            className={isSaving ? "animate-pulse" : ""}
                          />
                        </button>
                        {/* Reopen */}

                        <button
                          type="button"
                          onClick={() => onStatusChange?.(request, "REOPEN")}
                          title="Reopen Complaint"
                          className="
        flex h-8 w-8 items-center justify-center
        rounded-md text-green-700
        transition
        hover:bg-amber-50
      "
                        >
                          <RotateCcw size={16} />
                        </button>

                        {/* Close */}

                        <button
                          type="button"
                          onClick={() => onStatusChange?.(request, "CANCELLED")}
                          title="Close Complaint"
                          className="
        flex h-8 w-8 items-center justify-center
        rounded-md text-red-600
        transition
        hover:bg-green-50
      "
                        >
                          <Crosshair size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* </div> */}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStyle = () => {
    switch (status) {
      case "CANCELLED":
        return "border-red-200 bg-red-50 text-red-700";

      case "CLOSED":
        return "border-gray-300 bg-gray-100 text-gray-700";

      case "REOPENED":
        return "border-green-200 bg-green-50 text-green-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStyle()}`}
    >
      {status ? status.replaceAll("_", " ") : "-"}
    </span>
  );
}
