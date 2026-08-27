import {
  ArrowRight,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  RecentComplaint,
} from "../services/dashboardApi";

interface Props {
  complaints: RecentComplaint[];
}

export default function RecentComplaints({
  complaints,
}: Props) {
  const navigate =
    useNavigate();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Complaints
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest complaint activity.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/complaints"
            )
          }
          className="inline-flex items-center gap-1 text-sm font-medium text-[#123B7A]"
        >
          View All

          <ArrowRight
            size={15}
          />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Complaint",
                "Customer",
                "Product",
                "Dealer",
                "Priority",
                "Status",
                "Created",
              ].map(
                (heading) => (
                  <th
                    key={
                      heading
                    }
                    className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {complaints.map(
              (complaint) => (
                <tr
                  key={
                    complaint.id
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/complaints/${complaint.id}`
                        )
                      }
                      className="text-sm font-semibold text-[#123B7A] hover:underline"
                    >
                      {
                        complaint.complaintNumber
                      }
                    </button>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {
                      complaint.customerName
                    }
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      complaint.productName
                    }
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      complaint.dealerName ??
                      "Unassigned"
                    }
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge
                      priority={
                        complaint.priority
                      }
                    />
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {complaint.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {new Date(
                      complaint.createdAt
                    ).toLocaleString(
                      "en-IN"
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

function PriorityBadge({
  priority,
}: {
  priority:
    RecentComplaint["priority"];
}) {
  const styles = {
    LOW:
      "border-gray-200 bg-gray-50 text-gray-600",

    MEDIUM:
      "border-blue-200 bg-blue-50 text-blue-700",

    HIGH:
      "border-amber-200 bg-amber-50 text-amber-700",

    CRITICAL:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}