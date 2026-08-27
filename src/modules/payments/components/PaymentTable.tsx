import {
  Eye,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import PaymentStatusBadge from "./PaymentStatusBadge";

import type {
  Payment,
} from "../types/payment.types";

interface Props {
  payments: Payment[];
}

export default function PaymentTable({
  payments,
}: Props) {
  const navigate =
    useNavigate();

  if (!payments.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">
          No payments found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              {[
                "Payment",
                "Dealer",
                "Amount",
                "Method",
                "Reference",
                "Payment Date",
                "Status",
                "Recorded By",
                "Action",
              ].map(
                (heading) => (
                  <th
                    key={
                      heading
                    }
                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {payments.map(
              (payment) => (
                <tr
                  key={
                    payment.id
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/payments/${payment.id}`
                        )
                      }
                      className="text-sm font-semibold text-[#123B7A] hover:underline"
                    >
                      {
                        payment.paymentNumber
                      }
                    </button>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        payment.id
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {
                        payment.dealer
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        payment.dealer
                          .dealerCode
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-gray-900">
                      ₹
                      {payment.amount.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                      {payment.paymentMethod.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      payment.transactionReference ??
                      payment.bankReference ??
                      payment.chequeNumber ??
                      "-"
                    }
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {new Date(
                      payment.paymentDate
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <PaymentStatusBadge
                      status={
                        payment.status
                      }
                    />
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {
                      payment.recordedBy
                    }
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/payments/${payment.id}`
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
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