// import { Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

// import { useEffect, useMemo, useState } from "react";

// import type { StateMaster } from "../types/state.types";

// interface Props {
//   states: StateMaster[];

//   loading?: boolean;

//   onEdit: (state: StateMaster) => void;

//   onDelete: (state: StateMaster) => void;
// }

// export default function StateTable({
//   states,
//   loading,
//   onEdit,
//   onDelete,
// }: Props) {
//   const [currentPage, setCurrentPage] = useState(1);

//   const [rowsPerPage, setRowsPerPage] = useState(2);

//   /* ==============================
//      PAGINATION
//   ============================== */

//   const totalPages = Math.max(1, Math.ceil(states.length / rowsPerPage));

//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [currentPage, totalPages]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [states.length, rowsPerPage]);

//   const paginatedStates = useMemo(() => {
//     const startIndex = (currentPage - 1) * rowsPerPage;

//     const endIndex = startIndex + rowsPerPage;

//     return states.slice(startIndex, endIndex);
//   }, [states, currentPage, rowsPerPage]);

//   const startRecord =
//     states.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

//   const endRecord = Math.min(currentPage * rowsPerPage, states.length);

//   /* ==============================
//      LOADING
//   ============================== */

//   if (loading) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
//         Loading states...
//       </div>
//     );
//   }

//   /* ==============================
//      EMPTY
//   ============================== */

//   if (!states.length) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
//         No states found.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       {/* ==============================
//           TABLE
//       ============================== */}

//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="border-b border-gray-200 bg-gray-50">
//             <tr>
//               <th className={thClass}>State ID</th>

//               <th className={thClass}>State Name</th>

//               <th className={`${thClass} text-right`}>Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {paginatedStates.map((state) => (
//               <tr key={state._id} className="transition hover:bg-gray-50">
//                 {/* State ID */}

//                 <td className="whitespace-nowrap px-5 py-4">
//                   <span className="text-sm font-medium text-gray-900">
//                     {state.state_id}
//                   </span>
//                 </td>

//                 {/* State Name */}

//                 <td className="px-5 py-4">
//                   <span className="text-sm font-medium text-gray-900">
//                     {state.state_name}
//                   </span>
//                 </td>

//                 {/* Actions */}

//                 <td className="px-5 py-4">
//                   <div className="flex items-center justify-end gap-1">
//                     {/* Edit */}

//                     <button
//                       type="button"
//                       title="Edit State"
//                       onClick={() => onEdit(state)}
//                       className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
//                     >
//                       <Edit3 size={17} />
//                     </button>

//                     {/* Delete */}

//                     <button
//                       type="button"
//                       title="Delete State"
//                       onClick={() => onDelete(state)}
//                       className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
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

//       {/* ==============================
//           PAGINATION
//       ============================== */}

//       <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//         {/* Left */}

//         <div className="flex flex-wrap items-center gap-4">
//           <p className="text-sm text-gray-500">
//             Showing{" "}
//             <span className="font-medium text-gray-700">{startRecord}</span>
//             {" - "}
//             <span className="font-medium text-gray-700">{endRecord}</span>
//             {" of "}
//             <span className="font-medium text-gray-700">{states.length}</span>
//           </p>

//           {/* Rows Per Page */}

//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-500">Rows</span>

//             <select
//               value={rowsPerPage}
//               onChange={(event) => {
//                 setRowsPerPage(Number(event.target.value));

//                 setCurrentPage(1);
//               }}
//               className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             >
//               <option value={5}>5</option>

//               <option value={10}>10</option>

//               <option value={20}>20</option>

//               <option value={50}>50</option>
//             </select>
//           </div>
//         </div>

//         {/* Right */}

//         <div className="flex items-center gap-1">
//           {/* Previous */}

//           <button
//             type="button"
//             title="Previous Page"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
//             className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             <ChevronLeft size={17} />
//           </button>

//           {/* Page Numbers */}

//           {getPageNumbers(currentPage, totalPages).map((page, index) =>
//             page === "..." ? (
//               <span
//                 key={`ellipsis-${index}`}
//                 className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
//               >
//                 ...
//               </span>
//             ) : (
//               <button
//                 key={page}
//                 type="button"
//                 onClick={() => setCurrentPage(page)}
//                 className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
//                   currentPage === page
//                     ? "bg-[#123B7A] text-white"
//                     : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 {page}
//               </button>
//             ),
//           )}

//           {/* Next */}

