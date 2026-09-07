// import { Edit, Eye } from "lucide-react";

// import { useNavigate } from "react-router-dom";

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
//         <table className="w-full min-w-[1200px] text-left">
//           {/* Header */}

//           <thead className="border-b border-gray-200 bg-gray-50">
//             <tr>
//               {[
//                 "Head Code",
//                 "Dealer / Head Name",
//                 "Contact",
//                 "City",
//                 "Categories",
//                 "Total Capacity",
//                 "GST No.",
//                 "Account Status",
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

//           {/* Body */}

//           <tbody className="divide-y divide-gray-100">
//             {dealers.map((dealer) => {
//               const capacityMaster = dealer.capacityMaster ?? [];

//               const totalCapacity = capacityMaster.reduce(
//                 (total, item) => total + Number(item.capacity || 0),
//                 0,
//               );

//               return (
//                 <tr key={dealer.id} className="hover:bg-gray-50">
//                   {/* Head Code */}

//                   <td className="whitespace-nowrap px-5 py-4">
//                     <span className="font-medium text-gray-900">
//                       {dealer.headCode || "-"}
//                     </span>
//                   </td>

//                   {/* Dealer Name */}

//                   <td className="px-5 py-4">
//                     <button
//                       type="button"
//                       onClick={() => navigate(`/dealers/${dealer.id}`)}
//                       className="font-medium text-[#123B7A] hover:underline"
//                     >
//                       {dealer.headName || "-"}
//                     </button>

//                     {dealer.groupHead && (
//                       <p className="mt-1 text-xs text-gray-500">
//                         {formatGroupHead(dealer.groupHead)}
//                       </p>
//                     )}
//                   </td>

//                   {/* Contact */}

//                   <td className="px-5 py-4">
//                     <p className="text-sm text-gray-900">
//                       {dealer.contactPerson || "-"}
//                     </p>

//                     {dealer.mobileNumber && (
//                       <p className="mt-1 text-xs text-gray-500">
//                         {dealer.mobileNumber}
//                       </p>
//                     )}
//                   </td>

//                   {/* City */}

//                   <td className="px-5 py-4">
//                     <p className="text-sm text-gray-700">
//                       {dealer.city || "-"}
//                     </p>

//                     {dealer.state && (
//                       <p className="mt-1 text-xs text-gray-500">
//                         {dealer.state}
//                       </p>
//                     )}
//                   </td>

//                   {/* Categories */}

//                   <td className="px-5 py-4">
//                     {capacityMaster.length ? (
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">
//                           {capacityMaster.length}{" "}
//                           {capacityMaster.length === 1
//                             ? "Category"
//                             : "Categories"}
//                         </p>

//                         <p className="mt-1 text-xs text-gray-500">
//                           Capacity mapped
//                         </p>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-400">Not mapped</span>
//                     )}
//                   </td>

//                   {/* Capacity */}

//                   <td className="px-5 py-4">
//                     <p className="text-sm font-semibold text-gray-900">
//                       {totalCapacity}
//                     </p>

//                     <p className="mt-1 text-xs text-gray-500">Total capacity</p>
//                   </td>

//                   {/* GST */}

//                   <td className="whitespace-nowrap px-5 py-4">
//                     <span className="text-sm text-gray-600">
//                       {dealer.gstNumber || "-"}
//                     </span>
//                   </td>

//                   {/* Status */}

//                   <td className="px-5 py-4">
//                     <AccountStatusBadge
//                       deactivated={dealer.accountDeactivated}
//                     />
//                   </td>

//                   {/* Actions */}

//                   <td className="px-5 py-4">
//                     <div className="flex items-center gap-1">
//                       <button
//                         type="button"
//                         title="View"
//                         onClick={() => navigate(`/dealers/${dealer.id}`)}
//                         className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
//                       >
//                         <Eye size={17} />
//                       </button>

//                       <button
//                         type="button"
//                         title="Edit"
//                         onClick={() => navigate(`/dealers/${dealer.id}/edit`)}
//                         className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
//                       >
//                         <Edit size={17} />
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

// /* ========================================
//    ACCOUNT STATUS BADGE
// ======================================== */

// function AccountStatusBadge({ deactivated }: { deactivated: boolean }) {
//   return (
//     <span
//       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//         deactivated ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
//       }`}
//     >
//       {deactivated ? "Inactive" : "Active"}
//     </span>
//   );
// }

// /* ========================================
//    FORMAT GROUP HEAD
// ======================================== */

// function formatGroupHead(value: string) {
//   return value
//     .replace(/_/g, " ")
//     .toLowerCase()
//     .replace(/\b\w/g, (character) => character.toUpperCase());
// }

