import Badge from "../../../components/ui/Badge";

import {
  COMPLAINT_STATUS_LABELS,
} from "../constants/complaint.constants";

import type {
  ComplaintStatus,
} from "../types/complaint.types";

interface Props {
  status: ComplaintStatus;
}

export default function ComplaintStatusBadge({
  status,
}: Props) {
  const variant = {
    REGISTERED: "info",
    ALLOCATED: "info",
    APPOINTMENT_SCHEDULED: "info",
    PENDING: "warning",
    WORK_IN_PROGRESS: "warning",
    WORK_COMPLETED: "success",
    DG_VERIFICATION: "warning",
    CLOSED: "success",
    CANCELLED: "danger",
  } as const;

  return (
    <Badge variant={variant[status]}>
      {COMPLAINT_STATUS_LABELS[status]}
    </Badge>
  );
}