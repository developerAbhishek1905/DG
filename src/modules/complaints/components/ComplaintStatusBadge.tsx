import Badge from "../../../components/ui/Badge";
import { COMPLAINT_STATUS_LABELS } from "../constants/complaint.constants";
import type { ComplaintStatus } from "../types/complaint.types";

interface Props {
  status: ComplaintStatus;
}

export default function ComplaintStatusBadge({ status }: Props) {
  const variant = {
    REGISTERED: "info",
    ALLOCATED: "info",
    APPOINTMENT_SCHEDULED: "info",
    RESCHEDULED: "info",
    REOPEN: "info",
    VISITED: "info",
    PENDING: "warning",
    PENDING_ON_CALL: "warning",
    PENDING_ON_VISIT: "warning",
    WORK_IN_PROGRESS: "warning",
    WORK_COMPLETED: "success",
    DG_VERIFICATION: "warning",
    CLOSED: "success",
    CLOSE_ON_BILLING: "danger",
    CANCEL_ON_VISIT: "danger",
    CLOSE_ON_VERIFICATION: "danger",
    CANCELLED: "danger",
    CANCEL_ON_CALL: "danger",
    SUSPENDED: "suspend",
      
       
  } as const;

  return (
    <Badge variant={variant[status]}>{COMPLAINT_STATUS_LABELS[status]}</Badge>
  );
}
