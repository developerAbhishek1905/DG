// import {
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   X,
//   XCircle,
// } from "lucide-react";

// import type { DealerLeave } from "../types/dealer.types";

// interface Props {
//   open: boolean;
//   leaves?: DealerLeave[];
//   onClose: () => void;
// }

// export default function DealerLeaveHistoryModal({
//   open,
//   leaves = [],
//   onClose,
// }: Props) {
//   if (!open) return null;

//   const sortedLeaves = [...leaves].sort(
//     (a, b) =>
//       new Date(b.from).getTime() -
//       new Date(a.from).getTime(),
//   );

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
//       <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
//         {/* HEADER */}

//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//           <div className="flex items-center gap-2">
//             <CalendarDays
//               size={19}
//               className="text-[#123B7A]"
//             />

//             <div>
//               <h2 className="text-base font-semibold text-gray-900">
//                 Leave History
//               </h2>

//               <p className="mt-0.5 text-xs text-gray-500">
//                 {leaves.length}{" "}
//                 {leaves.length === 1
//                   ? "leave record"
//                   : "leave records"}
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* BODY */}

//         <div className="overflow-y-auto">
//           {!sortedLeaves.length ? (
//             <div className="px-5 py-14 text-center">
//               <CalendarDays
//                 size={32}
//                 className="mx-auto mb-3 text-gray-300"
//               />

//               <p className="text-sm font-medium text-gray-600">
//                 No leave history found
//               </p>

//               <p className="mt-1 text-xs text-gray-400">
//                 Dealer has not registered any leave.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[650px] text-left">
//                 <thead className="sticky top-0 bg-gray-50">
//                   <tr>
//                     <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
//                       From
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
//                       To
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
//                       Duration
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
//                       Reason
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-100">
//                   {sortedLeaves.map((leave) => (
//                     <tr
//                       key={leave._id}
//                       className="hover:bg-gray-50"
//                     >
//                       <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
//                         {formatDate(leave.from)}
//                       </td>

//                       <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
//                         {formatDate(leave.to)}
//                       </td>

//                       <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
//                         {getLeaveDuration(
//                           leave.from,
//                           leave.to,
//                         )}
//                       </td>

//                       <td className="max-w-[220px] px-5 py-4">
//                         <p
//                           title={leave.reason || ""}
//                           className="truncate text-sm text-gray-600"
//                         >
//                           {leave.reason || "-"}
//                         </p>
//                       </td>

//                       <td className="whitespace-nowrap px-5 py-4">
//                         <LeaveStatusBadge
//                           status={leave.status}
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* FOOTER */}

//         <div className="flex justify-end border-t border-gray-200 px-5 py-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ========================================
//    STATUS BADGE
// ======================================== */

// function LeaveStatusBadge({
//   status,
// }: {
//   status: DealerLeave["status"];
// }) {
//   const config = {
//     SCHEDULED: {
//       label: "Scheduled",
//       style:
//         "border-blue-200 bg-blue-50 text-blue-700",
//       icon: Clock3,
//     },

//     ACTIVE: {
//       label: "On Leave",
//       style:
//         "border-amber-200 bg-amber-50 text-amber-700",
//       icon: CalendarDays,
//     },

//     COMPLETED: {
//       label: "Completed",
//       style:
//         "border-green-200 bg-green-50 text-green-700",
//       icon: CheckCircle2,
//     },

//     CANCELLED: {
//       label: "Cancelled",
//       style:
//         "border-red-200 bg-red-50 text-red-700",
//       icon: XCircle,
//     },
//   };

//   const current = config[status];
//   const Icon = current.icon;

//   return (
//     <span
//       className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${current.style}`}
//     >
//       <Icon size={12} />

//       {current.label}
//     </span>
//   );
// }

// /* ========================================
//    DATE
// ======================================== */

// function formatDate(date: string) {
//   return new Date(date).toLocaleDateString(
//     "en-IN",
//     {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     },
//   );
// }

// /* ========================================
//    DURATION
// ======================================== */

// function getLeaveDuration(
//   from: string,
//   to: string,
// ) {
//   const start = new Date(from);
//   const end = new Date(to);

//   start.setHours(0, 0, 0, 0);
//   end.setHours(0, 0, 0, 0);

//   const difference =
//     end.getTime() - start.getTime();

//   const days =
//     Math.floor(
//       difference / (1000 * 60 * 60 * 24),
//     ) + 1;

