import { Edit3, PackageOpen, Trash2 } from "lucide-react";
import type { ProductType } from "../types/productType.types";
import { usePermission } from "../../../hooks/usePermission";
import Pagination from "../../../components/ui/Pagination";

interface Props {
  productTypes: ProductType[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (item: ProductType) => void;
  onDelete: (item: ProductType) => void;
}

export default function ProductTypeTable({
  productTypes,
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
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-500">
        Loading product types...
      </div>
    );
  }

  if (productTypes.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
        <PackageOpen size={32} className="mx-auto mb-3 text-gray-300" />

        <p className="text-sm font-medium text-gray-700">
          No product types found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              {/* <th className="px-5 py-3">Product ID</th> */}
              <th className="px-5 py-3">Product Type</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {productTypes.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">
                  {item.product_name ?? "-"}
                </td>

                {/* <td className="px-5 py-4 text-[#123B7A]">{item.product_id}</td> */}
                <td className="px-5 py-4">{item.product_type}</td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {hasPermission("product_type.update") && (
                      <button
                        type="button"
                        title="Edit Product Type"
                        onClick={() => onEdit(item)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
                      >
                        <Edit3 size={17} />
                      </button>
                    )}

                    {hasPermission("product_type.delete") && (
                      <button
                        type="button"
                        title="Delete Product Type"
                        onClick={() => onDelete(item)}
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
