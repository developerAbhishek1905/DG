import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

import type {
  ReconciliationSummaryData,
} from "../types/reconciliation.types";

interface Props {
  summary: ReconciliationSummaryData;
}

export default function ReconciliationSummary({
  summary,
}: Props) {
  const cards = [
    {
      label:
        "Matched",

      value:
        summary.matchedRecords,

      icon:
        CheckCircle2,
    },

    {
      label:
        "Mismatched",

      value:
        summary.mismatchRecords,

      icon:
        AlertTriangle,
    },

    {
      label:
        "Pending",

      value:
        summary.pendingRecords,

      icon:
        Clock3,
    },

    {
      label:
        "Total Difference",

      value: `₹${summary.totalDifference.toLocaleString(
        "en-IN"
      )}`,

      icon:
        IndianRupee,
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