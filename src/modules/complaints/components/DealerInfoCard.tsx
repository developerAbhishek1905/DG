import {
  Building2,
  MapPin,
  Phone,
  RefreshCw,
  Star,
  UserRound,
  UserRoundSearch,
  Wrench,
} from "lucide-react";

import { useState } from "react";
import DealerAllocationModal from "./DealerAllocationModal";

interface DealerInfoCardProps {
  complaintId: string;

  dealer?: {
    id: string;
    name: string;
    firmName?: string;
    dealerCode?: string;
    technicianCode?: string;
    phone?: string;
    city?: string;
    rating?: number;
    status?: string;
  } | null;

  allocationStatus?: "UNASSIGNED" | "ASSIGNED" | "REASSIGNMENT_REQUIRED";

  onAllocationChange?: () => void;
    onDealerAssigned?: () => void | Promise<void>;
}

export default function DealerInfoCard({
  complaintId,
  dealer,
  allocationStatus = "UNASSIGNED",
  onAllocationChange,
  onDealerAssigned
}: DealerInfoCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-xl mt-4 border border-blue-200 bg-white shadow-sm">
        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/70 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#123B7A] text-white">
              <Building2 size={15} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#123B7A]">
                Dealer Information
              </h3>

              <p className="text-[10px] text-gray-500">
                Complaint assigned service provider
              </p>
            </div>
          </div>

          <AllocationStatusBadge status={allocationStatus} />
        </div>

        {/* =====================================
            CONTENT
        ====================================== */}

        <div className="p-3">
          {dealer ? (
            <>
              {/* =================================
                  DEALER IDENTITY
              ================================== */}

              <div className="mb-3 flex items-center justify-between rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#123B7A] text-white">
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                      Assigned Technician
                    </p>

                    <p className="truncate text-sm font-bold text-gray-900">
                      {dealer.name || "-"}
                    </p>

                    {dealer.firmName && (
                      <p
                        className="truncate text-[11px] font-medium text-[#123B7A]"
                        title={dealer.firmName}
                      >
                        {dealer.firmName}
                      </p>
                    )}
                  </div>
                </div>

                <DealerStatus status={dealer.status} />
              </div>

              {/* =================================
                  DEALER DETAILS
              ================================== */}

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                <DealerField
                  icon={<Building2 size={13} />}
                  label="Firm"
                  value={dealer.firmName}
                />

                <DealerField
                  icon={<Phone size={13} />}
                  label="Mobile"
                  value={dealer.phone}
                  highlight
                />

                <DealerField
                  icon={<Wrench size={13} />}
                  label="Technician Code"
                  value={dealer.technicianCode || dealer.dealerCode}
                />

                <DealerField
                  icon={<Star size={13} />}
                  label="Rating"
                  value={
                    dealer.rating !== undefined ? `${dealer.rating}/5` : "-"
                  }
                  highlight
                />

                {dealer.city && (
                  <DealerField
                    icon={<MapPin size={13} />}
                    label="City"
                    value={dealer.city}
                  />
                )}
              </div>

              {/* =================================
                  ACTION
              ================================== */}

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <p className="text-[10px] text-gray-400">
                  Need to change the assigned dealer?
                </p>

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#123B7A] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#123B7A] shadow-sm transition hover:bg-[#123B7A] hover:text-white"
                >
                  <RefreshCw size={13} />
                  Reassign Dealer
                </button>
              </div>
            </>
          ) : (
            /* =====================================
                UNASSIGNED
            ====================================== */

            <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-blue-200 bg-blue-50/40 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#123B7A]">
                  <UserRoundSearch size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-800">
                    No Dealer Assigned
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-500">
                    Select an eligible dealer for this complaint.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#123B7A] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0B2854]"
              >
                <UserRoundSearch size={14} />
                Assign Dealer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          MODAL
      ====================================== */}

      {open && (
        <DealerAllocationModal
          complaintId={complaintId}
          currentDealerId={dealer?.id}
          onClose={() => setOpen(false)}
          onSuccess={async  () => {
            setOpen(false);
              await onDealerAssigned?.();
            onAllocationChange?.();
          }}
        />
      )}
    </>
  );
}

/* =========================================================
   DEALER FIELD
========================================================= */

function DealerField({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  const displayValue =
    value === null || value === undefined || value === "" ? "-" : String(value);

  return (
    <div
      className={`min-w-0 rounded-lg border px-2.5 py-2 ${
        highlight
          ? "border-blue-200 bg-blue-50/70"
          : "border-gray-400 bg-gray-50/70"
      }`}
    >
      <div className="flex items-center gap-1.5">
        {icon && <span className="shrink-0 text-[#123B7A]">{icon}</span>}

        <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
      </div>

      <p
        className="mt-1 truncate text-xs font-semibold text-gray-800"
        title={displayValue}
      >
        {displayValue}
      </p>
    </div>
  );
}

/* =========================================================
   DEALER STATUS
========================================================= */

function DealerStatus({ status }: { status?: string }) {
  if (!status) return null;

  const isActive = status === "ACTIVE";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold ${
        isActive
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {status}
    </span>
  );
}

/* =========================================================
   ALLOCATION STATUS
========================================================= */

function AllocationStatusBadge({
  status,
}: {
  status: "UNASSIGNED" | "ASSIGNED" | "REASSIGNMENT_REQUIRED";
}) {
  const config = {
    UNASSIGNED: {
      label: "Unassigned",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },

    ASSIGNED: {
      label: "Assigned",
      className: "border-green-200 bg-green-50 text-green-700",
    },

    REASSIGNMENT_REQUIRED: {
      label: "Reassignment Required",
      className: "border-red-200 bg-red-50 text-red-700",
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${item.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {item.label}
    </span>
  );
}

/* =========================================================
   DEALER FIELD
========================================================= */

interface DealerFieldProps {
  icon?: React.ReactNode;
  label: string;
  value?: string | number | null;
}


