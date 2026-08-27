import Badge from "../../../components/ui/Badge";

import type {
  AppointmentStatus,
} from "../types/appointment.types";

interface Props {
  status: AppointmentStatus;
}

export default function AppointmentStatusBadge({
  status,
}: Props) {
  const variants = {
    SCHEDULED: "info",

    CONFIRMED: "success",

    RESCHEDULED:
      "warning",

    COMPLETED: "success",

    CANCELLED: "danger",

    NO_SHOW: "danger",
  } as const;

  const labels = {
    SCHEDULED:
      "Scheduled",

    CONFIRMED:
      "Confirmed",

    RESCHEDULED:
      "Rescheduled",

    COMPLETED:
      "Completed",

    CANCELLED:
      "Cancelled",

    NO_SHOW:
      "No Show",
  };

  return (
    <Badge
      variant={
        variants[status]
      }
    >
      {labels[status]}
    </Badge>
  );
}