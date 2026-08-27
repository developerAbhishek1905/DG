import {
  useNavigate,
} from "react-router-dom";

import type {
  DealerPerformanceItem,
} from "../services/dashboardApi";

interface Props {
  data: DealerPerformanceItem[];
}

export default function DealerPerformanceChart({
  data,
}: Props) {
  const navigate =
    useNavigate();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Dealer Performance
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Top dealer completion and SLA
          metrics.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-left">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Dealer",
                "Assigned",
                "Completed",
                "Cancelled",
                "Completion %",
                "SLA %",
              ].map(
                (heading) => (
                  <th
                    key={
                      heading
                    }
                    className="px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.map(
              (dealer) => (
                <tr
                  key={
                    dealer.dealerId
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/dealers/${dealer.dealerId}/performance`
                        )
                      }
                      className="text-sm font-semibold text-[#123B7A] hover:underline"
                    >
                      {
                        dealer.dealerName
                      }
                    </button>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      dealer.assigned
                    }
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      dealer.completed
                    }
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      dealer.cancelled
                    }
                  </td>

                  <td className="px-5 py-4">
                    <Metric
                      value={
                        dealer.completionRate
                      }
                    />
                  </td>

                  <td className="px-5 py-4">
                    <Metric
                      value={
                        dealer.slaCompliance
                      }
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metric({
  value,
}: {
  value: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#123B7A]"
          style={{
            width: `${Math.min(
              value,
              100
            )}%`,
          }}
        />
      </div>

      <span className="text-sm font-medium text-gray-700">
        {value}%
      </span>
    </div>
  );
}