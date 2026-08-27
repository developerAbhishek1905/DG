import type {
  ComplaintTrendItem,
} from "../services/dashboardApi";

interface Props {
  data: ComplaintTrendItem[];
}

export default function ComplaintTrendChart({
  data,
}: Props) {
  const maxValue =
    Math.max(
      ...data.flatMap(
        (item) => [
          item.created,
          item.closed,
        ]
      ),
      1
    );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Complaint Trend
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Created vs closed complaints.
        </p>
      </div>

      <div className="mt-6 flex h-64 items-end gap-4 overflow-x-auto border-b border-gray-200 pb-2">
        {data.map(
          (item) => (
            <div
              key={
                item.date
              }
              className="flex min-w-[60px] flex-1 flex-col items-center"
            >
              <div className="flex h-48 items-end gap-1">
                <div
                  title={`Created: ${item.created}`}
                  className="w-4 rounded-t bg-[#123B7A]"
                  style={{
                    height: `${
                      (item.created /
                        maxValue) *
                      100
                    }%`,
                  }}
                />

                <div
                  title={`Closed: ${item.closed}`}
                  className="w-4 rounded-t bg-green-500"
                  style={{
                    height: `${
                      (item.closed /
                        maxValue) *
                      100
                    }%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[11px] text-gray-500">
                {item.date}
              </p>
            </div>
          )
        )}
      </div>

      <div className="mt-4 flex gap-5 text-xs text-gray-500">
        <Legend
          label="Created"
          className="bg-[#123B7A]"
        />

        <Legend
          label="Closed"
          className="bg-green-500"
        />
      </div>
    </div>
  );
}

function Legend({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${className}`}
      />

      {label}
    </div>
  );
}