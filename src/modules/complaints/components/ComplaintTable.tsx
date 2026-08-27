import { Eye, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ComplaintStatusBadge from "./ComplaintStatusBadge";

import type { Complaint } from "../types/complaint.types";

interface Props {
  complaints: Complaint[];
}

export default function ComplaintTable({
  complaints,
}: Props) {
  const navigate = useNavigate();

  if (complaints.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">
          No complaints found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Complaint
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Customer
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Category
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Priority
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Created
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {complaints.map((complaint) => (
              <tr
                key={complaint.id}
                className="transition hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/complaints/${complaint.id}`
                      )
                    }
                    className="font-medium text-[#123B7A] hover:underline"
                  >
                    {complaint.complaintNumber}
                  </button>

                  <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                    {complaint.subject}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {complaint.customer.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {complaint.customer.phone}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {complaint.category}
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm font-medium">
                    {complaint.priority}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <ComplaintStatusBadge
                    status={complaint.status}
                  />
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {new Date(
                    complaint.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/complaints/${complaint.id}`
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </button>

                    <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                      <MoreVertical size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}