import { Edit, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { Dealer } from "../types/dealer.types";
import { deleteDealer } from "../services/dealerApi";

interface Props {
  dealers: Dealer[];
  onRefresh?: () => void | Promise<void>;
}

export default function DealerTable({ dealers, onRefresh }: Props) {
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dealer?",
    );

    if (!confirmed) return;

    try {
      await deleteDealer(id);

      toast.success("Dealer deleted successfully");

      await onRefresh?.();
    } catch (error) {
      console.error("Delete dealer error:", error);

      toast.error("Failed to delete dealer");
    }
  };

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
        <table className="w-full min-w-[1250px] text-left">
          {/* HEADER */}

          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Head Code",
                "Dealer / Head Name",
                "Contact",
                "Location",
                "Products",
                "Combined Capacity",
                "Individual Capacity",
                "GST No.",
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

          {/* BODY */}

          <tbody className="divide-y divide-gray-100">
            {dealers.map((dealer) => {
              const combinedProducts = dealer.combinedCapacity?.products ?? [];

              const combinedCapacity = Number(
                dealer.combinedCapacity?.capacity ?? 0,
              );

              const individualCapacities = dealer.individualCapacities ?? [];

              const totalIndividualCapacity = individualCapacities.reduce(
                (total, item) => total + Number(item.capacity || 0),
                0,
              );

              const productServices = dealer.productServices ?? [];

              return (
                <tr key={dealer._id} className="transition hover:bg-gray-50">
                  {/* HEAD CODE */}

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-medium text-gray-900">
                      {dealer.headCode || "-"}
                    </span>
                  </td>

                  {/* DEALER / HEAD */}

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/dealers/${dealer._id}`)}
                      className="font-medium text-[#123B7A] hover:underline"
                    >
                      {dealer.headName || dealer.technicianFirmName || "-"}
                    </button>

                    {dealer.technicianName && (
                      <p className="mt-1 text-xs text-gray-500">
                        {dealer.technicianName}
                      </p>
                    )}

                    {dealer.groupHead && (
                      <p className="mt-1 text-xs text-gray-400">
                        {formatGroupHead(dealer.groupHead)}
                      </p>
                    )}
                  </td>

                  {/* CONTACT */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-900">
                      {dealer.mobileNumber || "-"}
                    </p>

                    {dealer.email && (
                      <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
                        {dealer.email}
                      </p>
                    )}
                  </td>

                  {/* LOCATION */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {dealer.businessAddress?.city || "-"}
                    </p>

                    {dealer.businessAddress?.state && (
                      <p className="mt-1 text-xs text-gray-500">
                        {dealer.businessAddress.state}
                      </p>
                    )}
                  </td>

                  {/* PRODUCTS */}

                  <td className="px-5 py-4">
                    {productServices.length > 0 ? (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {productServices.length}{" "}
                          {productServices.length === 1
                            ? "Product"
                            : "Products"}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
                          {productServices
                            .map((product) => product.productName)
                            .join(", ")}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not mapped</span>
                    )}
                  </td>

                  {/* COMBINED CAPACITY */}

                  <td className="px-5 py-4">
                    {combinedProducts.length > 0 ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {combinedCapacity}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {combinedProducts.length}{" "}
                          {combinedProducts.length === 1
                            ? "product"
                            : "products"}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not mapped</span>
                    )}
                  </td>

                  {/* INDIVIDUAL CAPACITY */}

                  <td className="px-5 py-4">
                    {individualCapacities.length > 0 ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {totalIndividualCapacity}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {individualCapacities.length}{" "}
                          {individualCapacities.length === 1
                            ? "product"
                            : "products"}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not mapped</span>
                    )}
                  </td>

                  {/* GST */}

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {dealer.gstNumber || "-"}
                    </span>
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
                    <DealerStatusBadge
                      status={dealer.technicianStatus ?? "INACTIVE"}
                    />
                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      {/* VIEW */}

                      <button
                        type="button"
                        title="View"
                        onClick={() => navigate(`/dealers/${dealer._id}`)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={17} />
                      </button>

                      {/* EDIT */}

                      <button
                        type="button"
                        title="Edit"
                        onClick={() => navigate(`/dealers/${dealer._id}/edit`)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Edit size={17} />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(dealer._id)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
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

/* ========================================
   DEALER STATUS BADGE
======================================== */

function DealerStatusBadge({ status }: { status: "ACTIVE" | "INACTIVE" }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        status === "ACTIVE"
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {status === "ACTIVE" ? "Active" : "Inactive"}
    </span>
  );
}

/* ========================================
   FORMAT GROUP HEAD
======================================== */

function formatGroupHead(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
