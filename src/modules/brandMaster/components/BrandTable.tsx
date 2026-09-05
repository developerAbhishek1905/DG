// import { Edit3, Trash2 } from "lucide-react";

// import type { Brand } from "../types/brand.types";

// interface Props {
//   brands: Brand[];

//   loading?: boolean;

//   onEdit: (brand: Brand) => void;

//   onDelete: (brand: Brand) => void;
// }

// export default function BrandTable({
//   brands,
//   loading,
//   onEdit,
//   onDelete,
// }: Props) {
//   if (loading) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
//         Loading brands...
//       </div>
//     );
//   }

//   if (!brands.length) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
//         No brands found.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <table className="w-full text-left text-sm">
//         <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
//           <tr>
//             <th className="px-5 py-3">Brand Name</th>

//             <th className="px-5 py-3">Created At</th>

//             <th className="px-5 py-3 text-right">Actions</th>
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-gray-100">
//           {brands.map((brand) => (
//             <tr key={brand.id} className="hover:bg-gray-50">
//               <td className="px-5 py-4 font-medium text-gray-900">
//                 {brand.brandName}
//               </td>

//               <td className="px-5 py-4 text-gray-500">
//                 {new Date(brand.createdAt).toLocaleDateString("en-IN")}
//               </td>

//               <td className="px-5 py-4">
//                 <div className="flex justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={() => onEdit(brand)}
//                     className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
//                   >
//                     <Edit3 size={17} />
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => onDelete(brand)}
//                     className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
//                   >
//                     <Trash2 size={17} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Brand } from "../types/brand.types";

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
  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const total = brands.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );

  useEffect(() => {
    setPage(1);
  }, [brands, limit]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedBrands = useMemo(() => {
    const startIndex =
      (page - 1) * limit;

    const endIndex =
      startIndex + limit;

    return brands.slice(
      startIndex,
      endIndex
    );
  }, [brands, page, limit]);

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

  const start =
    total === 0
      ? 0
      : (page - 1) * limit + 1;

  const end =
    Math.min(
      page * limit,
      total
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">
                Brand Name
              </th>

              <th className="px-5 py-3">
                Created At
              </th>

              <th className="px-5 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedBrands.map(
              (brand) => (
                <tr
                  key={brand.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {brand.brandName}
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {new Date(
                      brand.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title="Edit Brand"
                        onClick={() =>
                          onEdit(brand)
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
                      >
                        <Edit3
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        title="Delete Brand"
                        onClick={() =>
                          onDelete(brand)
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2
                          size={17}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {start}
            </span>{" "}
            -{" "}
            <span className="font-medium text-gray-700">
              {end}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
              {total}
            </span>
          </p>

          <select
            value={limit}
            onChange={(event) => {
              setLimit(
                Number(
                  event.target.value
                )
              );

              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value={5}>
              5 / page
            </option>

            <option value={10}>
              10 / page
            </option>

            <option value={20}>
              20 / page
            </option>

            <option value={50}>
              50 / page
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage(
                (current) =>
                  current - 1
              )
            }
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft
              size={17}
            />
          </button>

          <span className="min-w-[100px] text-center text-sm text-gray-600">
            Page{" "}
            <span className="font-semibold text-gray-800">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {totalPages}
            </span>
          </span>

          <button
            type="button"
            disabled={
              page >= totalPages
            }
            onClick={() =>
              setPage(
                (current) =>
                  current + 1
              )
            }
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight
              size={17}
            />
          </button>
        </div>
      </div>
    </div>
  );
}