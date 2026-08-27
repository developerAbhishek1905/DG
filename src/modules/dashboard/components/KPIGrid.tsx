import {
  AlertTriangle,
  BadgeCheck,
  Clock3,
  IndianRupee,
  ReceiptText,
  Tickets,
} from "lucide-react";

import type {
  DashboardKPI,
} from "../services/dashboardApi";

interface Props {
  kpis: DashboardKPI;
}

export default function KPIGrid({
  kpis,
}: Props) {
  const cards = [
    {
      label:
        "Total Complaints",

      value:
        kpis.totalComplaints,

      icon:
        Tickets,

      helper:
        `${kpis.openComplaints} currently open`,
    },

    {
      label:
        "Pending Complaints",

      value:
        kpis.pendingComplaints,

      icon:
        Clock3,

      helper:
        "Waiting for action",
    },

    {
      label:
        "SLA Breached",

      value:
        kpis.slaBreached,

      icon:
        AlertTriangle,

      helper:
        "Needs immediate attention",
    },

    {
      label:
        "Verified Closures",

      value:
        kpis.verifiedClosures,

      icon:
        BadgeCheck,

      helper:
        "Completed & verified",
    },

    {
      label:
        "Outstanding",

      value: `₹${kpis.outstandingAmount.toLocaleString(
        "en-IN"
      )}`,

      icon:
        IndianRupee,

      helper:
        "Dealer payable",
    },

    {
      label:
        "Today's Payments",

      value:
        kpis.paymentsToday,

      icon:
        ReceiptText,

      helper: `₹${kpis.paymentAmountToday.toLocaleString(
        "en-IN"
      )} paid today`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
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
              <div className="flex items-start justify-between gap-3">
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

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
                  <Icon
                    size={19}
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                {
                  card.helper
                }
              </p>
            </div>
          );
        }
      )}
    </div>
  );
}