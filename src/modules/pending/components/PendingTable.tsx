// import { BellRing, Eye, MoreHorizontal } from "lucide-react";

// import { useNavigate } from "react-router-dom";

// import PendingReasonBadge from "./PendingReasonBadge";
// import SLACountdown from "./SLACountdown";
// import SLAStatusBadge from "./SLAStatusBadge";

// import type { PendingComplaint } from "../types/pending.types";

// interface Props {
//   complaints: PendingComplaint[];

//   onReminder?: (id: string) => void;

//   onAction?: (complaint: PendingComplaint) => void;
// }

// export default function PendingTable({
//   complaints,
//   onReminder,
//   onAction,
// }: Props) {
//   const navigate = useNavigate();

//   if (!complaints.length) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
//         No pending complaints found.
//       </div>
//     );
//   }

//   console.log(complaints);

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[1250px] text-left">
//           <thead className="border-b border-gray-200 bg-gray-50">
//             <tr>
//               {[
//                 "Complaint",
//                 "Customer",
//                 "Dealer",
//                 "Product",
//                 "Pending Reason",
//                 "Appointment",
//                 "Status",
//                 "Updated At",
//                 "Actions",
//               ].map((heading) => (
//                 <th
//                   key={heading}
//                   className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
//                 >
//                   {heading}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {complaints.map((item) => (
//               <tr key={item._id} className="hover:bg-gray-50">
//                 {/* Complaint */}

//                 <td className="px-5 py-4">
//                   <button
//                     type="button"
//                     onClick={() => navigate(`/complaints/${item._id}`)}
//                     className="font-medium text-[#123B7A] hover:underline"
//                   >
//                     {item.complaintNumber}
//                   </button>

//                   <p className="mt-1 text-xs text-gray-400">{item._id}</p>
//                 </td>

//                 {/* Customer */}

//                 <td className="px-5 py-4">
//                   <p className="text-sm font-medium text-gray-900">
//                     {item.customerName || item.customerId?.name || "-"}
//                   </p>

//                   <p className="mt-1 text-xs text-gray-500">
//                     {item.phone || item.customerId?.phone || "-"}
//                   </p>
//                 </td>

//                 {/* Dealer */}

//                 <td className="px-5 py-4">
//                   <p className="text-sm font-medium text-gray-700">
//                     {item.allocatedDealerId?.technicianFirmName || "-"}
//                   </p>

//                   <p className="mt-1 text-xs text-gray-500">
//                     {item.allocatedDealerId?.technicianName || ""}
//                   </p>

//                   <p className="mt-1 text-xs text-gray-400">
//                     {item.allocatedDealerId?.mobileNumber || ""}
//                   </p>
//                 </td>

//                 {/* Product */}

//                 <td className="px-5 py-4">
//                   <p className="text-sm font-medium text-gray-700">
//                     {item.productName || "-"}
//                   </p>

//                   <p className="mt-1 text-xs text-gray-500">
//                     {item.productType || ""}
//                   </p>
//                 </td>

//                 {/* Pending Reason */}

//                 <td className="px-5 py-4">
//                   {item.pendingReason ? (
//                     <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
//                       {item.pendingReason}
//                     </span>
//                   ) : (
//                     "-"
//                   )}
//                 </td>

//                 {/* Appointment */}

//                 <td className="whitespace-nowrap px-5 py-4">
//                   {item.appointmentDate ? (
//                     <>
//                       <p className="text-sm text-gray-700">
//                         {new Date(item.appointmentDate).toLocaleDateString()}
//                       </p>

//                       <p className="mt-1 text-xs text-gray-500">
//                         {item.appointmentTime || "-"}
//                       </p>
//                     </>
//                   ) : (
//                     "-"
//                   )}
//                 </td>

//                 {/* Status */}

//                 <td className="px-5 py-4">
//                   <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
//                     {item.status?.replaceAll("_", " ").toUpperCase()}
//                   </span>
//                 </td>

//                 {/* Updated */}

//                 <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
//                   {new Date(item.updatedAt).toLocaleString()}
//                 </td>

//                 {/* Actions */}

//                 <td className="px-5 py-4">
//                   <div className="flex gap-1">
//                     <button
//                       type="button"
//                       onClick={() => navigate(`/complaints/${item._id}`)}
//                       title="View Complaint"
//                       className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
//                     >
//                       <Eye size={17} />
//                     </button>

//                     {onAction && (
//                       <button
//                         type="button"
//                         onClick={() => onAction(item)}
//                         title="DG Action"
//                         className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
//                       >
//                         <MoreHorizontal size={17} />
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
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

interface Props {
  complaints: PendingComplaint[];
  onRefresh: () => Promise<void>;
}

// interface RowForm {
//   followUpStatus: string;
//   followUpDate: string;
//   remark: string;
// }