//   return `${days} ${days === 1 ? "Day" : "Days"}`;
// }

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  X,
  XCircle,
} from "lucide-react";

import { useState } from "react";
import { toast } from "react-toastify";

import type { DealerLeave } from "../types/dealer.types";
import { endDealerLeave } from "../services/dealerApi"; 

interface Props {
  open: boolean;
  dealerId: string;
  leaves?: DealerLeave[];
  onClose: () => void;

  // Call this after leave is ended so parent can refetch dealer
  onLeaveEnded?: () => void | Promise<void>;
}

export default function DealerLeaveHistoryModal({
  open,
  dealerId,
  leaves = [],
  onClose,
  onLeaveEnded,
}: Props) {
  const [endingLeave, setEndingLeave] = useState(false);

  console.log(dealerId)

  if (!open) return null;

  const sortedLeaves = [...leaves].sort(
    (a, b) =>
      new Date(b.from).getTime() -
      new Date(a.from).getTime(),
  );

  const handleEndLeave = async () => {
    if (!dealerId) {
      toast.error("Dealer ID not found");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to end this leave immediately?",
    );

    if (!confirmed) return;

    try {
      setEndingLeave(true);

      const response = await endDealerLeave(dealerId);

      toast.success(
        response?.message || "Dealer leave ended successfully",
      );

      await onLeaveEnded?.();
    } catch (error: any) {
      console.error("End dealer leave error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to end dealer leave",
      );
    } finally {
      setEndingLeave(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={19}
              className="text-[#123B7A]"
            />

            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Leave History
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {leaves.length}{" "}
                {leaves.length === 1
                  ? "leave record"
                  : "leave records"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={endingLeave}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}

        <div className="overflow-y-auto">
          {!sortedLeaves.length ? (
            <div className="px-5 py-14 text-center">
              <CalendarDays
                size={32}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="text-sm font-medium text-gray-600">
                No leave history found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Dealer has not registered any leave.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      From
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      To
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Duration
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Reason
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {sortedLeaves.map((leave) => (
                    <tr
                      key={leave._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                        {formatDate(leave.from)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                        {formatDate(leave.to)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {getLeaveDuration(
                          leave.from,
                          leave.to,
                        )}
                      </td>

                      <td className="max-w-[220px] px-5 py-4">
                        <p
                          title={leave.reason || ""}
                          className="truncate text-sm text-gray-600"
                        >
                          {leave.reason || "-"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <LeaveStatusBadge
                          status={leave.status}
                        />
                      </td>

                      {/* ACTION */}

                      <td className="whitespace-nowrap px-5 py-4">
                        {leave.status === "ACTIVE" ? (
                          <button
                            type="button"
                            onClick={handleEndLeave}
                            disabled={endingLeave}
                            className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {endingLeave ? (
                              <>
                                <Loader2
                                  size={13}
                                  className="animate-spin"
                                />
                                Ending...
                              </>
                            ) : (
                              <>
                                <XCircle size={13} />
                                End Leave
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={endingLeave}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   STATUS BADGE
======================================== */

function LeaveStatusBadge({
  status,
}: {
  status: DealerLeave["status"];
}) {
  const config = {
    SCHEDULED: {
      label: "Scheduled",
      style:
        "border-blue-200 bg-blue-50 text-blue-700",
      icon: Clock3,
    },

    ACTIVE: {
      label: "On Leave",
      style:
        "border-amber-200 bg-amber-50 text-amber-700",
      icon: CalendarDays,
    },

    COMPLETED: {
      label: "Completed",
      style:
        "border-green-200 bg-green-50 text-green-700",
      icon: CheckCircle2,
    },

    CANCELLED: {
      label: "Cancelled",
      style:
        "border-red-200 bg-red-50 text-red-700",
      icon: XCircle,
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${current.style}`}
    >
      <Icon size={12} />
      {current.label}
    </span>
  );
}

/* ========================================
   DATE
======================================== */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ========================================
   DURATION
======================================== */

function getLeaveDuration(
  from: string,
  to: string,
) {
  const start = new Date(from);
  const end = new Date(to);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const difference =
    end.getTime() - start.getTime();

  const days =
    Math.floor(
      difference / (1000 * 60 * 60 * 24),
    ) + 1;

  return `${days} ${days === 1 ? "Day" : "Days"}`;
}