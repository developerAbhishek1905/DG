import { Edit3, MapPin, Power } from "lucide-react";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import type { Area } from "../types/area.types";
import AreaStatusBadge from "./AreaStatusBadge";
import { usePermission } from "../../../hooks/usePermission";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  areas: Area[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (area: Area) => void;
  onToggleStatus: (area: Area) => void;
}

export default function AreaTable({
  areas,
  loading,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  onEdit,
  onToggleStatus,
}: Props) {
  const { hasPermission } = usePermission();

  if (loading) {
    return (
      <TableSkeleton />
    );
  }

  if (areas.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
        <MapPin size={32} className="mx-auto mb-3 text-gray-300" />

        <p className="text-sm font-medium text-gray-700">No areas found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-262.5 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Area Code</th>
              <th className="px-5 py-3">Area Name</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3">District</th>
              <th className="px-5 py-3">State</th>
              <th className="px-5 py-3">Pincode</th>
              <th className="px-5 py-3">Zone</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {areas.map((area) => (
              <tr key={area._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-[#6D28D9]">
                  {area.areaCode}
                </td>

                <td className="px-5 py-4 font-medium text-gray-900">
                  {area.areaName}
                </td>

                <td className="px-5 py-4">
                  {area.city_name ?? area.city_id ?? "-"}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {area.district_name ?? area.district_id ?? "-"}
                </td>

                <td className="px-5 py-4">
                  {area.state_name ?? area.state_id ?? "-"}
                </td>

                <td className="px-5 py-4">
                  {area.pincode_name ?? area.pincode_id ?? "-"}
                </td>

                <td className="px-5 py-4">{area.zone ?? "-"}</td>

                <td className="px-5 py-4">
                  <AreaStatusBadge status={area.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {hasPermission("area.update") && (
                      <button
                        type="button"
                        title="Edit Area"
                        onClick={() => onEdit(area)}
                        className="rounded-lg p-2 transition bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Edit3 size={17} />
                      </button>
                    )}

                    {hasPermission("area.update") && (
                      <button
                        type="button"
                        title={
                          area.status === "ACTIVE" ? "Deactivate" : "Activate"
                        }
                        onClick={() => onToggleStatus(area)}
                        className={`rounded-lg p-2 ${
                          area.status === "ACTIVE"
                            ? "text-green-600 hover:bg-green-50"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        <Power size={17} />
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
