import {
  CircleDollarSign,
  FileCheck2,
  FileClock,
  ReceiptText,
} from "lucide-react";

import type {
  Bill,
} from "../types/billing.types";

interface Props {
  bills: Bill[];
}

export default function BillingStats({
  bills,
}: Props) {
  const approved =
    bills.filter(
      (bill) =>
        bill.status ===
        "APPROVED"
    );

  const pending =
    bills.filter(
      (bill) =>
        bill.status ===
          "GENERATED" ||
        bill.status ===
          "UNDER_REVIEW"
    );

  const totalAmount =
    bills.reduce(
      (sum, bill) =>
        sum +
        bill.totalAmount,
      0
    );

  const approvedAmount =
    approved.reduce(
      (sum, bill) =>
        sum +
        bill.totalAmount,
      0
    );

  const stats = [
    {
      label:
        "Total Bills",

      value:
        bills.length,

      icon:
        ReceiptText,
    },

    {
      label:
        "Pending Review",

      value:
        pending.length,

      icon:
        FileClock,
    },

    {
      label:
        "Approved Bills",

      value:
        approved.length,

      icon:
        FileCheck2,
    },

    {
      label:
        "Approved Amount",

      value: `₹${approvedAmount.toLocaleString(
        "en-IN"
      )}`,

      icon:
        CircleDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(
        (stat) => {
          const Icon =
            stat.icon;

          return (
            <div
              key={
                stat.label
              }
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {
                      stat.label
                    }
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {
                      stat.value
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