import StatusBadge from "../../../components/ui/StatusBadge";

export default function DealerStatusBadge({
  status,
}: {
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "LEAVE";
}) {
  return <StatusBadge status={status ?? "INACTIVE"} size="sm" />;
}
