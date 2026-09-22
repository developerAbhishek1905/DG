import { Eye, Ban, MoreVertical, Copy, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ComplaintStatusBadge from "./ComplaintStatusBadge";
import { deleteComplaint, suspendComplaint } from "../services/complaintApi";
import type { Complaint } from "../types/complaint.types";

interface Props {
  complaints: Complaint[];
  // onDelete?: (id: string) => void;
  onReload: () => void;
}

export default function ComplaintTable({
  complaints,
  // onDelete,
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

  const handleCopyMobile = async (mobile: string) => {
    if (!mobile) return;

    try {
      await navigator.clipboard.writeText(mobile);

      toast.success("Mobile number copied");
    } catch (error) {
      console.error("Copy failed:", error);

      toast.error("Failed to copy mobile number");
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
    // <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    //   <div className="overflow-x-auto">
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="w-full overflow-x-auto lg:overflow-x-hidden">
        <table
          className="        w-full
        min-w-[1200px]
        text-left
        lg:min-w-0
        lg:table-fixed"
        >
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="w-[11%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
                COMP ID
              </th>

              <th className="w-[13%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
                Customer
              </th>

              <th className="w-[7%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
                City
              </th>

              {/* <th className="w-[10%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
        Product
      </th> */}

              <th className="w-[11%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
                Service
              </th>

              <th className="w-[4%] px-1 py-2.5 text-center text-[10px] font-semibold uppercase text-gray-500">
                Unit
              </th>

              <th className="w-[9%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
                Type
              </th>

              <th className="w-[11%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
                Dealer
              </th>

              <th className="w-[10%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
                Status
              </th>

              <th className="w-[7%] px-2 py-2.5 text-[10px] font-semibold uppercase text-gray-500">
                Created
              </th>

              <th className="w-[7%] px-1 py-2.5 text-right text-[10px] font-semibold uppercase text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="transition hover:bg-gray-50">
                {/* Complaint */}
                <td className="px-2 py-3">
                  <button
                    type="button"
                    title={complaint.complaintNumber}
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                    className="block max-w-full truncate text-xs font-semibold text-[#123B7A] hover:underline"
                  >
                    {complaint.complaintNumber}
                  </button>

                  {complaint.subject && (
                    <p
                      title={complaint.subject}
                      className="mt-0.5 truncate text-[10px] text-gray-400"
                    >
                      {complaint.subject}
                    </p>
                  )}
                </td>

                {/* Customer */}
                <td className="px-2 py-3">
                  <p
                    title={complaint.customerName}
                    className="truncate text-xs font-medium text-gray-900"
                  >
                    {complaint.customerName}
                  </p>

                  {complaint.phone && (
                    <div className="mt-0.5 flex min-w-0 items-center gap-1">
                      <span
                        title={complaint.phone}
                        className="truncate text-[10px] text-gray-500"
                      >
                        {complaint.phone}
                      </span>

                      <button
                        type="button"
                        title="Copy mobile"
                        onClick={() => handleCopyMobile(complaint.phone)}
                        className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-blue-50 hover:text-[#123B7A]"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                  )}

                  {complaint.alternatePhone && (
                    <div className="mt-0.5 flex min-w-0 items-center gap-1">
                      <span
                        title={complaint.alternatePhone}
                        className="truncate text-[10px] text-gray-400"
                      >
                        {complaint.alternatePhone}
                      </span>

                      <button
                        type="button"
                        title="Copy alternate mobile"
                        onClick={() =>
                          handleCopyMobile(complaint.alternatePhone!)
                        }
                        className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-blue-50 hover:text-[#123B7A]"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                  )}
                </td>

                {/* City */}
                <td className="px-2 py-3">
                  <p
                    title={complaint.address?.city || ""}
                    className="truncate text-xs text-gray-600"
                  >
                    {complaint.address?.city || "-"}
                  </p>
                </td>

                {/* Product */}
                {/* <td className="px-2 py-3">
          <p
            title={complaint.productName || ""}
            className="truncate text-xs text-gray-600"
          >
            {complaint.productName || "-"}
          </p>
        </td> */}

                {/* Product Service */}
                <td className="px-2 py-3">
                  <p
                    title={complaint.categoryId?.description || ""}
                    className="truncate text-xs text-gray-600"
                  >
                    {complaint.category}
                  </p>
                  <p
                    title={complaint.categoryId?.description || ""}
                    className="truncate text-xs text-gray-600"
                  >
                    {complaint.categoryId?.description || "-"}
                  </p>
                </td>

                {/* Units */}
                <td className="px-1 py-3 text-center text-xs text-gray-600">
                  {complaint.units ?? "-"}
                </td>

                {/* Complaint Type */}
                <td className="px-2 py-3">
                  <p
                    title={complaint.complaintType || ""}
                    className="truncate text-[11px] text-gray-600"
                  >
                    {complaint.complaintType?.replaceAll("_", " ") || "-"}
                  </p>
                </td>

                {/* Dealer */}
                <td className="px-2 py-3">
                  <p
                    title={
                      complaint.allocatedDealerId?.technicianFirmName || ""
                    }
                    className="truncate text-xs text-gray-600"
                  >
                    {complaint.allocatedDealerId?.technicianFirmName || "-"}
                  </p>

                  {complaint.allocatedDealerId?.technicianName && (
                    <p
                      title={complaint.allocatedDealerId.technicianName}
                      className="mt-0.5 truncate text-[10px] text-gray-400"
                    >
                      {complaint.allocatedDealerId.technicianName}
                    </p>
                  )}
                </td>

                {/* Status */}
                <td className="px-2 py-3">
                  <ComplaintStatusBadge status={complaint.status} />
                </td>

                {/* Created */}
                <td className="px-2 py-3 text-[11px] text-gray-600">
                  {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                {/* Actions */}
                <td className="px-1 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {/* View */}
                    <button
                      type="button"
                      title="View complaint"
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                      className="
        flex h-7 w-7 items-center justify-center
        rounded-md
        bg-blue-50 text-blue-600
        transition
        hover:bg-blue-100 hover:text-blue-700
      "
                    >
                      <Eye size={14} strokeWidth={2} />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      title="Edit complaint"
                      onClick={() =>
                        navigate(`/complaints/${complaint.id}/edit`)
                      }
                      className="
        flex h-7 w-7 items-center justify-center
        rounded-md
        bg-amber-50 text-amber-600
        transition
        hover:bg-amber-100 hover:text-amber-700
      "
                    >
                      <Pencil size={14} strokeWidth={2} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      title="Delete complaint"
                      disabled={deletingId === complaint.id}
                      onClick={() => handleDelete(complaint.id)}
                      className="
        flex h-7 w-7 items-center justify-center
        rounded-md
        bg-red-50 text-red-600
        transition
        hover:bg-red-100 hover:text-red-700
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
                    >
                      {deletingId === complaint.id ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                      ) : (
                        <Trash2 size={14} strokeWidth={2} />
                      )}
                    </button>

                    {/* Suspend */}
                    <button
                      type="button"
                      title={
                        complaint.status === "SUSPENDED"
                          ? "Already suspended"
                          : "Suspend complaint"
                      }
                      disabled={
                        suspendingId === complaint.id ||
                        complaint.status === "SUSPENDED"
                      }
                      onClick={() => handleSuspend(complaint.id)}
                      className="
        flex h-7 w-7 items-center justify-center
        rounded-md
        bg-orange-50 text-orange-600
        transition
        hover:bg-orange-100 hover:text-orange-700
        disabled:cursor-not-allowed
        disabled:bg-gray-50
        disabled:text-gray-300
        disabled:opacity-60
      "
                    >
                      {suspendingId === complaint.id ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
                      ) : (
                        <Ban size={14} strokeWidth={2} />
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
