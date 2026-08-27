import type {
  DashboardKPI,
} from "../services/dashboardApi";

interface Props {
  kpis: DashboardKPI;
}

export default function ComplaintStats({
  kpis,
}: Props) {
  const closed =
    kpis.verifiedClosures;

  const closureRate =
    kpis.totalComplaints
      ? (
          (closed /
            kpis.totalComplaints) *
          100
        ).toFixed(1)
      : "0";

  const openRate =
    kpis.totalComplaints
      ? (
          (kpis.openComplaints /
            kpis.totalComplaints) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Complaint Performance
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Overall complaint processing
        performance.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <Stat
          label="Closure Rate"
          value={`${closureRate}%`}
        />

        <Stat
          label="Open Rate"
          value={`${openRate}%`}
        />

        <Stat
          label="SLA Breach Rate"
          value={`${
            kpis.totalComplaints
              ? (
                  (kpis.slaBreached /
                    kpis.totalComplaints) *
                  100
                ).toFixed(1)
              : 0
          }%`}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}