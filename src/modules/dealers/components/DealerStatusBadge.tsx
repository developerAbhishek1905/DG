// import type { DealerStatus } from "../types/dealer.types";

// interface Props {
//   status: DealerStatus;
// }

// const statusConfig = {
//   active: {
//     label: "Active",
//     className:
//       "bg-green-100 text-green-700",
//   },

//   inactive: {
//     label: "Inactive",
//     className:
//       "bg-gray-100 text-gray-700",
//   },

//   suspended: {
//     label: "Suspended",
//     className:
//       "bg-red-100 text-red-700",
//   },
// };

// export default function DealerStatusBadge({
//   status,
// }: Props) {
//   const config = statusConfig[status];

//   return (
//     <span
//       className={`rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
//     >
//       {config.label}
//     </span>
//   );
// }

// import Badge from "../../../components/ui/Badge";

// import type {
//   DealerStatus,
// } from "../types/dealer.types";

// interface Props {
//   status: DealerStatus;
// }

// export default function DealerStatusBadge({
//   status,
// }: Props) {
//   const variants = {
//     ACTIVE: "success",
//     INACTIVE: "neutral",
//     SUSPENDED: "danger",
//     LEAVE: "warning"
//   } as const;

//   const labels = {
//     ACTIVE: "Active",
//     INACTIVE: "Inactive",
//     SUSPENDED: "Suspended",
//     LEAVE: "Leave"
//   };

//   return (
//     <Badge variant={variants[status]}>
//       {labels[status]}
//     </Badge>
//   );
// }

export default function DealerStatusBadge({
  status,
}: {
  status?:
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED"
    | "LEAVE";
}) {

  console.log(status)
  const variants = {
    ACTIVE: "bg-green-50 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    SUSPENDED: "bg-red-50 text-red-700",
    LEAVE: "bg-amber-50 text-amber-700",
  };

  const labels = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SUSPENDED: "Suspended",
    LEAVE: "On Leave",
  };

  const currentStatus = status ?? "INACTIVE";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
        variants[currentStatus]
      }`}
    >
      {labels[currentStatus]}
    </span>
  );
}