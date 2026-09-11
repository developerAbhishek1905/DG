// import { CalendarClock, Eye, RefreshCw } from "lucide-react";

// import { useNavigate } from "react-router-dom";

// import AppointmentStatusBadge from "./AppointmentStatusBadge";

// import type { Appointment } from "../types/appointment.types";

// interface Props {
//   appointments: Appointment[];

//   onReschedule?: (appointmentId: string) => void;
// }

// export default function AppointmentTable({
//   appointments,
//   onReschedule,
// }: Props) {
//   const navigate = useNavigate();

//   if (!appointments.length) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
//         No appointments found.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[1100px] text-left">
//           <thead className="border-b border-gray-200 bg-gray-50">
//             <tr>
//               {[
//                 "Complaint",
//                 "Customer",
//                 "Dealer",
//                 "Type",
//                 "Date",
//                 "Time",
//                 "Status",
//                 "Reschedules",
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

//           <tbody className="divide-y divide-gray-100">
//             {appointments.map((appointment) => (
//               <tr key={appointment.id} className="hover:bg-gray-50">
//                 <td className="px-5 py-4">
//                   <button
//                     onClick={() => navigate(`/appointments/${appointment.id}`)}
//                     className="font-medium text-[#123B7A] hover:underline"
//                   >
//                     {appointment.complaintNumber}
//                   </button>

//                   <p className="mt-1 text-xs text-gray-400">{appointment.id}</p>
//                 </td>

//                 <td className="px-5 py-4">
//                   <p className="text-sm font-medium text-gray-900">
//                     {appointment.customer.name}
//                   </p>

//                   <p className="mt-1 text-xs text-gray-500">
//                     {appointment.customer.phone}
//                   </p>
//                 </td>

//                 <td className="px-5 py-4">
//                   <p className="text-sm text-gray-700">
//                     {appointment.dealer.name}
//                   </p>
//                 </td>

//                 <td className="px-5 py-4 text-sm text-gray-600">
//                   {appointment.type}
//                 </td>

//                 <td className="px-5 py-4 text-sm text-gray-600">
//                   {appointment.appointmentDate}
//                 </td>

//                 <td className="px-5 py-4 text-sm text-gray-600">
//                   {appointment.appointmentTime}
//                 </td>

//                 <td className="px-5 py-4">
//                   <AppointmentStatusBadge status={appointment.status} />
//                 </td>

//                 <td className="px-5 py-4 text-sm text-gray-600">
//                   {appointment.rescheduleCount}
//                 </td>

//                 <td className="px-5 py-4">
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() =>
//                         navigate(`/appointments/${appointment.id}`)
//                       }
//                       title="View"
//                       className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
//                     >
//                       <Eye size={17} />
//                     </button>

//                     {onReschedule &&
//                       appointment.status !== "COMPLETED" &&
//                       appointment.status !== "CANCELLED" && (
//                         <button
//                           onClick={() => onReschedule(appointment.id)}
//                           title="Reschedule"
//                           className="rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
//                         >
//                           <RefreshCw size={17} />
//                         </button>
//                       )}

//                     {/* <button
//                         title="Calendar"
//                         className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
//                       >
//                         <CalendarClock
//                           size={17}
//                         />
//                       </button> */}
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

import { Eye, RefreshCw } from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { Appointment } from "../types/appointment.types";
import AppointmentStatusBadge from "./AppointmentStatusBadge";
import { useAppSelector } from "../../../app/hooks";

interface Props {
  appointments: Appointment[];

  onReschedule?: (appointmentId: string) => void;

  onStatusChange?: (appointmentId: string, status: AppointmentStatus) => void;
}

