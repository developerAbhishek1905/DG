import { Edit3, Trash2 } from "lucide-react";
import type { PincodeMaster } from "../types/pincode.types";
import { usePermission } from "../../../hooks/usePermission";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  pincodes: PincodeMaster[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (pincode: PincodeMaster) => void;
  onDelete: (pincode: PincodeMaster) => void;
}

export default function PincodeTable({
  pincodes,
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
        Loading pincodes...
      </div>
    );
  }

  if (!pincodes.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No pincodes found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={thClass}>Pincode ID</th>
              <th className={thClass}>Pincode</th>
              <th className={thClass}>City</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pincodes.map((pincode) => (
              <tr key={pincode._id} className="hover:bg-gray-50">
                <td className={tdClass}>{pincode.pincode_id ?? "-"}</td>

                <td className={`${tdClass} font-medium text-gray-900`}>
                  {pincode.pincode_name}
                </td>

                <td className={tdClass}>
                  {pincode.city_name ?? pincode.city_id ?? "-"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {hasPermission("pincode.update") && (
                      <button
                        type="button"
                        title="Edit Pincode"
                        onClick={() => onEdit(pincode)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3 size={17} />
                      </button>
                    )}

                    {hasPermission("pincode.delete") && (
                      <button
                        type="button"
                        title="Delete Pincode"
                        onClick={() => onDelete(pincode)}
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

const tdClass = "whitespace-nowrap px-5 py-4 text-sm text-gray-700";
