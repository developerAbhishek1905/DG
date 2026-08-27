import Badge from "../../../components/ui/Badge";

import type {
  UserStatus,
} from "../types/user.types";

interface Props {
  status: UserStatus;
}

export default function UserStatusBadge({
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