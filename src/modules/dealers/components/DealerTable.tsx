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

//-----------------------------------------------------------------------------------------------------------

// import { Edit, Eye, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import type { Dealer } from "../types/dealer.types";
// import { deleteDealer } from "../services/dealerApi";

// interface Props {
//   dealers: Dealer[];
//   onRefresh?: () => void | Promise<void>;
// }

// export default function DealerTable({ dealers, onRefresh }: Props) {
//   const navigate = useNavigate();

//   const handleDelete = async (id: string) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this dealer?",
//     );

//     if (!confirmed) return;

//     try {
//       await deleteDealer(id);

//       toast.success("Dealer deleted successfully");

//       await onRefresh?.();
//     } catch (error) {
//       console.error("Delete dealer error:", error);

//       toast.error("Failed to delete dealer");
//     }
//   };

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
//         <table className="w-full min-w-[1250px] text-left">
//           {/* HEADER */}

//           <thead className="border-b border-gray-200 bg-gray-50">
//             <tr>
//               {[
//                 "Head Code",
//                 "Dealer / Head Name",
//                 "Contact",
//                 "Location",
//                 "Products",
//                 "Combined Capacity",
//                 "Individual Capacity",
//                 "GST No.",
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

//           {/* BODY */}

//           <tbody className="divide-y divide-gray-100">
//             {dealers.map((dealer) => {
//               const combinedProducts = dealer.combinedCapacity?.products ?? [];

//               const combinedCapacity = Number(
//                 dealer.combinedCapacity?.capacity ?? 0,
//               );

//               const individualCapacities = dealer.individualCapacities ?? [];

//               const totalIndividualCapacity = individualCapacities.reduce(
//                 (total, item) => total + Number(item.capacity || 0),
//                 0,
//               );

//               const productServices = dealer.productServices ?? [];

//               return (
//                 <tr key={dealer._id} className="transition hover:bg-gray-50">
//                   {/* HEAD CODE */}

//                   <td className="whitespace-nowrap px-5 py-4">
//                     <span className="font-medium text-gray-900">
//                       {dealer.headCode || "-"}
//                     </span>
//                   </td>

//                   {/* DEALER / HEAD */}

//                   <td className="px-5 py-4">
//                     <button
//                       type="button"
//                       onClick={() => navigate(`/dealers/${dealer._id}`)}
//                       className="font-medium text-[#123B7A] hover:underline"
//                     >
//                       {dealer.headName || dealer.technicianFirmName || "-"}
//                     </button>

//                     {dealer.technicianName && (
//                       <p className="mt-1 text-xs text-gray-500">
//                         {dealer.technicianName}
//                       </p>
//                     )}

//                     {dealer.groupHead && (
//                       <p className="mt-1 text-xs text-gray-400">
//                         {formatGroupHead(dealer.groupHead)}
//                       </p>
//                     )}
//                   </td>

//                   {/* CONTACT */}

//                   <td className="px-5 py-4">
//                     <p className="text-sm text-gray-900">
//                       {dealer.mobileNumber || "-"}
//                     </p>

//                     {dealer.email && (
//                       <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
//                         {dealer.email}
//                       </p>
//                     )}
//                   </td>

//                   {/* LOCATION */}

//                   <td className="px-5 py-4">
//                     <p className="text-sm text-gray-700">
//                       {dealer.businessAddress?.city || "-"}
//                     </p>

//                     {dealer.businessAddress?.state && (
//                       <p className="mt-1 text-xs text-gray-500">
//                         {dealer.businessAddress.state}
//                       </p>
//                     )}
//                   </td>

//                   {/* PRODUCTS */}

//                   <td className="px-5 py-4">
//                     {productServices.length > 0 ? (
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">
//                           {productServices.length}{" "}
//                           {productServices.length === 1
//                             ? "Product"
//                             : "Products"}
//                         </p>

//                         <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
//                           {productServices
//                             .map((product) => product.productName)
//                             .join(", ")}
//                         </p>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-400">Not mapped</span>
//                     )}
//                   </td>

//                   {/* COMBINED CAPACITY */}

//                   <td className="px-5 py-4">
//                     {combinedProducts.length > 0 ? (
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">
//                           {combinedCapacity}
//                         </p>

//                         <p className="mt-1 text-xs text-gray-500">
//                           {combinedProducts.length}{" "}
//                           {combinedProducts.length === 1
//                             ? "product"
//                             : "products"}
//                         </p>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-400">Not mapped</span>
//                     )}
//                   </td>

//                   {/* INDIVIDUAL CAPACITY */}

