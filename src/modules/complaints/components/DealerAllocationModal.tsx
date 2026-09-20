// import { CheckCircle2, Star, Users, Wrench, X } from "lucide-react";

// export interface AllocationDealer {
//   id: string;
//   name: string;
//   code: string;
//   phone: string;
//   city: string;
//   activeJobs: number;
//   technicians: number;
//   rating: number;
//   serviceMatch: boolean;
//   available: boolean;
// }

// interface DealerAllocationModalProps {
//   open: boolean;
//   complaintNumber?: string;
//   dealers: AllocationDealer[];
//   selectedDealerId?: string;
//   onSelectDealer: (dealerId: string) => void;
//   onAllocate: () => void;
//   onSkip: () => void;
//   loading?: boolean;
// }

// export default function DealerAllocationModal({
//   open,
//   complaintNumber,
//   dealers,
//   selectedDealerId,
//   onSelectDealer,
//   onAllocate,
//   onSkip,
//   loading = false,
// }: DealerAllocationModalProps) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl">
//         {/* Header */}

//         <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
//           <div>
//             <div className="flex items-center gap-2">
//               <CheckCircle2 size={20} className="text-green-600" />

//               <h2 className="text-xl font-semibold text-gray-900">
//                 Complaint Created Successfully
//               </h2>
//             </div>

//             <p className="mt-1 text-sm text-gray-500">
//               {complaintNumber
//                 ? `${complaintNumber} is ready for dealer allocation.`
//                 : "The complaint is ready for dealer allocation."}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onSkip}
//             className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="space-y-6 p-6">
//           {/* Allocation Criteria */}

//           <div>
//             <div className="mb-4">
//               <h3 className="text-base font-semibold text-gray-900">
//                 Allocation Criteria
//               </h3>

//               <p className="mt-1 text-sm text-gray-500">
//                 Dealers are recommended based on the following criteria.
//               </p>
//             </div>

//             <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

//               <CriteriaCard
//                 icon={<Wrench size={18} />}
//                 title="Service Match"
//                 description="Dealer should support complaint category"
//               />

//               <CriteriaCard
//                 icon={<Users size={18} />}
//                 title="Workload"
//                 description="Dealer with fewer active jobs preferred"
//               />

//               <CriteriaCard
//                 icon={<Star size={18} />}
//                 title="Performance"
//                 description="Rating and service performance considered"
//               />
//             </div>
//           </div>

//           {/* Allocation Rules */}

//           <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
//             <h4 className="text-sm font-semibold text-[#123B7A]">
//               Allocation Priority
//             </h4>

//             <div className="mt-3 flex flex-wrap gap-2">
//               <CriteriaBadge>Same City</CriteriaBadge>
//               <CriteriaBadge>Service Capability</CriteriaBadge>
//               <CriteriaBadge>Dealer Available</CriteriaBadge>
//               <CriteriaBadge>Lowest Workload</CriteriaBadge>
//               <CriteriaBadge>Best Rating</CriteriaBadge>
//             </div>
//           </div>

//           {/* Dealers */}

//           <div>
//             <div className="mb-4 flex items-center justify-between">
//               <div>
//                 <h3 className="text-base font-semibold text-gray-900">
//                   Recommended Dealers
//                 </h3>

//                 <p className="mt-1 text-sm text-gray-500">
//                   Select the most suitable dealer for this complaint.
//                 </p>
//               </div>

//               <span className="text-sm text-gray-500">
//                 {dealers.length} dealers found
//               </span>
//             </div>

//             <div className="space-y-3">
//               {dealers.map((dealer, index) => {
//                 const selected = selectedDealerId === dealer.id;
//                 return (
//                   <button
//                     type="button"
//                     key={dealer.id}
//                     disabled={!dealer.available}
//                     onClick={() => onSelectDealer(dealer.id)}
//                     className={`w-full rounded-xl border p-4 text-left transition ${
//                       selected
//                         ? "border-[#123B7A] bg-blue-50 ring-1 ring-[#123B7A]"
//                         : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                     } ${
//                       !dealer.available ? "cursor-not-allowed opacity-50" : ""
//                     }`}
//                   >
//                     <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//                       {/* Dealer */}

//                       <div className="flex min-w-55 items-center gap-3">
//                         <div
//                           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
//                             index === 0
//                               ? "bg-green-100 text-green-700"
//                               : "bg-gray-100 text-gray-700"
//                           }`}
//                         >
//                           {index + 1}
//                         </div>

//                         <div>
//                           <div className="flex flex-wrap items-center gap-2">
//                             <p className="font-semibold text-gray-900">
//                               {dealer.name}
//                             </p>

//                             {index === 0 && dealer.available && (
//                               <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
//                                 Best Match
//                               </span>
//                             )}
//                           </div>

//                           <p className="mt-0.5 text-xs text-gray-500">
//                             {dealer.code} • {dealer.city}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Criteria */}

//                       <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-5">
//                         <DealerMetric
//                           label="Active Jobs"
//                           value={dealer.activeJobs}
//                         />

//                         <DealerMetric
//                           label="Technicians"
//                           value={dealer.technicians}
//                         />

//                         <DealerMetric
//                           label="Rating"
//                           value={`${dealer.rating}/5`}
//                         />

//                         <DealerMetric
//                           label="Service"
//                           value={
//                             dealer.serviceMatch ? "Matched" : "Not Matched"
//                           }
//                           success={dealer.serviceMatch}
//                         />
//                       </div>

//                       {/* Radio */}

