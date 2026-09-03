// import { BarChart3, Edit, Eye } from "lucide-react";

// import { useNavigate } from "react-router-dom";

// import DealerStatusBadge from "./DealerStatusBadge";

// import type { Dealer } from "../types/dealer.types";

// interface Props {
//   dealers: Dealer[];
// }

// export default function DealerTable({ dealers }: Props) {
//   const navigate = useNavigate();

//   if (!dealers.length) {
//     return (
//       <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
//         No dealers found.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="border-b border-gray-200 bg-gray-50">
//             <tr>
//               {[
//                 "Dealer",
//                 "City",
//                 "Capacity",
//                 "Active Complaints",
//                 "Cancellation %",
//                 "SLA",
//                 "Performance",
//                 "Status",
//                 "Actions",
//               ].map((heading) => (
//                 <th
//                   key={heading}
//                   className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
//                 >
//                   {heading}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {dealers.map((dealer) => {
//               const available = dealer.capacity.total - dealer.capacity.used;

//               return (
//                 <tr key={dealer.id} className="hover:bg-gray-50">
//                   <td className="px-5 py-4">
//                     <button
//                       onClick={() => navigate(`/dealers/${dealer.id}`)}
//                       className="font-medium text-[#123B7A] hover:underline"
//                     >
//                       {dealer.name}
//                     </button>

//                     <p className="mt-1 text-xs text-gray-500">
//                       {dealer.dealerCode}
//                     </p>
//                   </td>

//                   <td className="px-5 py-4 text-sm text-gray-600">
//                     {dealer.city}
//                   </td>

//                   <td className="px-5 py-4">
//                     <p className="text-sm font-medium text-gray-900">
//                       {available} available
//                     </p>

//                     <p className="text-xs text-gray-500">
//                       {dealer.capacity.used}/{dealer.capacity.total} used
//                     </p>
//                   </td>

//                   <td className="px-5 py-4 text-sm text-gray-600">
//                     {dealer.capacity.used}
//                   </td>

//                   <td className="px-5 py-4 text-sm text-gray-600">
//                     {dealer.performance.cancellationRate}%
//                   </td>

//                   <td className="px-5 py-4">
//                     <span
//                       className={
//                         dealer.performance.slaCompliance >= 90
//                           ? "font-medium text-green-600"
//                           : "font-medium text-amber-600"
//                       }
//                     >
//                       {dealer.performance.slaCompliance}%
//                     </span>
//                   </td>

//                   <td className="px-5 py-4">
//                     <span className="font-semibold text-gray-900">
//                       {dealer.performance.performanceScore}
//                       /100
//                     </span>
//                   </td>

//                   <td className="px-5 py-4">
//                     <DealerStatusBadge status={dealer.status} />
//                   </td>

//                   <td className="px-5 py-4">
//                     <div className="flex items-center gap-1">
//                       <button
//                         title="View"
//                         onClick={() => navigate(`/dealers/${dealer.id}`)}
//                         className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
//                       >
//                         <Eye size={17} />
//                       </button>

//                       <button
//                         title="Edit"
//                         onClick={() => navigate(`/dealers/${dealer.id}/edit`)}
//                         className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
//                       >
//                         <Edit size={17} />
//                       </button>

//                       <button
//                         title="Performance"
//                         onClick={() =>
//                           navigate(`/dealers/${dealer.id}/performance`)
//                         }
//                         className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
//                       >
//                         <BarChart3 size={17} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



import {
  Edit,
  Eye,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  Dealer,
} from "../types/dealer.types";

interface Props {
  dealers: Dealer[];
}

export default function DealerTable({
  dealers,
}: Props) {
  const navigate =
    useNavigate();

  if (!dealers.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No dealers found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left">

          {/* Header */}

          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Head Code",
                "Dealer / Head Name",
                "Contact",
                "City",
                "Categories",
                "Total Capacity",
                "GST No.",
                "Account Status",
                "Actions",
              ].map(
                (heading) => (
                  <th
                    key={
                      heading
                    }
                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {
                      heading
                    }
                  </th>
                )
              )}
            </tr>
          </thead>

          {/* Body */}

          <tbody className="divide-y divide-gray-100">
            {dealers.map(
              (dealer) => {
                const capacityMaster =
                  dealer.capacityMaster ??
                  [];

                const totalCapacity =
                  capacityMaster.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      Number(
                        item.capacity ||
                          0
                      ),
                    0
                  );

                return (
                  <tr
                    key={
                      dealer.id
                    }
                    className="hover:bg-gray-50"
                  >

                    {/* Head Code */}

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="font-medium text-gray-900">
                        {dealer.headCode ||
                          "-"}
                      </span>
                    </td>

                    {/* Dealer Name */}

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/dealers/${dealer.id}`
                          )
                        }
                        className="font-medium text-[#123B7A] hover:underline"
                      >
                        {dealer.headName ||
                          "-"}
                      </button>

                      {dealer.groupHead && (
                        <p className="mt-1 text-xs text-gray-500">
                          {formatGroupHead(
                            dealer.groupHead
                          )}
                        </p>
                      )}
                    </td>

                    {/* Contact */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">
                        {dealer.contactPerson ||
                          "-"}
                      </p>

                      {dealer.mobileNumber && (
                        <p className="mt-1 text-xs text-gray-500">
                          {
                            dealer.mobileNumber
                          }
                        </p>
                      )}
                    </td>

                    {/* City */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">
                        {dealer.city ||
                          "-"}
                      </p>

                      {dealer.state && (
                        <p className="mt-1 text-xs text-gray-500">
                          {
                            dealer.state
                          }
                        </p>
                      )}
                    </td>

                    {/* Categories */}

                    <td className="px-5 py-4">
                      {capacityMaster.length ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {
                              capacityMaster.length
                            }{" "}
                            {capacityMaster.length ===
                            1
                              ? "Category"
                              : "Categories"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Capacity mapped
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not mapped
                        </span>
                      )}
                    </td>

                    {/* Capacity */}

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {
                          totalCapacity
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Total capacity
                      </p>
                    </td>

                    {/* GST */}

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {dealer.gstNumber ||
                          "-"}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <AccountStatusBadge
                        deactivated={
                          dealer.accountDeactivated
                        }
                      />
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">

                        <button
                          type="button"
                          title="View"
                          onClick={() =>
                            navigate(
                              `/dealers/${dealer.id}`
                            )
                          }
                          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye
                            size={
                              17
                            }
                          />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/dealers/${dealer.id}/edit`
                            )
                          }
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Edit
                            size={
                              17
                            }
                          />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================================
   ACCOUNT STATUS BADGE
======================================== */

function AccountStatusBadge({
  deactivated,
}: {
  deactivated: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        deactivated
          ? "bg-red-50 text-red-700"
          : "bg-green-50 text-green-700"
      }`}
    >
      {deactivated
        ? "Inactive"
        : "Active"}
    </span>
  );
}

/* ========================================
   FORMAT GROUP HEAD
======================================== */

function formatGroupHead(
  value: string
) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}