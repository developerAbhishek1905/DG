import { Edit3, Trash2 } from "lucide-react";
import type { CityMaster } from "../types/city.types";
import { usePermission } from "../../../hooks/usePermission";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  cities: CityMaster[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (city: CityMaster) => void;
  onDelete: (city: CityMaster) => void;
}

export default function CityTable({
  cities,
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
        Loading cities...
      </div>
    );
  }

  if (!cities.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No cities found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={thClass}>City ID</th>
              <th className={thClass}>City Name</th>
              <th className={thClass}>District</th>
              <th className={thClass}>State</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {cities.map((city) => (
              <tr key={city._id} className="transition hover:bg-gray-50">
                <td className={tdClass}>{city.city_id}</td>

                <td className={`${tdClass} font-medium text-gray-900`}>
                  {city.city_name}
                </td>

                <td className={tdClass}>
                  {city.district_name ?? city.district_id ?? "-"}
                </td>

                <td className={tdClass}>
                  {city.state_name ?? city.state_id ?? "-"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {hasPermission("city.update") && (
                      <button
                        type="button"
                        title="Edit City"
                        onClick={() => onEdit(city)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3 size={17} />
                      </button>
                    )}

                    {hasPermission("city.delete") && (
                      <button
                        type="button"
                        title="Delete City"
                        onClick={() => onDelete(city)}
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