interface RowForm {
  followUpReasonId: string;
  followUpDate: string;
  remark: string;
}

export default function PendingTable({ complaints, onRefresh }: Props) {
  const [statuses, setStatuses] = useState<FollowUpStatusOption[]>([]);
const [pendingReasons, setPendingReasons] =
  useState<FollowUpReasonOption[]>([]);
  const [forms, setForms] = useState<Record<string, RowForm>>({});

  const [savingId, setSavingId] = useState<string | null>(null);

  const [remarksModal, setRemarksModal] = useState<{
    complaintNumber: string;
    remarks: FollowUpRemark[];
  } | null>(null);

  const [remarksLoading, setRemarksLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load pending statuses
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
  const loadPendingReasons = async () => {
    try {
      const response =
        await getPendingFollowUpReasons();

      const pendingOnly =
        (response.data || []).filter(
          (reason: FollowUpReasonOption) =>
            reason.reasonType
              ?.toLowerCase()
              .includes("pending"),
        );

      setPendingReasons(pendingOnly);
    } catch (error) {
      console.error(
        "Failed to load pending reasons:",
        error,
      );

      toast.error(
        "Failed to load pending reasons",
      );
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
        followUpStatus: previous[id]?.followUpStatus || "",

        followUpDate: previous[id]?.followUpDate || "",

        remark: previous[id]?.remark || "",

        [field]: value,
      },
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave = async (
    complaint: PendingComplaint,
    sendToDealer: boolean,
  ) => {
    const form = forms[complaint._id];

    if (!form?.followUpStatus) {
      toast.error("Select follow-up status");
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
        followUpStatus: form.followUpStatus,

        followUpDate: form.followUpDate,

        remark: form.remark.trim(),

        sendToDealer,
      });

      toast.success(
        sendToDealer
          ? "Remark saved and sent to dealer"
          : "Remark saved successfully",
      );

      setForms((previous) => ({
        ...previous,

        [complaint._id]: {
          followUpStatus: "",
          followUpDate: "",
          remark: "",
        },
      }));

      await onRefresh();
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
    <>
      <div className="w-full rounded-xl border border-gray-200 bg-white">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[11%]" /> {/* Complaint */}
            <col className="w-[10%]" /> {/* Customer */}
            <col className="w-[8%]" /> {/* Product */}
            <col className="w-[9%]" /> {/* Technician */}
            <col className="w-[8%]" /> {/* Reason */}
            <col className="w-[7%]" /> {/* Updated */}
            <col className="w-[10%]" /> {/* Follow-up */}
            <col className="w-[14%]" /> {/* Follow-up Date */}
            <col className="w-[12%]" /> {/* Remark */}
            <col className="w-[11%]" /> {/* Action */}
          </colgroup>
          <thead className="bg-gray-50">
            <tr className="border-b text-left text-[11px] font-semibold uppercase text-gray-500">
              <th className="px-2 py-3">Complaint</th>
              <th className="px-2 py-3">Customer</th>
              <th className="px-2 py-3">Product</th>
              <th className="px-2 py-3">Technician</th>
              <th className="px-2 py-3">Reason</th>
              <th className="px-2 py-3">Updated</th>
              <th className="px-2 py-3">Follow-up</th>
              <th className="px-2 py-3">Follow-up Date</th>
              <th className="px-2 py-3">Remark</th>
              <th className="px-2 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => {
              const form = forms[complaint._id] || {
                followUpStatus: "",
                followUpDate: "",
                remark: "",
              };

              const isSaving = savingId === complaint._id;

              return (
                <tr
                  key={complaint._id}
                  className="border-b align-top last:border-b-0 hover:bg-gray-50"
                >
                  {/* Complaint */}

                  <td className="px-2 py-3 align-top">
                    <div className="whitespace-nowrap text-xs font-semibold text-blue-600">
                      {complaint.complaintNumber}
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

                  {/* Product */}

                  <td className="px-2 py-3 align-top">
                    <p
                      className="truncate text-xs text-gray-700"
                      title={complaint.productName}
                    >
                      {complaint.productName || "-"}
                    </p>
                  </td>

                  {/* Technician */}

                  <td className="px-2 py-3 align-top">
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
                  <td className="px-2 py-3 align-top">
                    <p className="break-words text-[11px] leading-4 text-gray-700">
                      {complaint.pendingReason
                        ?.replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase()) || "-"}
                    </p>
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
  value={form.followUpStatus}
  onChange={(event) =>
    updateForm(
      complaint._id,
      "followUpStatus",
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
  <option value="">
    Select Reason
  </option>

  {pendingReasons.map((reason) => (
    <option
      key={reason.id}
      value={reason.id}
    >
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
    </>
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
