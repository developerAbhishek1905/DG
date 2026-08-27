// import Card from "../../../components/ui/Card";

// import type { Dealer } from "../types/complaint.types";

// interface Props {
//   dealer?: Dealer;
// }

// export default function DealerInfoCard({
//   dealer,
// }: Props) {
//   return (
//     <Card className="p-5">
//       <h3 className="text-base font-semibold text-gray-900">
//         Dealer Information
//       </h3>

//       {dealer ? (
//         <div className="mt-4 space-y-3">
//           <Info label="Dealer" value={dealer.name} />

//           <Info label="Code" value={dealer.code} />

//           <Info label="Phone" value={dealer.phone} />

//           <Info label="City" value={dealer.city} />
//         </div>
//       ) : (
//         <p className="mt-4 text-sm text-gray-500">
//           No dealer assigned yet.
//         </p>
//       )}
//     </Card>
//   );
// }

// function Info({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div>
//       <p className="text-xs text-gray-500">
//         {label}
//       </p>

//       <p className="mt-1 text-sm font-medium text-gray-900">
//         {value}
//       </p>
//     </div>
//   );
// }

import {
  Building2,
  MapPin,
  Phone,
  UserRoundSearch,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

interface DealerInfoCardProps {
  complaintId: string;

  dealer?: {
    id: string;
    name: string;
    dealerCode?: string;
    phone?: string;
    city?: string;
  } | null;

  allocationStatus?:
    | "UNASSIGNED"
    | "ASSIGNED"
    | "REASSIGNMENT_REQUIRED";
}

export default function DealerInfoCard({
  complaintId,
  dealer,
  allocationStatus = "UNASSIGNED",
}: DealerInfoCardProps) {
  const navigate = useNavigate();

  const handleAllocation = () => {
    navigate(`/allocation/${complaintId}`);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Building2
            size={18}
            className="text-[#123B7A]"
          />

          <h3 className="font-semibold text-gray-900">
            Dealer Information
          </h3>
        </div>

        <AllocationStatusBadge
          status={allocationStatus}
        />
      </div>

      <div className="p-5">
        {dealer ? (
          <>
            <div>
              <p className="text-xs text-gray-500">
                Assigned Dealer
              </p>

              <h4 className="mt-1 text-base font-semibold text-gray-900">
                {dealer.name}
              </h4>

              {dealer.dealerCode && (
                <p className="mt-1 text-xs text-gray-400">
                  {dealer.dealerCode}
                </p>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {dealer.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone
                    size={16}
                    className="text-gray-400"
                  />

                  {dealer.phone}
                </div>
              )}

              {dealer.city && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin
                    size={16}
                    className="text-gray-400"
                  />

                  {dealer.city}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAllocation}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#123B7A] px-4 py-2.5 text-sm font-medium text-[#123B7A] transition hover:bg-blue-50"
            >
              <RefreshCw size={16} />

              Reassign Dealer
            </button>
          </>
        ) : (
          <div>
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#123B7A]">
                <UserRoundSearch size={19} />
              </div>

              <p className="mt-3 text-sm font-medium text-gray-800">
                No Dealer Assigned
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Select an eligible dealer to handle this complaint.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAllocation}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854]"
            >
              <UserRoundSearch size={16} />

              Allocate Dealer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AllocationStatusBadge({
  status,
}: {
  status:
    | "UNASSIGNED"
    | "ASSIGNED"
    | "REASSIGNMENT_REQUIRED";
}) {
  const config = {
    UNASSIGNED: {
      label: "Unassigned",
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    ASSIGNED: {
      label: "Assigned",
      className:
        "bg-green-50 text-green-700 border-green-200",
    },

    REASSIGNMENT_REQUIRED: {
      label: "Reassignment Required",
      className:
        "bg-red-50 text-red-700 border-red-200",
    },
  };

  const item = config[status];

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}