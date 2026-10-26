import { Edit3, Power, Trash2 } from "lucide-react";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import type { Reason } from "../types/reason.types";
import { usePermission } from "../../../hooks/usePermission";

interface ReasonTableProps {
  reasons: Reason[];
  loading: boolean;
  page: number;
  limit: number;
  onEdit: (reason: Reason) => void;
  onDelete: (reason: Reason) => void;
  onStatusChange: (reason: Reason, status: boolean) => void;
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
  const { hasPermission } = usePermission();

  if (loading) {
    return (
      <TableSkeleton />
    );
  }

  if (!reasons.length) {
    return (
      <div className="flex min-h-75 items-center justify-center">
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
              <td className="px-5 py-4 text-sm text-gray-600">
                {(page - 1) * limit + index + 1}
              </td>

              <td className="px-5 py-4">
                <p className="text-sm font-medium text-gray-900">
                  {reason.reasonName}
                </p>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    reason.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {reason.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  {hasPermission("reason.update") && (
                    <button
                      type="button"
                      onClick={() => onEdit(reason)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 size={17} />
                    </button>
                  )}

                  {hasPermission("reason.active") && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(reason, !reason.isActive)}
                      className="rounded-lg bg-orange-50 p-2 text-orange-600 transition hover:bg-orange-500 hover:text-white"
                      title={reason.isActive ? "Deactivate" : "Activate"}
                    >
                      <Power size={17} />
                    </button>
                  )}

                  {hasPermission("reason.delete") && (
                    <button
                      type="button"
                      onClick={() => onDelete(reason)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
