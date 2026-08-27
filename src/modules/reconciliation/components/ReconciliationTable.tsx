import {
  Eye,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  Reconciliation,
  ReconciliationStatus,
} from "../types/reconciliation.types";

interface Props {
  reconciliations: Reconciliation[];
}

export default function ReconciliationTable({
  reconciliations,
}: Props) {
  const navigate =
    useNavigate();

  if (
    !reconciliations.length
  ) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">
          No reconciliation records found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Reconciliation",
                "Dealer",
                "Period",
                "Bills",
                "Payments",
                "Expected",
                "Actual",
                "Difference",
                "Status",
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
            {reconciliations.map(
              (item) => (
                <tr
                  key={
                    item.id
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/reconciliation/${item.id}`
                        )
                      }
                      className="text-sm font-semibold text-[#123B7A] hover:underline"
                    >
                      {
                        item.reconciliationNumber
                      }
                    </button>

                    <p className="mt-1 text-xs text-gray-400">
                      {item.id}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {
                        item.dealer
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {
                        item.dealer
                          .dealerCode
                      }
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {formatDate(
                      item.periodFrom
                    )}

                    {" - "}

                    {formatDate(
                      item.periodTo
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium">
                    ₹
                    {item.totalBillAmount.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium">
                    ₹
                    {item.totalPayments.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium">
                    ₹
                    {item.expectedClosingBalance.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium">
                    ₹
                    {item.actualClosingBalance.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`text-sm font-bold ${
                        item.difference ===
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹
                      {Math.abs(
                        item.difference
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={
                        item.status
                      }
                    />
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/reconciliation/${item.id}`
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

function StatusBadge({
  status,
}: {
  status: ReconciliationStatus;
}) {
  const styles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",

    MATCHED:
      "border-green-200 bg-green-50 text-green-700",

    MISMATCH:
      "border-red-200 bg-red-50 text-red-700",

    RECONCILED:
      "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(
  date: string
) {
  return new Date(
    date
  ).toLocaleDateString(
    "en-IN"
  );
}