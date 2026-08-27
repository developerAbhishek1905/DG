import type {
  SLAPerformanceItem,
} from "../services/dashboardApi";

interface Props {
  data: SLAPerformanceItem[];
}

export default function SLAPerformanceChart({
  data,
}: Props) {
  const total =
    data.reduce(
      (sum, item) =>
        sum + item.count,
      0
    );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        SLA Performance
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Current operational SLA health.
      </p>

      <div className="mt-6 space-y-5">
        {data.map(
          (item) => {
            const percentage =
              total
                ? (item.count /
                    total) *
                  100
                : 0;

            return (
              <div
                key={
                  item.label
                }
              >
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">
                    {
                      item.label
                    }
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {item.count}
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      item.label ===
                      "Within SLA"
                        ? "bg-green-500"
                        : item.label ===
                          "Warning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}