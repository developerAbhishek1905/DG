import { Pencil, Trash2 } from "lucide-react";

import type { Reason } from "../types/reason.types";

interface ReasonTableProps {
  reasons: Reason[];

  loading: boolean;

  page: number;

  limit: number;

  onEdit: (reason: Reason) => void;

  onDelete: (reason: Reason) => void;

  onStatusChange: (
    reason: Reason,
    status: boolean,
  ) => void;
}

export default function ReasonTable({
  reasons,
  loading,
  page,
  limit,
  onEdit,
  onDelete,
  onStatusChange,

}: ReasonTableProps) {
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading reasons...</p>
      </div>
    );
  }

  if (!reasons.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-gray-700">No reasons found</p>

          <p className="mt-1 text-sm text-gray-500">
            Add a reason to this category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="w-20 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              S.No
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Reason Name
            </th>

            <th className="w-40 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </th>

            <th className="w-40 px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {reasons.map((reason, index) => (
            <tr
              key={reason._id}
              className="border-b border-gray-200 transition last:border-b-0 hover:bg-gray-50"
            >
              <td className="px-5 py-4 text-sm text-gray-600">{(page - 1) * limit + index + 1}</td>

              <td className="px-5 py-4">
                <p className="text-sm font-medium text-gray-900">
                  {reason.reasonName}
                </p>
              </td>

              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => onStatusChange(reason, !reason.isActive)}
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    reason.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {reason.isActive ? "Active" : "Inactive"}
                </button>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(reason)}
                    title="Edit Reason"
                    className="rounded-lg border border-gray-200 p-2 text-[#123B7A] transition hover:bg-blue-50"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(reason)}
                    title="Delete Reason"
                    className="rounded-lg border border-gray-200 p-2 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
