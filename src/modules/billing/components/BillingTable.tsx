import {
  Eye,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import BillingStatusBadge from "./BillingStatusBadge";

import type {
  Bill,
} from "../types/billing.types";

interface Props {
  bills: Bill[];
}

export default function BillingTable({
  bills,
}: Props) {
  const navigate =
    useNavigate();

  if (!bills.length) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
        No bills found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              {[
                "Bill",
                "Complaint",
                "Dealer",
                "Closure Type",
                "Subtotal",
                "Tax",
                "Total",
                "Status",
                "Generated",
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
            {bills.map(
              (bill) => (
                <tr
                  key={
                    bill.id
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/billing/${bill.id}`
                        )
                      }
                      className="text-sm font-semibold text-[#123B7A] hover:underline"
                    >
                      {
                        bill.billNumber
                      }
                    </button>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        bill.id
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {
                      bill.complaintNumber
                    }
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {
                        bill.dealer
                          .name
                      }
                    </p>

                    <p className="text-xs text-gray-400">
                      {
                        bill.dealer
                          .dealerCode
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                      {
                        bill.closureType
                      }
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    ₹
                    {bill.subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    ₹
                    {bill.taxAmount.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    ₹
                    {bill.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <BillingStatusBadge
                      status={
                        bill.status
                      }
                    />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {new Date(
                      bill.generatedAt
                    ).toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/billing/${bill.id}`
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye
                        size={17}
                      />
                    </button>
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