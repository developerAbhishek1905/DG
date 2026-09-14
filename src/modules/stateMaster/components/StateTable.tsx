import { Edit3, Trash2 } from "lucide-react";
import type { StateMaster } from "../types/state.types";
import { usePermission } from "../../../hooks/usePermission";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  states: StateMaster[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (state: StateMaster) => void;
  onDelete: (state: StateMaster) => void;
}

export default function StateTable({
  states,
  loading,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}: Props) {
  
  const { hasPermission } = usePermission();
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading states...
      </div>
    );
  }

  if (!states.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No states found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={thClass}>State ID</th>
              <th className={thClass}>State Name</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {states.map((state) => (
              <tr key={state._id} className="transition hover:bg-gray-50">
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {state.state_id}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {state.state_name}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {hasPermission("state.update") && (
                      <button
                        type="button"
                        title="Edit State"
                        onClick={() => onEdit(state)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3 size={17} />
                      </button>
                    )}

                    {hasPermission("state.delete") && (
                      <button
                        type="button"
                        title="Delete State"
                        onClick={() => onDelete(state)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
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

      {/* Pagination */}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}

const thClass =
  "whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500";
