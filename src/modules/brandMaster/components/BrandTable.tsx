import { Edit3, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Brand } from "../types/brand.types";
import { usePermission } from "../../../hooks/usePermission";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  brands: Brand[];
  loading?: boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export default function BrandTable({
  brands,
  loading,
  onEdit,
  onDelete,
}: Props) {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const total = brands.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Reset page whenever brand data changes
  useEffect(() => {
    setPage(1);
  }, [brands]);

  // Fix current page after delete
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Client-side pagination
  const paginatedBrands = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return brands.slice(startIndex, endIndex);
  }, [brands, page, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        Loading brands...
      </div>
    );
  }

  if (!brands.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        No brands found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Brand Name</th>
              <th className="px-5 py-3">Created At</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedBrands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">
                  {brand.brandName}
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {brand.createdAt
                    ? new Date(brand.createdAt).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {hasPermission("brand.update") && (
                      <button
                        type="button"
                        title="Edit Brand"
                        onClick={() => onEdit(brand)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
                      >
                        <Edit3 size={17} />
                      </button>
                    )}

                    {hasPermission("brand.delete") && (
                      <button
                        type="button"
                        title="Delete Brand"
                        onClick={() => onDelete(brand)}
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
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
