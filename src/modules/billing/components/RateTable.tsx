import {
  Edit,
} from "lucide-react";

import type {
  RateMaster,
} from "../types/billing.types";

interface Props {
  rates: RateMaster[];

  onEdit?: (
    rate: RateMaster
  ) => void;
}

export default function RateTable({
  rates,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              {[
                "Code",
                "Service",
                "Type",
                "Product",
                "City",
                "Rate",
                "Tax",
                "Effective",
                "Status",
                "Action",
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

          <tbody className="divide-y">
            {rates.map(
              (rate) => (
                <tr
                  key={
                    rate.id
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4 text-sm font-semibold">
                    {
                      rate.code
                    }
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      rate.serviceName
                    }
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      rate.closureType
                    }
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      rate.productCategory ??
                      "-"
                    }
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      rate.city ??
                      "All"
                    }
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    ₹
                    {
                      rate.baseRate
                    }
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      rate.taxPercentage
                    }
                    %
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      rate.effectiveFrom
                    }
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        rate.active
                          ? "rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs text-green-700"
                          : "rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                      }
                    >
                      {rate.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {onEdit && (
                      <button
                        onClick={() =>
                          onEdit(
                            rate
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <Edit
                          size={17}
                        />
                      </button>
                    )}
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