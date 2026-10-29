import StatusBadge from "../../../components/ui/StatusBadge";
import { COMPLAINT_STATUS_LABELS } from "../constants/complaint.constants";
import type { ComplaintStatus } from "../types/complaint.types";

interface Props {
  status: ComplaintStatus;
}

export default function ComplaintStatusBadge({ status }: Props) {
  return (
    <StatusBadge
      status={status}
      label={COMPLAINT_STATUS_LABELS[status] ?? undefined}
    />
  );
}
