// import { Edit3, Power, Trash2 } from "lucide-react";

// import type { Category } from "../types/category.types";

// interface Props {
//   categories: Category[];

//   loading?: boolean;

//   onEdit: (category: Category) => void;

//   onToggleStatus: (category: Category) => void;

//   onDelete: (category: Category) => void;
// }

// export default function CategoryTable({
//   categories,
//   loading,
//   onEdit,
//   onToggleStatus,
//   onDelete,
// }: Props) {
//   if (loading) {
//     return (
//       <div className="rounded-xl border bg-white p-10 text-center">
//         Loading categories...
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-200 text-left text-sm">
//           <thead className="bg-gray-50 text-xs uppercase text-gray-500">
//             <tr>
//               <th className="px-5 py-3">product</th>

//               <th className="px-5 py-3">Category</th>

//               <th className="px-5 py-3">Category Description</th>

//               <th className="px-5 py-3">Description</th>

//               {/* <th className="px-5 py-3">
//                 Category 4
//               </th> */}

//               <th className="px-5 py-3">Status</th>

//               <th className="px-5 py-3 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {categories.map((item) => (
//               <tr key={item.id} className="hover:bg-gray-50">
//                 {/* <td className="px-5 py-4 font-medium text-[#123B7A]">
//                   {item.groupCategoryCode}
//                 </td> */}
//                  <td className="px-5 py-4 font-medium text-[#123B7A]">
//                   {item?.product_name || "-"}
//                 </td>

//                 <td className="px-5 py-4">{item.description}</td>

//                 <td className="px-5 py-4">{item.category || "-"}</td>

//                 <td className="px-5 py-4">{item.categoryDescription || "-"}</td>

//                 {/* <td className="px-5 py-4">
//                     {item.category4 ||
//                       "-"}
//                   </td> */}

//                 <td className="px-5 py-4">
//                   <span
//                     className={`rounded-full px-2.5 py-1 text-xs ${
//                       item.status === "ACTIVE"
//                         ? "bg-green-50 text-green-700"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>

//                 <td className="px-5 py-4">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => onEdit(item)}
//                       className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
//                       title="Edit"
//                     >
//                       <Edit3 size={17} />
//                     </button>

//                     <button
//                       onClick={() => onToggleStatus(item)}
//                       className="rounded-md p-2 text-orange-600 hover:bg-orange-50"
//                       title={
//                         item.status === "ACTIVE" ? "Deactivate" : "Activate"
//                       }
//                     >
//                       <Power size={17} />
//                     </button>

//                     <button
//                       onClick={() => onDelete(item)}
//                       className="rounded-md p-2 text-red-600 hover:bg-red-50"
//                       title="Delete"
//                     >
//                       <Trash2 size={17} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {!categories.length && (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="px-5 py-10 text-center text-gray-500"
//                 >
//                   No categories found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { ChevronLeft, ChevronRight, Edit3, Power, Trash2 } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

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
  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const total = categories.length;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  /* =========================
     RESET PAGE
  ========================== */

  useEffect(() => {
    setPage(1);
  }, [categories, limit]);

  /* =========================
     FIX PAGE AFTER DELETE
  ========================== */

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* =========================
     PAGINATED DATA
  ========================== */

  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * limit;

    const endIndex = startIndex + limit;

    return categories.slice(startIndex, endIndex);
  }, [categories, page, limit]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading categories...
      </div>
    );
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Product</th>

              <th className="px-5 py-3">Category</th>

              <th className="px-5 py-3">Category Description</th>

              <th className="px-5 py-3">Description</th>

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

                <td className="px-5 py-4">{item.description || "-"}</td>

                <td className="px-5 py-4">{item.category || "-"}</td>

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
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit3 size={17} />
                    </button>

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

                    <button
                      type="button"
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

      {/* PAGINATION */}

      {total > 0 && (
        <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT */}

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{start}</span>{" "}
              - <span className="font-medium text-gray-700">{end}</span> of{" "}
              <span className="font-medium text-gray-700">{total}</span>
            </p>

            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));

                setPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500"
            >
              <option value={5}>5 / page</option>

              <option value={10}>10 / page</option>

              <option value={20}>20 / page</option>

              <option value={50}>50 / page</option>
            </select>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="min-w-[110px] text-center text-sm text-gray-600">
              Page <span className="font-semibold text-gray-800">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">{totalPages}</span>
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
