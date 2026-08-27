// import { useNavigate } from "react-router-dom";

// import type { Dealer } from "../types/dealer.types";

// import DealerStatusBadge from "./DealerStatusBadge";

// interface Props {
//   dealers: Dealer[];

//   loading?: boolean;

//   onDelete: (id: string) => void;
// }

// export default function DealerTable({
//   dealers,
//   loading,
//   onDelete,
// }: Props) {
//   const navigate = useNavigate();

//   if (loading) {
//     return (
//       <div className="rounded-xl border bg-white p-8 text-center">
//         Loading dealers...
//       </div>
//     );
//   }

//   if (!dealers?.length) {
//     return (
//       <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
//         No dealers found.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left">
//                 Dealer
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Code
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Contact
//               </th>

//               <th className="px-4 py-3 text-left">
//                 City
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Capacity
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Status
//               </th>

//               <th className="px-4 py-3 text-right">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {dealers.map((dealer) => (
//               <tr
//                 key={dealer._id}
//                 className="hover:bg-gray-50"
//               >
//                 <td className="px-4 py-4">
//                   <div className="font-medium">
//                     {dealer.name}
//                   </div>

//                   <div className="text-xs text-gray-500">
//                     {dealer.email}
//                   </div>
//                 </td>

//                 <td className="px-4 py-4">
//                   {dealer.dealerCode}
//                 </td>

//                 <td className="px-4 py-4">
//                   {dealer.phone}
//                 </td>

//                 <td className="px-4 py-4">
//                   {dealer.address.city}
//                 </td>

//                 <td className="px-4 py-4">
//                   {dealer.capacity.usedCapacity}/
//                   {dealer.capacity.totalCapacity}
//                 </td>

//                 <td className="px-4 py-4">
//                   <DealerStatusBadge
//                     status={dealer.status}
//                   />
//                 </td>

//                 <td className="px-4 py-4 text-right">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() =>
//                         navigate(
//                           `/dealers/${dealer._id}`
//                         )
//                       }
//                       className="rounded-lg border px-3 py-1"
//                     >
//                       View
//                     </button>

//                     <button
//                       onClick={() =>
//                         navigate(
//                           `/dealers/${dealer._id}/edit`
//                         )
//                       }
//                       className="rounded-lg border px-3 py-1"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => {
//                         if (
//                           confirm(
//                             "Are you sure you want to delete this dealer?"
//                           )
//                         ) {
//                           onDelete(dealer._id);
//                         }
//                       }}
//                       className="rounded-lg border px-3 py-1 text-red-600"
//                     >
//                       Delete
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
  BarChart3,
  Edit,
  Eye,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DealerStatusBadge from "./DealerStatusBadge";

import type {
  Dealer,
} from "../types/dealer.types";

interface Props {
  dealers: Dealer[];
}

export default function DealerTable({
  dealers,
}: Props) {
  const navigate = useNavigate();

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
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Dealer",
                "City",
                "Capacity",
                "Active Complaints",
                "Cancellation %",
                "SLA",
                "Performance",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {dealers.map((dealer) => {
              const available =
                dealer.capacity.total -
                dealer.capacity.used;

              return (
                <tr
                  key={dealer.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/dealers/${dealer.id}`
                        )
                      }
                      className="font-medium text-[#123B7A] hover:underline"
                    >
                      {dealer.name}
                    </button>

                    <p className="mt-1 text-xs text-gray-500">
                      {dealer.dealerCode}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {dealer.city}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {available} available
                    </p>

                    <p className="text-xs text-gray-500">
                      {dealer.capacity.used}/
                      {dealer.capacity.total} used
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {dealer.capacity.used}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      dealer.performance
                        .cancellationRate
                    }
                    %
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        dealer.performance
                          .slaCompliance >= 90
                          ? "font-medium text-green-600"
                          : "font-medium text-amber-600"
                      }
                    >
                      {
                        dealer.performance
                          .slaCompliance
                      }
                      %
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-900">
                      {
                        dealer.performance
                          .performanceScore
                      }
                      /100
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <DealerStatusBadge
                      status={dealer.status}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        title="View"
                        onClick={() =>
                          navigate(
                            `/dealers/${dealer.id}`
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Edit"
                        onClick={() =>
                          navigate(
                            `/dealers/${dealer.id}/edit`
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        title="Performance"
                        onClick={() =>
                          navigate(
                            `/dealers/${dealer.id}/performance`
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <BarChart3
                          size={17}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}