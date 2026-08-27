import type {
  ComplaintStatusItem,
} from "../services/dashboardApi";

interface Props {
  data: ComplaintStatusItem[];
}

export default function ComplaintStatusChart({
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
        Complaint Status
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Current complaint distribution.
      </p>

      <div className="mt-6 space-y-4">
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
                  item.status
                }
              >
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-gray-600">
                    {
                      item.status
                    }
                  </span>

                  <span className="font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#123B7A]"
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