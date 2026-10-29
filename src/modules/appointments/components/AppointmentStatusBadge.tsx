import StatusBadge from "../../../components/ui/StatusBadge";

interface Props {
  status: string;
}

export default function AppointmentStatusBadge({ status }: Props) {
  return <StatusBadge status={status || "UNKNOWN"} />;
}
