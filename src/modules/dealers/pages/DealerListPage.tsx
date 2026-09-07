// import { Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// import DealerFilters from "../components/DealerFilters";
// import DealerStats from "../components/DealerStats";
// import DealerTable from "../components/DealerTable";

// import { useDealers } from "../hooks/useDealers";

// export default function DealerListPage() {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("ALL");
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);

//   const { dealers, loading, pagination, refetch } = useDealers({
//     page,
//     limit,
//     search,
//     status: status === "ALL" ? "" : status,
//   });

//   const handleSearchChange = (value: string) => {
//     setSearch(value);
//     setPage(1);
//   };

//   const handleStatusChange = (value: string) => {
//     setStatus(value);
//     setPage(1);
//   };

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}

//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Dealers</h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Manage dealer capacity, availability and performance.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => navigate("/dealers/create")}
//           className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854]"
//         >
//           <Plus size={18} />
//           Add Dealer
//         </button>
//       </div>

//       {/* STATS */}

//       <DealerStats dealers={dealers} />

//       {/* FILTERS */}

//       <DealerFilters
//         search={search}
//         status={status}
//         onSearchChange={handleSearchChange}
//         onStatusChange={handleStatusChange}
//       />

//       {/* TABLE */}

//       {loading ? (
//         <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
//           Loading dealers...
//         </div>
//       ) : dealers.length === 0 ? (
//         <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
//           <p className="text-sm font-medium text-gray-700">No dealers found</p>

//           <p className="mt-1 text-xs text-gray-500">
//             Try changing your search or filter.
//           </p>
//         </div>
//       ) : (
//         <>
//           <DealerTable dealers={dealers} onRefresh={refetch} />

//           {/* PAGINATION */}

//           {pagination.totalPages > 1 && (
//             <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//               <div className="text-sm text-gray-500">
//                 Showing{" "}
//                 <span className="font-medium text-gray-700">
//                   {(pagination.page - 1) * pagination.limit + 1}
//                 </span>{" "}
//                 to{" "}
//                 <span className="font-medium text-gray-700">
//                   {Math.min(
//                     pagination.page * pagination.limit,
//                     pagination.total,
//                   )}
//                 </span>{" "}
//                 of{" "}
//                 <span className="font-medium text-gray-700">
//                   {pagination.total}
//                 </span>{" "}
//                 dealers
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   disabled={page <= 1}
//                   onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                   className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Previous
//                 </button>

//                 <div className="flex items-center gap-1">
//                   {Array.from(
//                     {
//                       length: pagination.totalPages,
//                     },
//                     (_, index) => index + 1,
//                   )
//                     .filter((pageNumber) => {
//                       return (
//                         pageNumber === 1 ||
//                         pageNumber === pagination.totalPages ||
//                         Math.abs(pageNumber - page) <= 1
//                       );
//                     })
//                     .map((pageNumber, index, pages) => {
//                       const previousPage = pages[index - 1];

//                       return (
//                         <div
//                           key={pageNumber}
//                           className="flex items-center gap-1"
//                         >
//                           {previousPage && pageNumber - previousPage > 1 && (
//                             <span className="px-1 text-gray-400">...</span>
//                           )}

//                           <button
//                             type="button"
//                             onClick={() => setPage(pageNumber)}
//                             className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium ${
//                               page === pageNumber
//                                 ? "bg-[#123B7A] text-white"
//                                 : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//                             }`}
//                           >
//                             {pageNumber}
//                           </button>
//                         </div>
//                       );
//                     })}
//                 </div>

//                 <button
//                   type="button"
//                   disabled={page >= pagination.totalPages}
//                   onClick={() =>
//                     setPage((prev) => Math.min(prev + 1, pagination.totalPages))
//                   }
//                   className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import DealerFilters from "../components/DealerFilters";
import DealerStats from "../components/DealerStats";
import DealerTable from "../components/DealerTable";

import { useDealers } from "../hooks/useDealers";
import { useDebounce } from "../../../hooks/useDebounce";

export default function DealerListPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { dealers, loading, pagination, refetch } = useDealers({
    page,
    limit,
    search: debouncedSearch,
    status: status === "ALL" ? "" : status,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dealers</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage dealer capacity, availability and performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dealers/create")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854]"
        >
          <Plus size={18} />
          Add Dealer
        </button>
      </div>

      {/* STATS */}

      <DealerStats dealers={dealers} />

      {/* FILTERS */}

      <DealerFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      {/* CONTENT */}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          Loading dealers...
        </div>
      ) : dealers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm font-medium text-gray-700">No dealers found</p>

          <p className="mt-1 text-xs text-gray-500">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <>
          <DealerTable dealers={dealers} onRefresh={refetch} />

          {/* PAGINATION */}

          {pagination.totalPages > 1 && (
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-700">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {pagination.total}
                </span>{" "}
                dealers
              </div>

              <div className="flex items-center gap-2">
                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {/* PAGE NUMBERS */}

                <div className="flex items-center gap-1">
                  {Array.from(
                    {
                      length: pagination.totalPages,
                    },
                    (_, index) => index + 1,
                  )
                    .filter(
                      (pageNumber) =>
                        pageNumber === 1 ||
                        pageNumber === pagination.totalPages ||
                        Math.abs(pageNumber - page) <= 1,
                    )
                    .map((pageNumber, index, pages) => {
                      const previousPage = pages[index - 1];

                      return (
                        <div
                          key={pageNumber}
                          className="flex items-center gap-1"
                        >
                          {previousPage && pageNumber - previousPage > 1 && (
                            <span className="px-1 text-gray-400">...</span>
                          )}

                          <button
                            type="button"
                            onClick={() => setPage(pageNumber)}
                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                              page === pageNumber
                                ? "bg-[#123B7A] text-white"
                                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        </div>
                      );
                    })}
                </div>

                {/* NEXT */}

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
