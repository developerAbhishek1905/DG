import type {
  ReportChartItem,
} from "../types/report.types";

interface Props {
  title?: string;
  data: ReportChartItem[];
}

export default function ReportChart({
  title = "Report Overview",
  data,
}: Props) {
  const maxValue =
    Math.max(
      ...data.map(
        (item) =>
          item.value
      ),
      1
    );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Visual breakdown of
          report data.
        </p>
      </div>

      <div className="mt-7 space-y-5">
        {data.map(
          (item) => {
            const percentage =
              (item.value /
                maxValue) *
              100;

            return (
              <div
                key={
                  item.label
                }
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="truncate text-sm text-gray-600">
                    {
                      item.label
                    }
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {item.value.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
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