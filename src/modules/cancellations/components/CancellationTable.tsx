// import { CheckCircle2, Eye, XCircle } from "lucide-react";

// import { useNavigate } from "react-router-dom";

// import CancellationReason from "./CancellationReason";

// import type { CancellationRequest } from "../types/cancellation.types";

// interface Props {
//   requests: CancellationRequest[];

//   onApprove?: (id: string) => void;

//   onReject?: (id: string) => void;
// }

// export default function CancellationTable({
//   requests,
//   onApprove,
//   onReject,
// }: Props) {
//   const navigate = useNavigate();

//   if (!requests.length) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
//         No cancellation requests found.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[1200px] text-left">
//           <thead className="border-b bg-gray-50">
//             <tr>
//               {[
//                 "Complaint",
//                 "Customer",
//                 "Dealer",
//                 "Reason",
//                 "Requested By",
//                 "Verification",
//                 "Status",
//                 "Requested At",
//                 "Actions",
//               ].map((heading) => (
//                 <th
//                   key={heading}
//                   className="px-5 py-3 text-xs font-semibold uppercase text-gray-500"
//                 >
//                   {heading}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {requests.map((request) => (
//               <tr key={request.id} className="hover:bg-gray-50">
//                 <td className="px-5 py-4">
//                   <button
//                     onClick={() => navigate(`/cancellations/${request.id}`)}
//                     className="font-medium text-[#123B7A] hover:underline"
//                   >
//                     {request.complaintNumber}
//                   </button>

//                   <p className="mt-1 text-xs text-gray-400">{request.id}</p>
//                 </td>

//                 <td className="px-5 py-4">
//                   <p className="text-sm font-medium text-gray-900">
//                     {request.customer.name}
//                   </p>

//                   <p className="mt-1 text-xs text-gray-500">
//                     {request.customer.phone}
//                   </p>
//                 </td>

//                 <td className="px-5 py-4 text-sm text-gray-600">
//                   {request.dealer?.name ?? "-"}
//                 </td>

//                 <td className="max-w-xs px-5 py-4">
//                   <CancellationReason reason={request.reason} />
//                 </td>

//                 <td className="px-5 py-4">
//                   <p className="text-sm text-gray-700">{request.requestedBy}</p>

//                   <p className="text-xs text-gray-400">
//                     {request.requestedByRole}
//                   </p>
//                 </td>

//                 <td className="px-5 py-4">
//                   <VerificationBadge status={request.verification.status} />
//                 </td>

//                 <td className="px-5 py-4">
//                   <StatusBadge status={request.status} />
//                 </td>

//                 <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
//                   {new Date(request.requestedAt).toLocaleString()}
//                 </td>

//                 <td className="px-5 py-4">
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => navigate(`/cancellations/${request.id}`)}
//                       className="rounded-lg p-2 text-gray-500 hover:bg-blue-50"
//                     >
//                       <Eye size={17} />
//                     </button>

//                     {request.status === "VERIFIED" && onApprove && (
//                       <button
//                         onClick={() => onApprove(request.id)}
//                         className="rounded-lg p-2 text-green-600 hover:bg-green-50"
//                       >
//                         <CheckCircle2 size={17} />
//                       </button>
//                     )}

//                     {(request.status === "PENDING" ||
//                       request.status === "VERIFIED") &&
//                       onReject && (
//                         <button
//                           onClick={() => onReject(request.id)}
//                           className="rounded-lg p-2 text-red-500 hover:bg-red-50"
//                         >
//                           <XCircle size={17} />
//                         </button>
//                       )}
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

// function VerificationBadge({
//   status,
// }: {
//   status: CancellationRequest["verification"]["status"];
// }) {
//   const styles = {
//     NOT_VERIFIED: "bg-gray-50 text-gray-600 border-gray-200",

//     VERIFIED: "bg-green-50 text-green-700 border-green-200",

//     FAILED: "bg-red-50 text-red-700 border-red-200",
//   };

//   return (
//     <span
//       className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
//     >
//       {status.replaceAll("_", " ")}
//     </span>
//   );
// }

// function StatusBadge({ status }: { status: CancellationRequest["status"] }) {
//   const styles = {
//     PENDING: "bg-amber-50 text-amber-700 border-amber-200",

//     VERIFIED: "bg-blue-50 text-blue-700 border-blue-200",

//     APPROVED: "bg-green-50 text-green-700 border-green-200",

//     REJECTED: "bg-red-50 text-red-700 border-red-200",

//     REASSIGNED: "bg-purple-50 text-purple-700 border-purple-200",
//   };

