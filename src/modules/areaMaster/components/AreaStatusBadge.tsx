import StatusBadge from "../../../components/ui/StatusBadge";
import type { AreaStatus } from "../types/area.types";

interface Props {
  status: AreaStatus;
}

export default function AreaStatusBadge({ status }: Props) {
  return <StatusBadge status={status} />;
}
