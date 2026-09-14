import { BellRing, Eye, MoreHorizontal } from "lucide-react";

import { useNavigate } from "react-router-dom";

import PendingReasonBadge from "./PendingReasonBadge";
import SLACountdown from "./SLACountdown";
import SLAStatusBadge from "./SLAStatusBadge";

import type { PendingComplaint } from "../types/pending.types";

interface Props {
  complaints: PendingComplaint[];

  onReminder?: (id: string) => void;

  onAction?: (complaint: PendingComplaint) => void;
}

export default function PendingTable({
  complaints,
  onReminder,
  onAction,
}: Props) {
  const navigate = useNavigate();

  if (!complaints.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No pending complaints found.
      </div>
    );
  }

  console.log(complaints);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Complaint",
                "Customer",
                "Dealer",
                "Product",
                "Pending Reason",
                "Appointment",
                "Status",
                "Updated At",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {complaints.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {/* Complaint */}

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/complaints/${item._id}`)}
                    className="font-medium text-[#123B7A] hover:underline"
                  >
                    {item.complaintNumber}
                  </button>

                  <p className="mt-1 text-xs text-gray-400">{item._id}</p>
                </td>

                {/* Customer */}

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {item.customerName || item.customerId?.name || "-"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.phone || item.customerId?.phone || "-"}
                  </p>
                </td>

                {/* Dealer */}

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-700">
                    {item.allocatedDealerId?.technicianFirmName || "-"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.allocatedDealerId?.technicianName || ""}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {item.allocatedDealerId?.mobileNumber || ""}
                  </p>
                </td>

                {/* Product */}

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-700">
                    {item.productName || "-"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.productType || ""}
                  </p>
                </td>

                {/* Pending Reason */}

                <td className="px-5 py-4">
                  {item.pendingReason ? (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      {item.pendingReason}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                {/* Appointment */}

                <td className="whitespace-nowrap px-5 py-4">
                  {item.appointmentDate ? (
                    <>
                      <p className="text-sm text-gray-700">
                        {new Date(item.appointmentDate).toLocaleDateString()}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.appointmentTime || "-"}
                      </p>
                    </>
                  ) : (
                    "-"
                  )}
                </td>

                {/* Status */}

                <td className="px-5 py-4">
                  <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                    {item.status?.replaceAll("_", " ").toUpperCase()}
                  </span>
                </td>

                {/* Updated */}

                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                  {new Date(item.updatedAt).toLocaleString()}
                </td>

                {/* Actions */}

                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/complaints/${item._id}`)}
                      title="View Complaint"
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </button>

                    {onAction && (
                      <button
                        type="button"
                        onClick={() => onAction(item)}
                        title="DG Action"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    )}
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
