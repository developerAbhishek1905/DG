import { Eye, Ban, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ComplaintStatusBadge from "./ComplaintStatusBadge";
import { deleteComplaint, suspendComplaint } from "../services/complaintApi";
import type { Complaint } from "../types/complaint.types";

interface Props {
  complaints: Complaint[];
  onDelete?: (id: string) => void;
  onReload: () => void;
}

export default function ComplaintTable({
  complaints,
  onDelete,
  onReload,
}: Props) {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      const message = await deleteComplaint(id);
      toast.success(message);
      // Remove complaint from parent table
      onDelete?.(id);
    } catch (error: any) {
      console.error("Delete complaint error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to delete complaint",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSuspend = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to suspend this complaint?",
    );

    if (!confirmed) return;

    try {
      setSuspendingId(id);
      const message = await suspendComplaint(id);
      toast.success(message);
      // Reload complaints from backend
      onReload();
    } catch (error: any) {
      console.error("Suspend complaint error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to suspend complaint",
      );
    } finally {
      setSuspendingId(null);
    }
  };

  if (complaints.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">No complaints found.</p>
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
                Address
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Product
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Category
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                Delaer
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
              <tr key={complaint.id} className="transition hover:bg-gray-50">
                {/* Complaint */}
                <td className="px-5 py-4">
                  <button
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                    className="font-medium text-[#123B7A] hover:underline"
                  >
                    {complaint.complaintNumber}
                  </button>

                  <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                    {complaint.subject}
                  </p>
                </td>

                {/* Customer */}
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {complaint.customerName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {complaint.phone}

                    {complaint.alternatePhone &&
                      ` / ${complaint.alternatePhone}`}
                  </p>
                </td>

                {/* Address */}
                <td className="px-5 py-4 text-sm text-gray-600">
                  {complaint.address?.addressLine}, {complaint.address?.city},{" "}
                  {complaint.address?.pinCode}
                </td>
                {/* Category */}
                <td className="px-5 py-4 text-sm text-gray-600">
                  {complaint.productName}
                </td>

                {/* Category */}
                <td className="px-5 py-4 text-sm text-gray-600">
                  {complaint.category}
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {complaint?.allocatedDealerId?.technicianFirmName || complaint?.allocatedDealerId?.technicianFirmName || '-'}
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <ComplaintStatusBadge status={complaint.status} />
                </td>

                {/* Created */}
                <td className="px-5 py-4 text-sm text-gray-600">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {/* View */}
                    <button
                      type="button"
                      title="View complaint"
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </button>

                    {/* Delete */}
                    {/* <button
                      type="button"
                      title="Delete complaint"
                      disabled={deletingId === complaint.id}
                      onClick={() => handleDelete(complaint.id)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === complaint.id ? (
                        <span className="block h-[17px] w-[17px] animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button> */}

                    <button
                      type="button"
                      title="Suspend complaint"
                      disabled={
                        suspendingId === complaint.id ||
                        complaint.status === "SUSPENDED"
                      }
                      onClick={() => handleSuspend(complaint.id)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {suspendingId === complaint.id ? (
                        <span className="block h-4.5 w-4.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                      ) : (
                        <Ban size={17} />
                      )}
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