//   return (
//     <span
//       className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
//     >
//       {status}
//     </span>
//   );
// }
// --------------------------------------------------------------------------------------
// import { CheckCircle2, Eye, XCircle } from "lucide-react";

// import { useNavigate } from "react-router-dom";

// import type { CancellationRequest } from "../types/cancellation.types";

// interface Props {
//   requests: CancellationRequest[];

//   onApprove?: (id: string) => void;

//   onReject?: (id: string) => void;
// }

// export default function CancellationTable({
//   requests,
//   onApprove,
//   onReject,
// }: Props) {
//   const navigate = useNavigate();

//   if (!requests.length) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
//         No cancellation requests found.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[1350px] text-left">
//           <thead className="border-b bg-gray-50">
//             <tr>
//               {[
//                 "Complaint",
//                 "Customer",
//                 "Dealer",
//                 "Product",
//                 "Reason",
//                 "Status",
//                 "Cancelled At",
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

//           <tbody className="divide-y">
//             {requests.map((request) => (
//               <tr key={request._id} className="hover:bg-gray-50">
//                 {/* Complaint */}

//                 <td className="px-5 py-4">
//                   <button
//                     type="button"
//                     onClick={() => navigate(`/complaints/${request._id}`)}
//                     className="font-medium text-[#123B7A] hover:underline"
//                   >
//                     {request.complaintNumber}
//                   </button>

//                   <p className="mt-1 text-xs text-gray-400">{request._id}</p>
//                 </td>

//                 {/* Customer */}

//                 <td className="px-5 py-4">
//                   <p className="text-sm font-medium text-gray-900">
//                     {request.customerName || request.customerId?.name || "-"}
//                   </p>

//                   <p className="mt-1 text-xs text-gray-500">
//                     {request.phone || request.customerId?.phone || "-"}
//                   </p>
//                 </td>

//                 {/* Dealer */}

//                 <td className="px-5 py-4">
//                   {request.allocatedDealerId ? (
//                     <>
//                       <p className="text-sm font-medium text-gray-700">
//                         {request.allocatedDealerId.technicianFirmName}
//                       </p>

//                       <p className="mt-1 text-xs text-gray-500">
//                         {request.allocatedDealerId.technicianName}
//                       </p>

//                       <p className="mt-1 text-xs text-gray-400">
//                         {request.allocatedDealerId.mobileNumber}
//                       </p>
//                     </>
//                   ) : (
//                     <span className="text-sm text-gray-400">-</span>
//                   )}
//                 </td>

//                 {/* Product */}

//                 <td className="px-5 py-4">
//                   <p className="text-sm font-medium text-gray-700">
//                     {request.productName || "-"}
//                   </p>

//                   <p className="mt-1 text-xs text-gray-500">
//                     {request.productType || ""}
//                   </p>

//                   {request.category && (
//                     <p className="mt-1 text-xs text-gray-400">
//                       {request.category}
//                     </p>
//                   )}
//                 </td>

//                 {/* Cancellation Reason */}

//                 <td className="max-w-xs px-5 py-4">
//                   {request.cancellationReason ? (
//                     <div>
//                       <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
//                         {request.cancellationReason.replaceAll("_", " ")}
//                       </span>
//                     </div>
//                   ) : (
//                     <span className="text-sm text-gray-400">-</span>
//                   )}
//                 </td>

//                 {/* Status */}

//                 <td className="px-5 py-4">
//                   <StatusBadge status={request.status} />
//                 </td>

//                 {/* Cancelled At */}

//                 <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
//                   {request.cancelledAt
//                     ? new Date(request.cancelledAt).toLocaleString()
//                     : "-"}
//                 </td>

//                 {/* Updated At */}

//                 <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
//                   {request.updatedAt
//                     ? new Date(request.updatedAt).toLocaleString()
//                     : "-"}
//                 </td>

//                 {/* Actions */}

//                 <td className="px-5 py-4">
//                   <div className="flex gap-1">
//                     <button
//                       type="button"
//                       onClick={() => navigate(`/complaints/${request._id}`)}
//                       title="View Complaint"
//                       className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
//                     >
//                       <Eye size={17} />
//                     </button>

//                     {onApprove && canApprove(request.status) && (
//                       <button
//                         type="button"
//                         onClick={() => onApprove(request._id)}
//                         title="Approve Cancellation"
//                         className="rounded-lg p-2 text-green-600 hover:bg-green-50"
//                       >
//                         <CheckCircle2 size={17} />
//                       </button>
//                     )}

