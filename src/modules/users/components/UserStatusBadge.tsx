import StatusBadge from "../../../components/ui/StatusBadge";
import type { UserStatus } from "../types/user.types";

interface Props {
  status: UserStatus;
}

export default function UserStatusBadge({ status }: Props) {
  return <StatusBadge status={status} />;
}