export default function AppointmentTable({
  appointments,
  onReschedule,
  onStatusChange,
}: Props) {
  const navigate = useNavigate();
const auth = useAppSelector((state) => state.auth);

const roleCode = auth.user?.role?.code;

const isDealer = roleCode === "DEALER";

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!appointments.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No complaints found.
      </div>
    );
  }

  return (
    <>
      {/* MOBILE VIEW */}

{/* =========================
    MOBILE VIEW
========================= */}

<div className="space-y-4 md:hidden">
  {appointments.map((appointment) => {
    const getCardBorderColor = (status: string) => {
      switch (status) {
        case "REGISTERED":
          return "border-gray-300";

        case "ALLOCATED":
          return "border-indigo-400";

        case "APPOINTMENT_SCHEDULED":
          return "border-blue-500";

        case "PENDING":
          return "border-yellow-400";

        case "WORK_IN_PROGRESS":
          return "border-orange-400";

        case "WORK_COMPLETED":
          return "border-emerald-400";

        case "DG_VERIFICATION":
          return "border-purple-400";

        case "CLOSED":
          return "border-green-500";

        case "CANCELLED":
          return "border-red-500";

        default:
          return "border-gray-200";
      }
    };

    const formatReason = (value?: string) => {
      if (!value) return "-";

      return value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) =>
          char.toUpperCase(),
        );
    };

    const complaintAddress = [
      appointment.address?.addressLine,
      appointment.address?.city,
      appointment.address?.district,
      appointment.address?.state,
      appointment.address?.pinCode,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <div
        key={appointment._id}
        className={`overflow-hidden rounded-xl border-2 bg-white ${getCardBorderColor(
          appointment.status,
        )}`}
      >
        {/* =========================
            HEADER
        ========================== */}

        <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Complaint
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/appointments/${appointment._id}`,
                )
              }
              className="mt-1 break-all text-left text-sm font-bold text-[#123B7A]"
            >
              {appointment.complaintNumber}
            </button>

            <p className="mt-1 text-xs text-gray-400">
              {formatDate(
                appointment.complaintDateTime,
              )}{" "}
              •{" "}
              {formatTime(
                appointment.complaintDateTime,
              )}
            </p>
          </div>

          <div className="shrink-0">
            <AppointmentStatusBadge
              status={appointment.status}
            />
          </div>
        </div>

        <div className="p-4">
          {/* =========================
              CUSTOMER
          ========================== */}

          <div className="border-b border-gray-100 pb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Customer
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {appointment.customerName || "-"}
            </p>

            {appointment.phone ? (
              <a
                href={`tel:${appointment.phone}`}
                className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                {appointment.phone}
              </a>
            ) : (
              <p className="mt-1 text-sm text-gray-400">
                -
              </p>
            )}

            {appointment.alternatePhone && (
              <div className="mt-1">
                <span className="mr-1 text-xs text-gray-400">
                  Alternate:
                </span>

                <a
                  href={`tel:${appointment.alternatePhone}`}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  {appointment.alternatePhone}
                </a>
              </div>
            )}
          </div>

          {/* =========================
              APPOINTMENT HIGHLIGHT
          ========================== */}

          {appointment.status ===
            "APPOINTMENT_SCHEDULED" &&
            (appointment.appointmentDate ||
              appointment.appointmentTime) && (
              <div className="my-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Appointment Scheduled
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-500">
                      Date
                    </p>

                    <p className="mt-1 text-base font-bold text-blue-900">
                      {appointment.appointmentDate
                        ? new Date(
                            appointment.appointmentDate,
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-blue-500">
                      Time
                    </p>

                    <p className="mt-1 text-base font-bold text-blue-900">
                      {appointment.appointmentTime ||
                        "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* =========================
              DETAILS
          ========================== */}

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4">
            {/* Product */}

            <div>
              <p className="text-xs text-gray-400">
                Product
              </p>

              <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                {appointment.productName || "-"}
              </p>
            </div>

            {/* Product Type */}

            <div>
              <p className="text-xs text-gray-400">
                Product Type
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {appointment.productType || "-"}
              </p>
            </div>

            {/* Category */}

            <div>
              <p className="text-xs text-gray-400">
                Category
              </p>

              <p className="mt-1 text-sm font-bold text-gray-800">
                {appointment.category || "-"}
              </p>

              {appointment.categoryId
                ?.description && (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {
                    appointment.categoryId
                      .description
                  }
                </p>
              )}
            </div>

            {/* Units */}

            <div>
              <p className="text-xs text-gray-400">
                Units
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {appointment.units ?? "-"}
              </p>
            </div>

            {/* Complaint Type */}

            <div>
              <p className="text-xs text-gray-400">
                Complaint Type
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {appointment.complaintType || "-"}
              </p>
            </div>

            {/* Brand */}

            <div>
              <p className="text-xs text-gray-400">
                Brand
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {appointment.brand || "-"}
              </p>
            </div>

            {/* =========================
                COMPLAINT ADDRESS
            ========================== */}

            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-400">
                Complaint Address
              </p>

              <p className="mt-1 break-words text-sm leading-6 text-gray-700">
                {complaintAddress || "-"}
              </p>
            </div>

            {/* =========================
                FAULT
            ========================== */}

            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-400">
                Fault Reported
              </p>

              <p className="mt-1 break-words text-sm leading-6 text-gray-700">
                {appointment.faultReported ||
                  "-"}
              </p>
            </div>

            {/* =========================
                PENDING REASON
            ========================== */}

            {appointment.status ===
              "PENDING" &&
              appointment.pendingReason && (
                <div className="col-span-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-yellow-600">
                    Pending Reason
                  </p>

                  <p className="mt-1 text-sm font-semibold text-yellow-800">
                    {formatReason(
                      appointment.pendingReason,
                    )}
                  </p>
                </div>
              )}

            {/* =========================
                CANCELLATION REASON
            ========================== */}

            {appointment.status ===
              "CANCELLED" &&
              appointment.cancellationReason && (
                <div className="col-span-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                    Cancellation Reason
                  </p>

                  <p className="mt-1 text-sm font-semibold text-red-800">
                    {formatReason(
                      appointment.cancellationReason,
                    )}
                  </p>
                </div>
              )}
          </div>

          {/* =========================
              CHANGE STATUS
          ========================== */}

          {appointment.status !== "CLOSED" &&
            appointment.status !==
              "CANCELLED" && (
              <div className="border-t border-gray-100 py-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Change Status
                </label>

                <select
                  value=""
                  onChange={(e) => {
                    const selectedStatus =
                      e.target
                        .value as AppointmentStatus;

                    if (!selectedStatus) {
                      return;
                    }

                    onStatusChange?.(
                      appointment._id,
                      selectedStatus,
                    );
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
                >
                  <option value="">
                    Select New Status
                  </option>

                  <option value="APPOINTMENT_SCHEDULED">
                    Appointment Scheduled
                  </option>

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>

                  <option value="CLOSED">
                    Closed
                  </option>
                </select>
              </div>
            )}

            {/* =========================
    ALLOCATED DEALER
========================= */}

{!isDealer && appointment.allocatedDealerId && (
  <div className="col-span-2 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
      Allocated Dealer
    </p>

    <div className="mt-2 grid grid-cols-2 gap-3">
      <div>
        <p className="text-xs text-gray-400">
          Firm Name
        </p>

        <p className="mt-1 text-sm font-semibold text-gray-800">
          {appointment.allocatedDealerId
            .technicianFirmName || "-"}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">
          Dealer / Technician
        </p>

        <p className="mt-1 text-sm font-semibold text-gray-800">
          {appointment.allocatedDealerId
            .technicianName || "-"}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">
          Head Code
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {appointment.allocatedDealerId.headCode ||
            "-"}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">
          Mobile
        </p>

        {appointment.allocatedDealerId
          .mobileNumber ? (
          <a
            href={`tel:${appointment.allocatedDealerId.mobileNumber}`}
            className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            {
              appointment.allocatedDealerId
                .mobileNumber
            }
          </a>
        ) : (
          <p className="mt-1 text-sm text-gray-400">
            -
          </p>
        )}
      </div>

      {appointment.allocatedDealerId.email && (
        <div className="col-span-2">
          <p className="text-xs text-gray-400">
            Email
          </p>

          <p className="mt-1 break-all text-sm text-gray-700">
            {appointment.allocatedDealerId.email}
          </p>
        </div>
      )}
    </div>
  </div>
)}

          {/* =========================
              ACTION BUTTONS
          ========================== */}

          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/appointments/${appointment._id}`,
                )
              }
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Eye size={16} />

              View
            </button>

            {onReschedule &&
              appointment.status !==
                "CLOSED" &&
              appointment.status !==
                "CANCELLED" && (
                <button
                  type="button"
                  onClick={() =>
                    onReschedule(
                      appointment._id,
                    )
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <RefreshCw size={16} />

                  Reschedule
                </button>
              )}
          </div>
        </div>
      </div>
    );
  })}
