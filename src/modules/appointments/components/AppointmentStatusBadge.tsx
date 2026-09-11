import Badge from "../../../components/ui/Badge";

import type {
  AppointmentStatus,
} from "../types/appointment.types";

// interface Props {
//   status: AppointmentStatus;
// }

// export default function AppointmentStatusBadge({
//   status,
// }: Props) {
//   const variants = {
//     SCHEDULED: "info",

//     CONFIRMED: "success",

//     RESCHEDULED:
//       "warning",

//     COMPLETED: "success",

//     CANCELLED: "danger",

//     NO_SHOW: "danger",
//   } as const;

//   const labels = {
//     SCHEDULED:
//       "Scheduled",

//     CONFIRMED:
//       "Confirmed",

//     RESCHEDULED:
//       "Rescheduled",

//     COMPLETED:
//       "Completed",

//     CANCELLED:
//       "Cancelled",

//     NO_SHOW:
//       "No Show",
//   };

//   return (
//     <Badge
//       variant={
//         variants[status]
//       }
//     >
//       {labels[status]}
//     </Badge>
//   );
// }

interface Props {
  status: string;
}

export default function AppointmentStatusBadge({
  status,
}: Props) {
  const statusStyles: Record<string, string> = {
    REGISTERED:
      "bg-slate-100 text-slate-700 border-slate-200",

    ALLOCATED:
      "bg-indigo-100 text-indigo-700 border-indigo-200",

    APPOINTMENT_SCHEDULED:
      "bg-blue-100 text-blue-700 border-blue-200",

    PENDING:
      "bg-yellow-100 text-yellow-700 border-yellow-200",

    WORK_IN_PROGRESS:
      "bg-orange-100 text-orange-700 border-orange-200",

    WORK_COMPLETED:
      "bg-emerald-100 text-emerald-700 border-emerald-200",

    DG_VERIFICATION:
      "bg-purple-100 text-purple-700 border-purple-200",

    CLOSED:
      "bg-green-100 text-green-700 border-green-200",

    CANCELLED:
      "bg-red-100 text-red-700 border-red-200",
  };

  const label = status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] ??
        "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {label}
    </span>
  );
}