//                   <td className="px-5 py-4">
//                     {individualCapacities.length > 0 ? (
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">
//                           {totalIndividualCapacity}
//                         </p>

//                         <p className="mt-1 text-xs text-gray-500">
//                           {individualCapacities.length}{" "}
//                           {individualCapacities.length === 1
//                             ? "product"
//                             : "products"}
//                         </p>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-400">Not mapped</span>
//                     )}
//                   </td>

//                   {/* GST */}

//                   <td className="whitespace-nowrap px-5 py-4">
//                     <span className="text-sm text-gray-600">
//                       {dealer.gstNumber || "-"}
//                     </span>
//                   </td>

//                   {/* STATUS */}

//                   <td className="px-5 py-4">
//                     <DealerStatusBadge
//                       status={dealer.technicianStatus ?? "INACTIVE"}
//                     />
//                   </td>

//                   {/* ACTIONS */}

//                   <td className="px-5 py-4">
//                     <div className="flex items-center gap-1">
//                       {/* VIEW */}

//                       <button
//                         type="button"
//                         title="View"
//                         onClick={() => navigate(`/dealers/${dealer._id}`)}
//                         className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
//                       >
//                         <Eye size={17} />
//                       </button>

//                       {/* EDIT */}

//                       <button
//                         type="button"
//                         title="Edit"
//                         onClick={() => navigate(`/dealers/${dealer._id}/edit`)}
//                         className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
//                       >
//                         <Edit size={17} />
//                       </button>

//                       {/* DELETE */}

//                       <button
//                         type="button"
//                         title="Delete"
//                         onClick={() => handleDelete(dealer._id)}
//                         className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
//                       >
//                         <Trash2 size={17} />
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
//    DEALER STATUS BADGE
// ======================================== */

// function DealerStatusBadge({ status }: { status: "ACTIVE" | "INACTIVE" }) {
//   return (
//     <span
//       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//         status === "ACTIVE"
//           ? "bg-green-50 text-green-700"
//           : "bg-red-50 text-red-700"
//       }`}
//     >
//       {status === "ACTIVE" ? "Active" : "Inactive"}
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

