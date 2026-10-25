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

  return (
    // <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div className="overflow-visible rounded-xl border border-gray-200 bg-white">
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
                Total Capacity
              </th>

              {/* <th className="w-[11%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Documents
              </th> */}
              <th className="w-[11%] px-3 py-3 text-xs font-semibold uppercase text-gray-500">
                Security Amount
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
                      title={getAllCities(dealer).join(", ")}
                      className="text-sm leading-snug text-gray-700"
                    >
                      {getAllCities(dealer).join(", ") || "-"}
                    </p>
                  </td>

                  {/* CAPACITY */}

                  <td className="px-3 py-4">
                    <CapacityPopover dealer={dealer} capacity={capacity} />
                  </td>

                  {/* DOCUMENTS */}

                  <td className="px-3 py-4 text-sm text-gray-700">
                    {dealer.securityAmount || "-"}
                  </td>

                  {/* <td className="px-3 py-4">
                    <DocumentStatus
                      uploaded={documents.uploaded}
                      total={3}
                      aadhaar={documents.aadhaar}
                      pan={documents.pan}
                      licence={documents.licence}
                    />
                  </td> */}

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

                    <p className="text-sm leading-snug text-gray-700">
                      {getAllCities(dealer).join(", ") || "-"}
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

/** Primary business city + every additional city the dealer serves (unique) */
function getAllCities(dealer: Dealer): string[] {
  const names = [
    dealer.businessAddress?.city,
    ...(dealer.additionalCities ?? []).map((item) => item.city),
  ]
    .map((name) => (name ?? "").trim())
    .filter(Boolean);

  return Array.from(new Set(names));
}

function getCapacity(dealer: Dealer) {
  // Primary city + every additional city
  const sources = [
    {
      city: dealer.businessAddress?.city || "Primary city",
      combined: dealer.combinedCapacity,
      individuals: dealer.individualCapacities,
    },
    ...(dealer.additionalCities ?? []).map((item) => ({
      city: item.city,
      combined: item.combinedCapacity,
      individuals: item.individualCapacities,
    })),
  ];

  const cities = sources.map((source) => {
    const combined = Number(source.combined?.capacity ?? 0);

    const individual =
      source.individuals?.reduce(
        (total, item) => total + Number(item.capacity || 0),
        0,
      ) ?? 0;

    return {
      city: source.city,
      combined,
      individual,
      total: combined + individual,
      combinedProducts: source.combined?.products ?? [],
      items: source.individuals ?? [],
    };
  });

  const combined = cities.reduce((sum, c) => sum + c.combined, 0);
  const individual = cities.reduce((sum, c) => sum + c.individual, 0);

  return {
    combined,
    individual,
    total: combined + individual,
    cities,
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
  hasPermission,
}: {
  dealer: Dealer;
  navigate: (path: string) => void;
  hasPermission: (permission: string) => boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {hasPermission("dealers.view") && (
        <button
          type="button"
          title="View"
          onClick={() => navigate(`/dealers/${dealer._id}`)}
          className="rounded-lg p-2 transition bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
        >
          <Eye size={16} />
        </button>
      )}

      {hasPermission("dealers.update") && (
        <button
          type="button"
          title="Edit"
          onClick={() => navigate(`/dealers/${dealer._id}/edit`)}
          className="rounded-lg p-2 transition bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          <Edit size={16} />
        </button>
      )}

      {/* {hasPermission("dealers.delete") && (
        <button
          type="button"
          title="Delete"
          onClick={() => handleDelete(dealer._id)}
          className="rounded-lg p-2 transition bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
        >
          <Trash2 size={16} />
        </button>
      )} */}
    </div>
  );
}

import { useRef, useState } from "react";

function CapacityPopover({
  dealer,
  capacity,
}: {
  dealer: Dealer;
  capacity: {
    combined: number;
    individual: number;
    total: number;
    cities: {
      city: string;
      combined: number;
      individual: number;
      total: number;
      combinedProducts: { productId: number; productName: string }[];
      items: { productId?: number; productName: string; capacity: number }[];
    }[];
  };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [openUpward, setOpenUpward] = useState(false);

  const handleMouseEnter = () => {
    const container = containerRef.current;

    if (!container) return;

    const triggerRect = container.getBoundingClientRect();

    // Estimated popover height.
    // Actual height is used if popover is already rendered.
    const popoverHeight = popoverRef.current?.offsetHeight ?? 350;

    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - triggerRect.bottom;

    const spaceAbove = triggerRect.top;

    // Open upward only when:
    // 1. There isn't enough room below
    // 2. There is more room above
    setOpenUpward(spaceBelow < popoverHeight + 16 && spaceAbove > spaceBelow);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className="group relative inline-block"
    >
      {/* ==============================
          TRIGGER
      ============================== */}

      <button
        type="button"
        className="
          inline-flex min-w-[65px] flex-col items-start
          rounded-lg border border-gray-200
          bg-gray-50 px-2.5 py-1.5
          text-left transition
          hover:border-blue-200 hover:bg-blue-50
        "
      >
        <span className="text-sm font-bold text-[#123B7A]">
          {capacity.total}
        </span>

        <span className="text-[10px] text-gray-500">Total · details</span>
      </button>

      {/* ==============================
          POPOVER
      ============================== */}

      <div
        ref={popoverRef}
        className={`
          invisible absolute left-0 z-[9999]
          w-[340px]
          rounded-xl border border-gray-200
          bg-white p-3
          opacity-0 shadow-xl
          transition-all duration-150

          group-hover:visible
          group-hover:translate-y-0
          group-hover:opacity-100

          ${
            openUpward
              ? "bottom-full mb-2 translate-y-1"
              : "top-full mt-2 -translate-y-1"
          }
        `}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between rounded-lg bg-[#123B7A] px-3 py-2 text-white">
          <div className="min-w-0">
            <p className="text-xs font-semibold">Capacity Information</p>

            <p className="mt-0.5 truncate text-[10px] text-blue-100">
              {dealer.technicianFirmName || dealer.headCode || "-"}
            </p>
          </div>

          <div className="ml-3 text-right">
            <p className="text-lg font-bold leading-none">{capacity.total}</p>
            <p className="mt-0.5 text-[10px] text-blue-100">
              C {capacity.combined} · I {capacity.individual}
            </p>
          </div>
        </div>

        {/* CITY WISE */}

        <div className="mt-2 max-h-[300px] space-y-2 overflow-y-auto pr-0.5">
          {capacity.cities.map((c, index) => (
            <div
              key={`${c.city}-${index}`}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              {/* City row */}

              <div className="flex items-center justify-between bg-gray-50 px-2.5 py-1.5">
                <span className="truncate text-xs font-semibold text-gray-800">
                  {c.city}
                </span>

                <span className="ml-2 rounded bg-white px-1.5 py-0.5 text-xs font-bold text-[#123B7A] shadow-sm">
                  {c.total}
                </span>
              </div>

              <div className="grid grid-cols-2 divide-x divide-gray-100">
                {/* Combined */}

                <div className="bg-blue-50/60 px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                      Combined
                    </span>

                    <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                      {c.combined}
                    </span>
                  </div>

                  {c.combinedProducts.length > 0 ? (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {c.combinedProducts.map((product) => (
                        <span
                          key={product.productId}
                          className="rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-blue-700"
                        >
                          {product.productName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-[10px] text-gray-400">-</p>
                  )}
                </div>

                {/* Individual */}

                <div className="bg-amber-50/60 px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                      Individual
                    </span>

                    <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                      {c.individual}
                    </span>
                  </div>

                  {c.items.length > 0 ? (
                    <div className="mt-1.5 space-y-1">
                      {c.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between gap-2 rounded border border-amber-200 bg-white px-1.5 py-0.5"
                        >
                          <span
                            className="truncate text-[10px] font-medium text-gray-700"
                            title={item.productName}
                          >
                            {item.productName}
                          </span>

                          <span className="text-[10px] font-bold text-amber-700">
                            {item.capacity}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-[10px] text-gray-400">-</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
