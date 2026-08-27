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

import Badge from "../../../components/ui/Badge";

import type {
  DealerStatus,
} from "../types/dealer.types";

interface Props {
  status: DealerStatus;
}

export default function DealerStatusBadge({
  status,
}: Props) {
  const variants = {
    ACTIVE: "success",
    INACTIVE: "neutral",
    SUSPENDED: "danger",
  } as const;

  const labels = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SUSPENDED: "Suspended",
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
}