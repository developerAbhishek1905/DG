import { Edit3, Power, Trash2 } from "lucide-react";

import type { Category } from "../types/category.types";

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
              <th className="px-5 py-3">Code</th>

              <th className="px-5 py-3">Description</th>

              <th className="px-5 py-3">Category</th>

              <th className="px-5 py-3">Category Description</th>

              {/* <th className="px-5 py-3">
                Category 4
              </th> */}

              <th className="px-5 py-3">Status</th>

              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {categories.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-[#123B7A]">
                  {item.groupCategoryCode}
                </td>

                <td className="px-5 py-4">{item.description}</td>

                <td className="px-5 py-4">{item.category || "-"}</td>

                <td className="px-5 py-4">{item.categoryDescription || "-"}</td>

                {/* <td className="px-5 py-4">
                    {item.category4 ||
                      "-"}
                  </td> */}

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
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      onClick={() => onToggleStatus(item)}
                      className="rounded-md p-2 text-orange-600 hover:bg-orange-50"
                      title={
                        item.status === "ACTIVE" ? "Deactivate" : "Activate"
                      }
                    >
                      <Power size={17} />
                    </button>

                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-md p-2 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!categories.length && (
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
    </div>
  );
}