//                     {onReject && canReject(request.status) && (
//                       <button
//                         type="button"
//                         onClick={() => onReject(request._id)}
//                         title="Reject Cancellation"
//                         className="rounded-lg p-2 text-red-500 hover:bg-red-50"
//                       >
//                         <XCircle size={17} />
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

// /*
// |--------------------------------------------------------------------------
// | Action Rules
// |--------------------------------------------------------------------------
// */

// function canApprove(status: string) {
//   return [
//     "CANCELLATION_REQUESTED",
//     "CANCEL_PENDING",
//     "PENDING_CANCELLATION",
//   ].includes(status);
// }

// function canReject(status: string) {
//   return [
//     "CANCELLATION_REQUESTED",
//     "CANCEL_PENDING",
//     "PENDING_CANCELLATION",
//   ].includes(status);
// }

// /*
// |--------------------------------------------------------------------------
// | Status Badge
// |--------------------------------------------------------------------------
// */

// function StatusBadge({ status }: { status: string }) {
//   const getStyle = () => {
//     switch (status) {
//       case "CANCELLED":
//         return "bg-red-50 text-red-700 border-red-200";

//       case "CANCELLATION_REQUESTED":
//       case "PENDING_CANCELLATION":
//       case "CANCEL_PENDING":
//         return "bg-amber-50 text-amber-700 border-amber-200";

//       case "ACTIVE":
//         return "bg-green-50 text-green-700 border-green-200";

//       case "CLOSED":
//         return "bg-blue-50 text-blue-700 border-blue-200";

//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200";
//     }
//   };

//   return (
//     <span
//       className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStyle()}`}
//     >
//       {status ? status.replaceAll("_", " ") : "-"}
//     </span>
//   );
// }


import { Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { CancellationRequest } from "../types/cancellation.types";

interface Props {
  requests: CancellationRequest[];

  onStatusChange?: (
    complaint: CancellationRequest,
    status: "REOPEN" | "CLOSE",
  ) => void;
}

export default function CancellationTable({
  requests,
  onStatusChange,
}: Props) {
  const navigate = useNavigate();

  if (!requests.length) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
        No cancellation requests found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              {[
                "Complaint",
                "Customer",
                "Dealer",
                "Product",
                "Reason",
                "Status",
                "Cancelled At",
                "Updated At",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {requests.map((request) => (
              <tr
                key={request._id}
                className="hover:bg-gray-50"
              >
                {/* Complaint */}

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/complaints/${request._id}`,
                      )
                    }
                    className="font-medium text-[#123B7A] hover:underline"
                  >
                    {request.complaintNumber}
                  </button>

                  <p className="mt-1 text-xs text-gray-400">
                    {request._id}
                  </p>
                </td>

                {/* Customer */}

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {request.customerName ||
                      request.customerId?.name ||
                      "-"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {request.phone ||
                      request.customerId?.phone ||
                      "-"}
                  </p>
                </td>

                {/* Dealer */}

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-700">
                    {request.allocatedDealerId
                      ?.technicianFirmName || "-"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {request.allocatedDealerId
                      ?.technicianName || ""}
                  </p>
                </td>

                {/* Product */}

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-700">
                    {request.productName || "-"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {request.productType || ""}
                  </p>
                </td>

                {/* Cancellation Reason */}

                <td className="max-w-xs px-5 py-4">
                  {request.cancellationReason ? (
                    <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                      {request.cancellationReason.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                {/* Status */}

                <td className="px-5 py-4">
                  <StatusBadge
                    status={request.status}
                  />
                </td>

                {/* Cancelled At */}

                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                  {request.cancelledAt
                    ? new Date(
                        request.cancelledAt,
                      ).toLocaleString()
                    : "-"}
                </td>

                {/* Updated At */}

                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                  {request.updatedAt
                    ? new Date(
                        request.updatedAt,
                      ).toLocaleString()
                    : "-"}
                </td>

                {/* Actions */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/complaints/${request._id}`,
                        )
                      }
                      title="View Complaint"
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </button>

                    {/* Status Dropdown */}

                    <select
                      defaultValue=""
                      onChange={(event) => {
                        const value =
                          event.target
                            .value as
                            | "REOPEN"
                            | "CLOSE";

                        if (!value) {
                          return;
                        }

                        onStatusChange?.(
                          request,
                          value,
                        );

                        // Reset dropdown
                        event.target.value =
                          "";
                      }}
                      className="min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                      <option
                        value=""
                        disabled
                      >
                        Change Status
                      </option>

                      <option value="REOPEN">
                        Reopen
                      </option>

                      <option value="CLOSED">
                        Close
                      </option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
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
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStyle()}`}
    >
      {status
        ? status.replaceAll("_", " ")
        : "-"}
    </span>
  );
}