//                       <div
//                         className={`h-5 w-5 shrink-0 rounded-full border-2 ${
//                           selected ? "border-[#123B7A]" : "border-gray-300"
//                         }`}
//                       >
//                         {selected && (
//                           <div className="m-0.75 h-2.5 w-2.5 rounded-full bg-[#123B7A]" />
//                         )}
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}

//         <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={onSkip}
//             disabled={loading}
//             className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           >
//             Allocate Later
//           </button>

//           <button
//             type="button"
//             disabled={!selectedDealerId || loading}
//             onClick={onAllocate}
//             className="rounded-lg bg-[#123B7A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {loading ? "Allocating..." : "Allocate Dealer"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CriteriaCard({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="rounded-xl border border-gray-200 p-4">
//       <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
//         {icon}
//       </div>
//       <p className="text-sm font-semibold text-gray-900">{title}</p>
//       <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
//     </div>
//   );
// }

// function CriteriaBadge({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-[#123B7A]">
//       {children}
//     </span>
//   );
// }

// function DealerMetric({
//   label,
//   value,
//   success,
// }: {
//   label: string;
//   value: React.ReactNode;
//   success?: boolean;
// }) {
//   return (
//     <div>
//       <p className="text-xs text-gray-400">{label}</p>

//       <p
//         className={`mt-1 text-sm font-medium ${
//           success === true
//             ? "text-green-600"
//             : success === false
//               ? "text-red-500"
//               : "text-gray-800"
//         }`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }


import {
  Building2,
  Check,
  Loader2,
  MapPin,
  Phone,
  Star,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  assignDealerToComplaint,
  getEligibleDealers,
  type EligibleDealer,
} from "../services/complaintApi";

interface Props {
  complaintId: string;

  currentDealerId?: string;

  onClose: () => void;

  onSuccess: () => void;
}

export default function DealerAllocationModal({
  complaintId,
  currentDealerId,
  onClose,
  onSuccess,
}: Props) {
  const [dealers, setDealers] = useState<
    EligibleDealer[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedDealerId, setSelectedDealerId] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  /* =========================================
     FETCH ELIGIBLE DEALERS
  ========================================= */

  const fetchDealers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEligibleDealers(
          complaintId,
        );

      setDealers(response.data || []);
    } catch (error: any) {
      console.error(
        "Eligible dealers error:",
        error,
      );

      setError(
        error?.response?.data?.message ||
          "Failed to fetch eligible dealers",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, [complaintId]);

  /* =========================================
     ASSIGN
  ========================================= */

const handleAssign = async () => {
  if (!selectedDealerId) {
    setError("Please select a dealer");
    return;
  }

  try {
    setSubmitting(true);
    setError("");

    const response =
      await assignDealerToComplaint(
        complaintId,
        selectedDealerId,
      );

    console.log(
      "Dealer assignment:",
      response,
    );

    onSuccess();
  } catch (error: any) {
    console.error(
      "Assign dealer error:",
      error,
    );

    setError(
      error?.response?.data?.message ||
        "Failed to assign dealer",
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-[#123B7A]">
              {currentDealerId
                ? "Reassign Dealer"
                : "Assign Dealer"}
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Showing dealers matching complaint
              city and service.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2
                size={24}
                className="animate-spin text-[#123B7A]"
              />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : dealers.length === 0 ? (
            <div className="py-10 text-center">
              <Building2
                size={32}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm font-medium text-gray-700">
                No eligible dealers found
              </p>

              <p className="mt-1 text-xs text-gray-500">
                No active dealer matches this
                complaint's city and service.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {dealers.map((dealer) => {
                const selected =
                  selectedDealerId ===
                  dealer._id;

                const current =
                  currentDealerId ===
                  dealer._id;

                return (
                  <button
                    key={dealer._id}
                    type="button"
                    disabled={current}
                    onClick={() =>
                      setSelectedDealerId(
                        dealer._id,
                      )
                    }
                    className={`relative rounded-lg border p-4 text-left transition ${
                      selected
                        ? "border-[#123B7A] bg-blue-50"
                        : current
                          ? "cursor-not-allowed border-green-200 bg-green-50"
                          : "border-gray-200 hover:border-[#123B7A]"
                    }`}
                  >
                    {selected && (
                      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#123B7A] text-white">
                        <Check size={12} />
                      </div>
                    )}

                    {current && (
                      <span className="absolute right-3 top-3 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                        Current
                      </span>
                    )}

                    <p className="pr-16 text-sm font-semibold text-gray-900">
                      {
                        dealer.technicianName
                      }
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {
                        dealer.technicianFirmName
                      }
                    </p>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone size={13} />

                        {dealer.mobileNumber}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin size={13} />

                        {dealer.city || "-"}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Star size={13} />

                        {dealer.rating ?? 0}/5
                      </div>
                    </div>

                    {/* MATCHED SERVICE */}

                    <div className="mt-3 rounded-md bg-gray-50 px-3 py-2">
                      <p className="text-[10px] font-medium uppercase text-gray-400">
                        Matched Service
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-gray-700">
                        {
                          dealer
                            .matchedService
                            ?.productName
                        }
                        {" • "}
                        {
                          dealer
                            .matchedService
                            ?.categoryName
                        }
                      </p>

                      {dealer.matchedService
                        ?.description && (
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {
                            dealer
                              .matchedService
                              .description
                          }
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              !selectedDealerId ||
              submitting
            }
            onClick={handleAssign}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && (
              <Loader2
                size={14}
                className="animate-spin"
              />
            )}

            {currentDealerId
              ? "Reassign Dealer"
              : "Assign Dealer"}
          </button>
        </div>
      </div>
    </div>
  );
}