import { Edit3, Trash2 } from "lucide-react";
import type { DistrictMaster } from "../types/district.types";
import { usePermission } from "../../../hooks/usePermission";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  districts: DistrictMaster[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (district: DistrictMaster) => void;
  onDelete: (district: DistrictMaster) => void;
}

export default function DistrictTable({
  districts,
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
        Loading districts...
      </div>
    );
  }

  if (!districts.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No districts found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={thClass}>District ID</th>
              <th className={thClass}>District Name</th>
              <th className={thClass}>State</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {districts.map((district) => (
              <tr key={district._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm">{district.district_id}</td>

                <td className="px-5 py-4 text-sm font-medium">
                  {district.district_name}
                </td>

                <td className="px-5 py-4 text-sm">
                  {district.state_name || "-"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {hasPermission("district.update") && (
                      <button
                        type="button"
                        title="Edit District"
                        onClick={() => onEdit(district)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3 size={17} />
                      </button>
                    )}

                    {hasPermission("district.delete") && (
                      <button
                        type="button"
                        title="Delete District"
                        onClick={() => onDelete(district)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
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
