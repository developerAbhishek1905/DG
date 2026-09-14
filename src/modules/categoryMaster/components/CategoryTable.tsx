import { Edit3, Power, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Category } from "../types/category.types";
import { usePermission } from "../../../hooks/usePermission";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  categories: Category[];
  loading?: boolean;
  onEdit: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onToggleStatus,
  onDelete,
}: Props) {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const total = categories.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Reset page whenever categories change
  useEffect(() => {
    setPage(1);
  }, [categories]);

  // Fix page after delete
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Paginated categories
  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return categories.slice(startIndex, endIndex);
  }, [categories, page, limit]);

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
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Category Description</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedCategories.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-[#123B7A]">
                  {item.product_name || "-"}
                </td>

                <td className="px-5 py-4">{item.category || "-"}</td>
                <td className="px-5 py-4">{item.description || "-"}</td>
                <td className="px-5 py-4">{item.categoryDescription || "-"}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      item.status === "ACTIVE"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {hasPermission("category.update") && (
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit3 size={17} />
                      </button>
                    )}

                    {hasPermission("category.update") && (
                      <button
                        type="button"
                        onClick={() => onToggleStatus(item)}
                        className="rounded-md p-2 text-orange-600 hover:bg-orange-50"
                        title={
                          item.status === "ACTIVE" ? "Deactivate" : "Activate"
                        }
                      >
                        <Power size={17} />
                      </button>
                    )}

                    {hasPermission("category.delete") && (
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!paginatedCategories.length && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
}
