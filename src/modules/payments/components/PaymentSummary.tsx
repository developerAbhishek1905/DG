import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

import type {
  PaymentSummaryData,
} from "../types/payment.types";

interface Props {
  summary: PaymentSummaryData;
}

export default function PaymentSummary({
  summary,
}: Props) {
  const cards = [
    {
      label:
        "Total Paid",

      value: `₹${summary.totalPaidAmount.toLocaleString(
        "en-IN"
      )}`,

      icon:
        IndianRupee,
    },

    {
      label:
        "Successful",

      value:
        summary.successfulPayments,

      icon:
        CheckCircle2,
    },

    {
      label:
        "Pending Amount",

      value: `₹${summary.pendingAmount.toLocaleString(
        "en-IN"
      )}`,

      icon:
        Clock3,
    },

    {
      label:
        "Failed Payments",

      value:
        summary.failedPayments,

      icon:
        AlertCircle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(
        (card) => {
          const Icon =
            card.icon;

          return (
            <div
              key={
                card.label
              }
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {
                      card.label
                    }
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {
                      card.value
                    }
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                  <Icon
                    size={21}
                  />
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}