import {
  CheckCircle2,
  Edit,
  Eye,
  FileText,
  MapPin,
  Phone,
  Trash2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { Dealer } from "../types/dealer.types";
import { deleteDealer } from "../services/dealerApi";
import Pagination from "../../../components/ui/Pagination";
import { usePermission } from "../../../hooks/usePermission";

interface Props {
  dealers: Dealer[];
  onRefresh?: () => void | Promise<void>;

  page: number;
  limit: number;
  total: number;
  totalPages: number;

  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function DealerTable({
  dealers,
  onRefresh,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: Props) {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

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

  console.log(dealers[0]?.effectiveStatus)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* =========================================
          DESKTOP TABLE
      ========================================= */}

      <div className="hidden md:block">
        <table className="w-full table-fixed text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="w-[9%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Head Code
              </th>

              <th className="w-[18%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Firm Name
              </th>

              <th className="w-[11%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Mobile
              </th>

              <th className="w-[11%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Alt. Mobile
              </th>

              <th className="w-[10%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                City
              </th>

              <th className="w-[13%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Capacity
              </th>

              <th className="w-[11%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Documents
              </th>

              <th className="w-[9%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Status
              </th>

              <th className="w-[8%] px-3 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {dealers.map((dealer) => {
              const capacity = getCapacity(dealer);
              const documents = getDocumentStatus(dealer);

              return (
                <tr
                  key={dealer._id}
                  className="transition hover:bg-gray-50"
                >
                  {/* HEAD CODE */}

                  <td className="px-3 py-4">
                    <span className="block truncate text-sm font-semibold text-[#123B7A]">
                      {dealer.headCode || "-"}
                    </span>
                  </td>

                  {/* FIRM */}

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      title={dealer.technicianFirmName || ""}
                      onClick={() =>
                        navigate(`/dealers/${dealer._id}`)
                      }
                      className="block w-full truncate text-left text-sm font-medium text-gray-900 hover:text-[#123B7A]"
                    >
                      {dealer.technicianFirmName || "-"}
                    </button>

                    {dealer.technicianName && (
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {dealer.technicianName}
                      </p>
                    )}
                  </td>

                  {/* MOBILE */}

                  <td className="px-3 py-4 text-sm text-gray-700">
                    {dealer.mobileNumber || "-"}
                  </td>

                  {/* ALTERNATIVE */}

                  <td className="px-3 py-4 text-sm text-gray-700">
                    {dealer.alternativeNumber || "-"}
                  </td>

                  {/* CITY */}

                  <td className="px-3 py-4">
                    <p
                      title={dealer.businessAddress?.city || ""}
                      className="truncate text-sm text-gray-700"
                    >
                      {dealer.businessAddress?.city || "-"}
                    </p>
                  </td>

                  {/* CAPACITY */}

                  <td className="px-3 py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {capacity.total}
                    </p>

                    <p className="mt-0.5 whitespace-nowrap text-[11px] text-gray-500">
                      C: {capacity.combined} / I:{" "}
                      {capacity.individual}
                    </p>
                  </td>

                  {/* DOCUMENTS */}

                  <td className="px-3 py-4">
                    <DocumentStatus
                      uploaded={documents.uploaded}
                      total={3}
                      aadhaar={documents.aadhaar}
                      pan={documents.pan}
                      licence={documents.licence}
                    />
                  </td>

                  {/* STATUS */}

                  <td className="px-3 py-4">
                    {/* <DealerStatusBadge
                      status={
                        dealer.effectiveStatus 
                      }
                    /> */}
                    <DealerStatusBadge
  status={
    dealer.effectiveStatus ??
    dealer.status ??
    dealer.technicianStatus ??
    "INACTIVE"
  }
/>
                  </td>

                  {/* ACTIONS */}

                  <td className="px-3 py-4">
                    <DealerActions
                      dealer={dealer}
                      navigate={navigate}
                      handleDelete={handleDelete}
                      hasPermission={hasPermission}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =========================================
          MOBILE CARDS
      ========================================= */}

      <div className="divide-y divide-gray-200 md:hidden">
        {dealers.map((dealer) => {
          const capacity = getCapacity(dealer);
          const documents = getDocumentStatus(dealer);

          return (
            <div
              key={dealer._id}
              className="space-y-4 p-4"
            >
              {/* HEADER */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/dealers/${dealer._id}`)
                    }
                    className="block max-w-full truncate text-left text-base font-semibold text-gray-900"
                  >
                    {dealer.technicianFirmName || "-"}
                  </button>

                  <p className="mt-1 text-xs font-medium text-[#123B7A]">
                    {dealer.headCode || "-"}
                  </p>
                </div>

                {/* <DealerStatusBadge
                  status={
                    dealer ?? "INACTIVE"
                  }
                /> */}
                <DealerStatusBadge
  status={
    dealer.effectiveStatus ??
    dealer.status ??
    dealer.technicianStatus ??
    "INACTIVE"
  }
/>
              </div>

              {/* CONTACT */}

              <div className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <Phone
                    size={15}
                    className="shrink-0 text-gray-400"
                  />

                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400">
                      Mobile
                    </p>

                    <p className="text-sm font-medium text-gray-700">
                      {dealer.mobileNumber || "-"}
                    </p>
                  </div>
                </div>

                {dealer.alternativeNumber && (
                  <div className="flex items-center gap-2">
                    <Phone
                      size={15}
                      className="shrink-0 text-gray-400"
                    />

                    <div>
                      <p className="text-[11px] text-gray-400">
                        Alternative
                      </p>

                      <p className="text-sm text-gray-700">
                        {dealer.alternativeNumber}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MapPin
                    size={15}
                    className="shrink-0 text-gray-400"
                  />

                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400">
                      City
                    </p>

                    <p className="truncate text-sm text-gray-700">
                      {dealer.businessAddress?.city || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CAPACITY + DOCUMENTS */}

              <div className="grid grid-cols-2 gap-3">
                {/* CAPACITY */}

                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">
                    Capacity
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {capacity.total}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    Combined: {capacity.combined}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    Individual: {capacity.individual}
                  </p>
                </div>

                {/* DOCUMENT */}

                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="mb-2 text-xs text-gray-500">
                    Documents
                  </p>

                  <DocumentStatus
                    uploaded={documents.uploaded}
                    total={3}
                    aadhaar={documents.aadhaar}
                    pan={documents.pan}
                    licence={documents.licence}
                  />
                </div>
              </div>

              {/* DOCUMENT DETAILS */}

              <div className="flex flex-wrap gap-2">
                <MobileDocumentBadge
                  label="Aadhaar"
                  uploaded={documents.aadhaar}
                />

                <MobileDocumentBadge
                  label="PAN"
                  uploaded={documents.pan}
                />

                <MobileDocumentBadge
                  label="Licence"
                  uploaded={documents.licence}
                />
              </div>

              {/* ACTIONS */}

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                {hasPermission("dealers.view") && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/dealers/${dealer._id}`)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600"
                  >
                    <Eye size={15} />
                    View
                  </button>
                )}

                {hasPermission("dealers.update") && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/dealers/${dealer._id}/edit`,
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600"
                  >
                    <Edit size={15} />
                    Edit
                  </button>
                )}

                {hasPermission("dealers.delete") && (
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(dealer._id)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          PAGINATION
      ========================================= */}

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

/* =========================================
   CAPACITY
========================================= */

function getCapacity(dealer: Dealer) {
  const combined = Number(
    dealer.combinedCapacity?.capacity ?? 0,
  );

  const individual =
    dealer.individualCapacities?.reduce(
      (total, item) =>
        total + Number(item.capacity || 0),
      0,
    ) ?? 0;

  return {
    combined,
    individual,
    total: combined + individual,
  };
}

/* =========================================
   DOCUMENT STATUS
========================================= */

function getDocumentStatus(dealer: Dealer) {
  const documents = dealer.documents;

  const aadhaar = Boolean(
    documents?.aadhaarFront ||
      documents?.aadhaarBack,
  );

  const pan = Boolean(
    documents?.panFront ||
      documents?.panBack,
  );

  const licence = Boolean(
    documents?.drivingLicenceFront ||
      documents?.drivingLicenceBack,
  );

  const uploaded = [
    aadhaar,
    pan,
    licence,
  ].filter(Boolean).length;

  return {
    aadhaar,
    pan,
    licence,
    uploaded,
  };
}

/* =========================================
   DOCUMENT STATUS BADGE
========================================= */

function DocumentStatus({
  uploaded,
  total,
  aadhaar,
  pan,
  licence,
}: {
  uploaded: number;
  total: number;
  aadhaar: boolean;
  pan: boolean;
  licence: boolean;
}) {
  const allUploaded = uploaded === total;

  const tooltip = [
    `Aadhaar: ${aadhaar ? "Uploaded" : "Missing"}`,
    `PAN: ${pan ? "Uploaded" : "Missing"}`,
    `Licence: ${licence ? "Uploaded" : "Missing"}`,
  ].join("\n");

  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
        allUploaded
          ? "bg-green-50 text-green-700"
          : uploaded > 0
            ? "bg-yellow-50 text-yellow-700"
            : "bg-red-50 text-red-700"
      }`}
    >
      {allUploaded ? (
        <CheckCircle2 size={13} />
      ) : uploaded > 0 ? (
        <FileText size={13} />
      ) : (
        <XCircle size={13} />
      )}

      {uploaded}/{total}
    </span>
  );
}

/* =========================================
   MOBILE DOCUMENT BADGE
========================================= */

function MobileDocumentBadge({
  label,
  uploaded,
}: {
  label: string;
  uploaded: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${
        uploaded
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      {uploaded ? (
        <CheckCircle2 size={12} />
      ) : (
        <XCircle size={12} />
      )}

      {label}
    </span>
  );
}

/* =========================================
   STATUS
========================================= */

function DealerStatusBadge({
  status,
}: {
  status?:
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED"
    | "LEAVE";
}) {
  const variants = {
    ACTIVE: "bg-green-50 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    SUSPENDED: "bg-red-50 text-red-700",
    LEAVE: "bg-amber-50 text-amber-700",
  };

  const labels = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SUSPENDED: "Suspended",
    LEAVE: "On Leave",
  };

  const currentStatus = status ?? "INACTIVE";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
        variants[currentStatus]
      }`}
    >
      {labels[currentStatus]}
    </span>
  );
}
/* =========================================
   DESKTOP ACTIONS
========================================= */

function DealerActions({
  dealer,
  navigate,
  handleDelete,
  hasPermission,
}: {
  dealer: Dealer;
  navigate: (path: string) => void;
  handleDelete: (id: string) => void;
  hasPermission: (permission: string) => boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {hasPermission("dealers.view") && (
        <button
          type="button"
          title="View"
          onClick={() =>
            navigate(`/dealers/${dealer._id}`)
          }
          className="rounded-md p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye size={16} />
        </button>
      )}

      {hasPermission("dealers.update") && (
        <button
          type="button"
          title="Edit"
          onClick={() =>
            navigate(`/dealers/${dealer._id}/edit`)
          }
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <Edit size={16} />
        </button>
      )}

      {hasPermission("dealers.delete") && (
        <button
          type="button"
          title="Delete"
          onClick={() =>
            handleDelete(dealer._id)
          }
          className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}