</div>

{/* =========================
    DESKTOP VIEW - COMPACT
========================= */}

{/* =========================
    DESKTOP VIEW
========================= */}

<div className="hidden lg:block">
  <div className="space-y-2">
    {appointments.map((appointment) => {
      const complaintAddress = [
        appointment.address?.addressLine,
        appointment.address?.city,
        appointment.address?.district,
        appointment.address?.state,
        appointment.address?.pinCode,
      ]
        .filter(Boolean)
        .join(", ");

      const formatReason = (value?: string) => {
        if (!value) return "-";

        return value
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (char) =>
            char.toUpperCase(),
          );
      };

      const getRowBorderColor = (
        status: string,
      ) => {
        switch (status) {
          case "REGISTERED":
            return "border-l-gray-400";

          case "ALLOCATED":
            return "border-l-indigo-500";

          case "APPOINTMENT_SCHEDULED":
            return "border-l-blue-500";

          case "PENDING":
            return "border-l-yellow-500";

          case "WORK_IN_PROGRESS":
            return "border-l-orange-500";

          case "WORK_COMPLETED":
            return "border-l-emerald-500";

          case "DG_VERIFICATION":
            return "border-l-purple-500";

          case "CLOSED":
            return "border-l-green-500";

          case "CANCELLED":
            return "border-l-red-500";

          default:
            return "border-l-gray-300";
        }
      };

      return (
        <div
          key={appointment._id}
          className={`overflow-hidden rounded-lg border border-gray-200 border-l-4 bg-white shadow-sm transition hover:border-gray-300 hover:shadow ${getRowBorderColor(
            appointment.status,
          )}`}
        >
          {/* =========================
              MAIN CONTENT
          ========================== */}

          <div className="grid grid-cols-[1.15fr_1.3fr_1.6fr_1.25fr_1.5fr] gap-0">
            {/* =========================
                COMPLAINT
            ========================== */}

            <div className="border-r border-gray-100 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Complaint
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/appointments/${appointment._id}`,
                  )
                }
                className="mt-1 block max-w-full truncate text-left text-xs font-bold text-[#123B7A] hover:underline"
              >
                {appointment.complaintNumber}
              </button>

              <p className="mt-1 text-[11px] text-gray-500">
                {formatDate(
                  appointment.complaintDateTime,
                )}
              </p>

              <p className="text-[11px] text-gray-400">
                {formatTime(
                  appointment.complaintDateTime,
                )}
              </p>
            </div>

            {/* =========================
                CUSTOMER
            ========================== */}

            <div className="border-r border-gray-100 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Customer
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-gray-900">
                {appointment.customerName || "-"}
              </p>

              {appointment.phone ? (
                <a
                  href={`tel:${appointment.phone}`}
                  className="mt-1 block text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  {appointment.phone}
                </a>
              ) : (
                <p className="mt-1 text-[11px] text-gray-400">
                  -
                </p>
              )}

              {appointment.alternatePhone && (
                <p className="mt-0.5 truncate text-[10px] text-gray-400">
                  Alt:{" "}
                  <a
                    href={`tel:${appointment.alternatePhone}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {appointment.alternatePhone}
                  </a>
                </p>
              )}
            </div>

            {/* =========================
                PRODUCT
            ========================== */}

            <div className="border-r border-gray-100 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Product
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-gray-900">
                {appointment.productName || "-"}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-1">
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                  {appointment.productType || "-"}
                </span>

                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                  {appointment.category || "-"}
                </span>

                <span className="text-[10px] text-gray-500">
                  Qty: {appointment.units ?? "-"}
                </span>
              </div>

              {appointment.categoryId
                ?.description && (
                <p
                  className="mt-1 truncate text-[10px] text-gray-400"
                  title={
                    appointment.categoryId
                      .description
                  }
                >
                  {
                    appointment.categoryId
                      .description
                  }
                </p>
              )}
            </div>

            {/* =========================
                APPOINTMENT
            ========================== */}

            <div className="border-r border-gray-100 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Appointment
              </p>

              {appointment.appointmentDate ||
              appointment.appointmentTime ? (
                <div className="mt-1 rounded-md bg-blue-50 px-2 py-1.5">
                  <p className="text-xs font-bold text-blue-900">
                    {appointment.appointmentDate
                      ? new Date(
                          appointment.appointmentDate,
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "-"}
                  </p>

                  <p className="mt-0.5 text-[11px] font-semibold text-blue-600">
                    {appointment.appointmentTime ||
                      "-"}
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-[11px] text-gray-400">
                  Not scheduled
                </p>
              )}
            </div>

            {/* =========================
                STATUS / ACTION
            ========================== */}

            <div className="px-3 py-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </p>

                  <div className="mt-1">
                    <AppointmentStatusBadge
                      status={appointment.status}
                    />
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/appointments/${appointment._id}`,
                      )
                    }
                    title="View"
                    className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye size={14} />
                  </button>

                  {onReschedule &&
                    appointment.status !==
                      "CLOSED" &&
                    appointment.status !==
                      "CANCELLED" && (
                      <button
                        type="button"
                        onClick={() =>
                          onReschedule(
                            appointment._id,
                          )
                        }
                        title="Reschedule"
                        className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <RefreshCw size={14} />
                      </button>
                    )}
                </div>
              </div>

              {appointment.status !== "CLOSED" &&
                appointment.status !==
                  "CANCELLED" && (
                  <select
                    value=""
                    onChange={(e) => {
                      const selectedStatus =
                        e.target
                          .value as AppointmentStatus;

                      if (!selectedStatus) {
                        return;
                      }

                      onStatusChange?.(
                        appointment._id,
                        selectedStatus,
                      );
                    }}
                    className="mt-1.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[10px] font-medium text-gray-600 outline-none focus:border-[#123B7A]"
                  >
                    <option value="">
                      Change Status
                    </option>

                    <option value="APPOINTMENT_SCHEDULED">
                      Appointment Scheduled
                    </option>

                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>

                    <option value="CLOSED">
                      Closed
                    </option>
                  </select>
                )}
            </div>
          </div>

          {/* =========================
              COMPACT INFO STRIP
          ========================== */}

          <div className="grid grid-cols-12 gap-0 border-t border-gray-100 bg-gray-50/60">
            {/* Complaint Address */}

            <div
              className={`${
                !isDealer &&
                appointment.allocatedDealerId
                  ? "col-span-4"
                  : "col-span-5"
              } border-r border-gray-100 px-3 py-2`}
            >
              <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                Complaint Address
              </p>

              <p
                className="mt-0.5 truncate text-[11px] text-gray-600"
                title={complaintAddress}
              >
                {complaintAddress || "-"}
              </p>
            </div>

            {/* Fault */}

            <div
              className={`${
                !isDealer &&
                appointment.allocatedDealerId
                  ? "col-span-3"
                  : "col-span-4"
              } border-r border-gray-100 px-3 py-2`}
            >
              <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                Fault Reported
              </p>

              <p
                className="mt-0.5 truncate text-[11px] text-gray-600"
                title={
                  appointment.faultReported ||
                  ""
                }
              >
                {appointment.faultReported ||
                  "-"}
              </p>
            </div>

            {/* Dealer */}

            {!isDealer &&
              appointment.allocatedDealerId && (
                <div className="col-span-3 border-r border-gray-100 px-3 py-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-indigo-500">
                    Allocated Dealer
                  </p>

                  <div className="mt-0.5 flex items-center gap-2">
                    <p
                      className="min-w-0 truncate text-[11px] font-semibold text-gray-700"
                      title={
                        appointment
                          .allocatedDealerId
                          .technicianFirmName ||
                        ""
                      }
                    >
                      {appointment
                        .allocatedDealerId
                        .technicianFirmName ||
                        "-"}
                    </p>

                    {appointment
                      .allocatedDealerId
                      .mobileNumber && (
                      <>
                        <span className="text-gray-300">
                          •
                        </span>

                        <a
                          href={`tel:${appointment.allocatedDealerId.mobileNumber}`}
                          className="shrink-0 text-[10px] font-medium text-blue-600 hover:underline"
                        >
                          {
                            appointment
                              .allocatedDealerId
                              .mobileNumber
                          }
                        </a>
                      </>
                    )}
                  </div>

                  {appointment.allocatedDealerId
                    .technicianName && (
                    <p className="truncate text-[10px] text-gray-400">
                      {
                        appointment
                          .allocatedDealerId
                          .technicianName
                      }
                    </p>
                  )}
                </div>
              )}

            {/* Reason */}

            <div
              className={`${
                !isDealer &&
                appointment.allocatedDealerId
                  ? "col-span-2"
                  : "col-span-3"
              } px-3 py-2`}
            >
              {appointment.status ===
                "PENDING" &&
              appointment.pendingReason ? (
                <>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-yellow-600">
                    Pending Reason
                  </p>

                  <p
                    className="mt-0.5 truncate text-[11px] font-medium text-yellow-700"
                    title={formatReason(
                      appointment.pendingReason,
                    )}
                  >
                    {formatReason(
                      appointment.pendingReason,
                    )}
                  </p>
                </>
              ) : appointment.status ===
                  "CANCELLED" &&
                appointment.cancellationReason ? (
                <>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-red-600">
                    Cancellation Reason
                  </p>

                  <p
                    className="mt-0.5 truncate text-[11px] font-medium text-red-700"
                    title={formatReason(
                      appointment.cancellationReason,
                    )}
                  >
                    {formatReason(
                      appointment.cancellationReason,
                    )}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                    Complaint Type
                  </p>

                  <p className="mt-0.5 text-[11px] font-medium text-gray-600">
                    {appointment.complaintType ||
                      "-"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
    </>
  );
}
