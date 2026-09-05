// import { Edit3, PackageOpen, Trash2 } from "lucide-react";

// import type { ProductType } from "../types/productType.types";

// interface Props {
//   productTypes: ProductType[];

//   loading?: boolean;

//   onEdit: (item: ProductType) => void;

//   onDelete: (item: ProductType) => void;
// }

// export default function ProductTypeTable({
//   productTypes,
//   loading,
//   onEdit,
//   onDelete,
// }: Props) {
//   if (loading) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-500">
//         Loading product types...
//       </div>
//     );
//   }

//   if (productTypes.length === 0) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
//         <PackageOpen size={32} className="mx-auto mb-3 text-gray-300" />

//         <p className="text-sm font-medium text-gray-700">
//           No product types found
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-sm">
//           <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
//             <tr>
//               <th className="px-5 py-3">Product</th>

//               <th className="px-5 py-3">Product ID</th>

//               <th className="px-5 py-3">Product Code</th>

//               <th className="px-5 py-3">Product Type</th>

//               <th className="px-5 py-3 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {productTypes.map((item) => (
//               <tr key={item._id} className="hover:bg-gray-50">
//                 <td className="px-5 py-4 font-medium text-gray-900">
//                   {item.product_name ?? "-"}
//                 </td>

//                 <td className="px-5 py-4 text-[#123B7A]">{item.product_id}</td>

//                 <td className="px-5 py-4">{item.product_code}</td>

//                 <td className="px-5 py-4">{item.product_type}</td>

//                 <td className="px-5 py-4">
//                   <div className="flex justify-end gap-1">
//                     <button
//                       type="button"
//                       title="Edit"
//                       onClick={() => onEdit(item)}
//                       className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
//                     >
//                       <Edit3 size={17} />
//                     </button>

//                     <button
//                       type="button"
//                       title="Delete"
//                       onClick={() => onDelete(item)}
//                       className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
//                     >
//                       <Trash2 size={17} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  PackageOpen,
  Trash2,
} from "lucide-react";

import type { ProductType } from "../types/productType.types";

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

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Product</th>

              <th className="px-5 py-3">Product ID</th>

              <th className="px-5 py-3">Product Code</th>

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

                <td className="px-5 py-4 text-[#123B7A]">{item.product_id}</td>

                <td className="px-5 py-4">{item.product_code}</td>

                <td className="px-5 py-4">{item.product_type}</td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Edit Product Type"
                      onClick={() => onEdit(item)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      type="button"
                      title="Delete Product Type"
                      onClick={() => onDelete(item)}
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

      {/* PAGINATION */}

      <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{start}</span> -{" "}
            <span className="font-medium text-gray-700">{end}</span> of{" "}
            <span className="font-medium text-gray-700">{total}</span>
          </p>

          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value={10}>10 / page</option>

            <option value={20}>20 / page</option>

            <option value={50}>50 / page</option>

            <option value={100}>100 / page</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="min-w-[100px] text-center text-sm text-gray-600">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
