import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  PackageSearch,
  Trash2,
} from "lucide-react";

import type { Product } from "../types/product.types";

interface Props {
  products: Product[];

  loading?: boolean;

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  onPageChange: (page: number) => void;

  onLimitChange: (limit: number) => void;

  onEdit: (product: Product) => void;

  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
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
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-500">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
        <PackageSearch size={32} className="mx-auto mb-3 text-gray-300" />

        <p className="text-sm font-medium text-gray-700">No products found</p>
      </div>
    );
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Product ID</th>

              <th className="px-5 py-3">Product Name</th>

              <th className="px-5 py-3">Status</th>

              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-[#123B7A]">
                  {product.product_id}
                </td>

                <td className="px-5 py-4 font-medium text-gray-900">
                  {product.product_name}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.status === "ACTIVE"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Edit Product"
                      onClick={() => onEdit(product)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      type="button"
                      title="Delete Product"
                      onClick={() => onDelete(product)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            Showing {start} - {end} of {total}
          </p>

          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value={10}>10</option>

            <option value={20}>20</option>

            <option value={50}>50</option>

            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-gray-2000 p-2 disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-gray-200 p-2 disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