//           <button
//             type="button"
//             title="Next Page"
//             disabled={currentPage === totalPages}
//             onClick={() =>
//               setCurrentPage((page) => Math.min(page + 1, totalPages))
//             }
//             className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             <ChevronRight size={17} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ========================================
//    PAGINATION NUMBERS
// ======================================== */

// function getPageNumbers(
//   currentPage: number,
//   totalPages: number,
// ): Array<number | "..."> {
//   if (totalPages <= 5) {
//     return Array.from(
//       {
//         length: totalPages,
//       },
//       (_, index) => index + 1,
//     );
//   }

//   if (currentPage <= 3) {
//     return [1, 2, 3, 4, "...", totalPages];
//   }

//   if (currentPage >= totalPages - 2) {
//     return [
//       1,
//       "...",
//       totalPages - 3,
//       totalPages - 2,
//       totalPages - 1,
//       totalPages,
//     ];
//   }

//   return [
//     1,
//     "...",
//     currentPage - 1,
//     currentPage,
//     currentPage + 1,
//     "...",
//     totalPages,
//   ];
// }

// const thClass =
//   "whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500";


import {
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { StateMaster } from "../types/state.types";

interface Props {
  states: StateMaster[];

  loading?: boolean;

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  onPageChange: (
    page: number
  ) => void;

  onLimitChange: (
    limit: number
  ) => void;

  onEdit: (
    state: StateMaster
  ) => void;

  onDelete: (
    state: StateMaster
  ) => void;
}

export default function StateTable({
  states,
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
  const startRecord =
    total === 0
      ? 0
      : (page - 1) * limit + 1;

  const endRecord =
    Math.min(
      page * limit,
      total
    );

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading states...
      </div>
    );
  }

  if (!states.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No states found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={thClass}>
                State ID
              </th>

              <th className={thClass}>
                State Name
              </th>

              <th
                className={`${thClass} text-right`}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {states.map(
              (state) => (
                <tr
                  key={state._id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {state.state_id}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {state.state_name}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Edit State"
                        onClick={() =>
                          onEdit(
                            state
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3
                          size={
                            17
                          }
                        />
                      </button>

                      <button
                        type="button"
                        title="Delete State"
                        onClick={() =>
                          onDelete(
                            state
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2
                          size={
                            17
                          }
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

      {/* Pagination */}

      <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}

        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {
                startRecord
              }
            </span>

            {" - "}

            <span className="font-medium text-gray-700">
              {
                endRecord
              }
            </span>

            {" of "}

            <span className="font-medium text-gray-700">
              {total}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Rows
            </span>

            <select
              value={
                limit
              }
              onChange={(
                event
              ) => {
                onLimitChange(
                  Number(
                    event
                      .target
                      .value
                  )
                );
              }}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option
                value={
                  5
                }
              >
                5
              </option>

              <option
                value={
                  10
                }
              >
                10
              </option>

              <option
                value={
                  20
                }
              >
                20
              </option>

              <option
                value={
                  50
                }
              >
                50
              </option>
            </select>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Previous Page"
            disabled={
              page ===
                1 ||
              totalPages <=
                1
            }
            onClick={() =>
              onPageChange(
                Math.max(
                  page - 1,
                  1
                )
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft
              size={
                17
              }
            />
          </button>

          {getPageNumbers(
            page,
            totalPages
          ).map(
            (
              pageNumber,
              index
            ) =>
              pageNumber ===
              "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={
                    pageNumber
                  }
                  type="button"
                  onClick={() =>
                    onPageChange(
                      pageNumber
                    )
                  }
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                    page ===
                    pageNumber
                      ? "bg-[#123B7A] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {
                    pageNumber
                  }
                </button>
              )
          )}

          <button
            type="button"
            title="Next Page"
            disabled={
              page ===
                totalPages ||
              totalPages <=
                1
            }
            onClick={() =>
              onPageChange(
                Math.min(
                  page + 1,
                  totalPages
                )
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight
              size={
                17
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): Array<
  number | "..."
> {
  if (
    totalPages <= 5
  ) {
    return Array.from(
      {
        length:
          totalPages,
      },
      (_, index) =>
        index + 1
    );
  }

  if (
    currentPage <= 3
  ) {
    return [
      1,
      2,
      3,
      4,
      "...",
      totalPages,
    ];
  }

  if (
    currentPage >=
    totalPages - 2
  ) {
    return [
      1,
      "...",
      totalPages -
        3,
      totalPages -
        2,
      totalPages -
        1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage -
      1,
    currentPage,
    currentPage +
      1,
    "...",
    totalPages,
  ];
}

const thClass =
  "whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500";