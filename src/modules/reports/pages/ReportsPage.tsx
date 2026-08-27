import {
  AlertTriangle,
  Clock3,
  CreditCard,
  FileBarChart,
  ReceiptText,
  Store,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

const reports = [
  {
    title:
      "Complaint Report",

    description:
      "Complaint volume, status, closure and operational analysis.",

    path:
      "/reports/complaints",

    icon:
      FileBarChart,
  },

  {
    title:
      "Dealer Performance",

    description:
      "Dealer workload, completion rate and service performance.",

    path:
      "/reports/dealers",

    icon:
      Store,
  },

  {
    title:
      "SLA Report",

    description:
      "SLA compliance, warnings and breached complaints.",

    path:
      "/reports/sla",

    icon:
      Clock3,
  },

  {
    title:
      "Cancellation Report",

    description:
      "Cancellation requests, reasons and approval analysis.",

    path:
      "/reports/cancellations",

    icon:
      AlertTriangle,
  },

  {
    title:
      "Billing Report",

    description:
      "Dealer billing, approved amounts and pending bills.",

    path:
      "/reports/billing",

    icon:
      ReceiptText,
  },

  {
    title:
      "Payment Report",

    description:
      "Dealer settlements, payment status and transaction analysis.",

    path:
      "/reports/payments",

    icon:
      CreditCard,
  },
];

export default function ReportsPage() {
  const navigate =
    useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#123B7A]">
          Analytics
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Reports
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Analyze operational,
          dealer and financial
          performance.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reports.map(
          (report) => {
            const Icon =
              report.icon;

            return (
              <button
                key={
                  report.path
                }
                type="button"
                onClick={() =>
                  navigate(
                    report.path
                  )
                }
                className="group rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                  <Icon
                    size={21}
                  />
                </div>

                <h2 className="mt-5 text-base font-semibold text-gray-900 group-hover:text-[#123B7A]">
                  {
                    report.title
                  }
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {
                    report.description
                  }
                </p>

                <p className="mt-5 text-sm font-medium text-[#123B7A]">
                  View Report →
                </p>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}