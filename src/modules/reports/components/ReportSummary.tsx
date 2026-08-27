import {
  BarChart3,
} from "lucide-react";

import type {
  ReportSummaryItem,
} from "../types/report.types";

interface Props {
  items: ReportSummaryItem[];
}

export default function ReportSummary({
  items,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(
        (item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {item.value}
                </p>

                {item.helper && (
                  <p className="mt-2 text-xs text-gray-400">
                    {item.helper}
                  </p>
                )}
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
                <BarChart3
                  size={18}
                />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}