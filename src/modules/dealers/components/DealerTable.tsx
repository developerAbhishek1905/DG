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

  console.log(dealers[0]?.effectiveStatus);

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
                <tr key={dealer._id} className="transition hover:bg-gray-50">
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
                      onClick={() => navigate(`/dealers/${dealer._id}`)}
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
                      C: {capacity.combined} / I: {capacity.individual}
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
            <div key={dealer._id} className="space-y-4 p-4">
              {/* HEADER */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/dealers/${dealer._id}`)}
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
                  <Phone size={15} className="shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400">Mobile</p>

                    <p className="text-sm font-medium text-gray-700">
                      {dealer.mobileNumber || "-"}
                    </p>
                  </div>
                </div>

                {dealer.alternativeNumber && (
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="shrink-0 text-gray-400" />

                    <div>
                      <p className="text-[11px] text-gray-400">Alternative</p>

                      <p className="text-sm text-gray-700">
                        {dealer.alternativeNumber}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MapPin size={15} className="shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400">City</p>

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
                  <p className="text-xs text-gray-500">Capacity</p>

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
                  <p className="mb-2 text-xs text-gray-500">Documents</p>

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

                <MobileDocumentBadge label="PAN" uploaded={documents.pan} />

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
                    onClick={() => navigate(`/dealers/${dealer._id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600"
                  >
                    <Eye size={15} />
                    View
                  </button>
                )}

                {hasPermission("dealers.update") && (
                  <button
                    type="button"
                    onClick={() => navigate(`/dealers/${dealer._id}/edit`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600"
                  >
                    <Edit size={15} />
                    Edit
                  </button>
                )}

                {hasPermission("dealers.delete") && (
                  <button
                    type="button"
                    onClick={() => handleDelete(dealer._id)}
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
  const combined = Number(dealer.combinedCapacity?.capacity ?? 0);

  const individual =
    dealer.individualCapacities?.reduce(
      (total, item) => total + Number(item.capacity || 0),
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

  const aadhaar = Boolean(documents?.aadhaarFront || documents?.aadhaarBack);

  const pan = Boolean(documents?.panFront || documents?.panBack);

  const licence = Boolean(
    documents?.drivingLicenceFront || documents?.drivingLicenceBack,
  );

  const uploaded = [aadhaar, pan, licence].filter(Boolean).length;

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
        uploaded ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
      }`}
    >
      {uploaded ? <CheckCircle2 size={12} /> : <XCircle size={12} />}

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
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "LEAVE";
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
          onClick={() => navigate(`/dealers/${dealer._id}`)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye size={16} />
        </button>
      )}

      {hasPermission("dealers.update") && (
        <button
          type="button"
          title="Edit"
          onClick={() => navigate(`/dealers/${dealer._id}/edit`)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <Edit size={16} />
        </button>
      )}

      {hasPermission("dealers.delete") && (
        <button
          type="button"
          title="Delete"
          onClick={() => handleDelete(dealer._id)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
