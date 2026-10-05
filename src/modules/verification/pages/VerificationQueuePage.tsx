import { RotateCcw, Search,Clock3, FileCheck2, XCircle  } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import CorrectionRequestModal from "../components/CorrectionRequestModal";
import RejectVerificationModal from "../components/RejectVerificationModal";
import VerificationTable from "../components/VerificationTable";
import VerifyComplaintModal from "../components/VerifyComplaintModal";

import {
  getVerificationQueue,
  rejectVerification,
  requestCorrection,
  verifyComplaint,
} from "../services/verificationApi";

import {
  clearVerificationFilters,
  closeCorrectionModal,
  closeRejectVerificationModal,
  closeVerifyModal,
  openCorrectionModal,
  openRejectVerificationModal,
  openVerifyModal,
  setVerificationClosureType,
  setVerificationPriority,
  setVerificationSearch,
  setVerificationSLAStatus,
  setVerificationStatus,
} from "../store/verificationSlice";

import type {
  CorrectionRequestPayload,
  RejectVerificationPayload,
  VerificationPriority,
  VerificationRecord,
  VerificationSLAStatus,
  VerificationStatus,
  VerifyComplaintPayload,
} from "../types/verification.types";
import { PendingListPage } from "../../pending";
import { CancellationListPage } from "../../cancellations";
import { ClosureHistoryPage } from "../../closures";

type VerificationTab = "PENDING" | "CANCELLATION" | "CLOSURE";



export default function VerificationQueuePage() {
  const dispatch = useAppDispatch();

  const {
    search,
    status,
    priority,
    slaStatus,
    closureType,

    selectedVerificationId,

    verifyModalOpen,

    rejectModalOpen,

    correctionModalOpen,
  } = useAppSelector((state) => state.verification);

  const [records, setRecords] = useState<VerificationRecord[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] =
  useState<VerificationTab>("PENDING");

    const tabs = [
    {
      key: "PENDING" as const,
      label: "Pending",
      icon: Clock3,
    },
    {
      key: "CANCELLATION" as const,
      label: "Cancellation",
      icon: XCircle,
    },
    {
      key: "CLOSURE" as const,
      label: "Closure",
      icon: FileCheck2,
    },
  ];

  // const loadQueue = async () => {
  //   try {
  //     setLoading(true);

  //     const data = await getVerificationQueue();

  //     setRecords(data);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadQueue();
  // }, []);

const filtered = useMemo(
  () =>
    records.filter((record) => {
      /*
      |--------------------------------------------------------------------------
      | Tab Filter
      |--------------------------------------------------------------------------
      */

      let matchesTab = true;

      if (activeTab === "PENDING") {
        matchesTab = record.status === "PENDING";
      }

      if (activeTab === "CANCELLATION") {
        matchesTab =
          record.closure?.closureType === "CANCELLATION";
      }

      if (activeTab === "CLOSURE") {
        matchesTab =
          record.closure?.closureType !== "CANCELLATION";
      }

      /*
      |--------------------------------------------------------------------------
      | Existing Filters
      |--------------------------------------------------------------------------
      */

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        record.complaintNumber.toLowerCase().includes(query) ||
        record.customer.name.toLowerCase().includes(query) ||
        record.dealer.name.toLowerCase().includes(query);

      const matchesStatus =
        status === "ALL" || record.status === status;

      const matchesPriority =
        priority === "ALL" || record.priority === priority;

      const matchesSLA =
        slaStatus === "ALL" || record.slaStatus === slaStatus;

      const matchesClosure =
        closureType === "ALL" ||
        record.closure.closureType === closureType;

      return (
        matchesTab &&
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesSLA &&
        matchesClosure
      );
    }),
  [
    records,
    activeTab,
    search,
    status,
    priority,
    slaStatus,
    closureType,
  ],
);

  const selectedRecord = records.find(
    (record) => record.id === selectedVerificationId,
  );

  const handleVerify = async (payload: VerifyComplaintPayload) => {
    await verifyComplaint(payload);

    dispatch(closeVerifyModal());

    await loadQueue();
  };

  const handleReject = async (payload: RejectVerificationPayload) => {
    await rejectVerification(payload);

    dispatch(closeRejectVerificationModal());

    await loadQueue();
  };

  const handleCorrection = async (payload: CorrectionRequestPayload) => {
    await requestCorrection(payload);

    dispatch(closeCorrectionModal());

    await loadQueue();
  };
return (
    <div className="space-y-5">
      {/* =====================================================
          HEADER
      ====================================================== */}

      {/* <div>
        <h1 className="text-2xl font-bold text-gray-900">
          DG Verification
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review pending, cancellation and closure complaints.
        </p>
      </div> */}

      {/* =====================================================
          TABS
      ====================================================== */}

      <div className="border-b border-gray-200">
        <div className="flex items-center gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative flex items-center gap-2
                  px-1 pb-3
                  text-sm font-semibold
                  transition-colors
                  ${
                    isActive
                      ? "text-[#123B7A]"
                      : "text-gray-500 hover:text-gray-800"
                  }
                `}
              >
                <Icon size={18} />

                <span>{tab.label}</span>

                {isActive && (
                  <span
                    className="
                      absolute bottom-0 left-0
                      h-[3px] w-full
                      rounded-t-full bg-[#123B7A]
                    "
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          TAB CONTENT
      ====================================================== */}

      <div>
        {activeTab === "PENDING" && <PendingListPage />}

        {activeTab === "CANCELLATION" && (
          <CancellationListPage />
        )}

        {activeTab === "CLOSURE" && <ClosureHistoryPage />}
      </div>
    </div>
  );


//   return (
//     <div className="space-y-6">
// {/* =====================================================
//     VERIFICATION TABS
// ===================================================== */}

// <div className="flex items-center border-b border-gray-200">
//   {[
//     {
//       key: "PENDING",
//       label: "Pending",
//       count: records.filter((item) => item.status === "PENDING").length,
//     },
//     {
//       key: "CANCELLATION",
//       label: "Cancellation",
//       count: 0,
//     },
//     {
//       key: "CLOSURE",
//       label: "Closure",
//       count: 0,
//     },
//   ].map((tab) => {
//     const isActive = activeTab === tab.key;

//     return (
//       <button
//         key={tab.key}
//         type="button"
//         onClick={() => setActiveTab(tab.key as VerificationTab)}
//         className={`
//           relative flex items-center gap-2
//           px-6 py-3
//           text-sm font-semibold
//           transition-colors
//           ${
//             isActive
//               ? "text-[#123B7A]"
//               : "text-gray-500 hover:text-gray-800"
//           }
//         `}
//       >
//         {tab.label}

//         <span
//           className={`
//             rounded-md px-2 py-0.5
//             text-xs font-semibold
//             ${
//               isActive
//                 ? "bg-blue-100 text-[#123B7A]"
//                 : "bg-gray-100 text-gray-500"
//             }
//           `}
//         >
//           {tab.count}
//         </span>

//         {isActive && (
//           <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-t-full bg-[#123B7A]" />
//         )}
//       </button>
//     );
//   })}
// </div>
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Verification Queue</h1>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <Stat
//           label="Pending"
//           value={records.filter((item) => item.status === "PENDING").length}
//         />

//         <Stat
//           label="In Review"
//           value={records.filter((item) => item.status === "IN_REVIEW").length}
//         />

//         <Stat
//           label="Correction Required"
//           value={
//             records.filter((item) => item.status === "CORRECTION_REQUIRED")
//               .length
//           }
//         />

//         <Stat
//           label="SLA Breached"
//           value={records.filter((item) => item.slaStatus === "BREACHED").length}
//         />
//       </div>

//       <div className="rounded-xl border border-gray-200 bg-white p-4">
//         <div className="flex flex-col gap-3 xl:flex-row">
//           <div className="relative flex-1">
//             <Search
//               size={17}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />

//             <input
//               value={search}
//               onChange={(event) =>
//                 dispatch(setVerificationSearch(event.target.value))
//               }
//               placeholder="Search complaint, customer or dealer..."
//               className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
//             />
//           </div>

//           <select
//             value={status}
//             onChange={(event) =>
//               dispatch(
//                 setVerificationStatus(
//                   event.target.value as VerificationStatus | "ALL",
//                 ),
//               )
//             }
//             className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
//           >
//             <option value="ALL">All Status</option>

//             <option value="PENDING">Pending</option>

//             <option value="IN_REVIEW">In Review</option>

//             <option value="VERIFIED">Verified</option>

//             <option value="REJECTED">Rejected</option>

//             <option value="CORRECTION_REQUIRED">Correction Required</option>
//           </select>

//           <select
//             value={priority}
//             onChange={(event) =>
//               dispatch(
//                 setVerificationPriority(
//                   event.target.value as VerificationPriority | "ALL",
//                 ),
//               )
//             }
//             className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
//           >
//             <option value="ALL">All Priority</option>

//             <option value="LOW">Low</option>

//             <option value="MEDIUM">Medium</option>

//             <option value="HIGH">High</option>

//             <option value="CRITICAL">Critical</option>
//           </select>

//           <select
//             value={slaStatus}
//             onChange={(event) =>
//               dispatch(
//                 setVerificationSLAStatus(
//                   event.target.value as VerificationSLAStatus | "ALL",
//                 ),
//               )
//             }
//             className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
//           >
//             <option value="ALL">All SLA</option>

//             <option value="SAFE">Safe</option>

//             <option value="WARNING">Warning</option>

//             <option value="BREACHED">Breached</option>

//             <option value="COMPLETED">Completed</option>
//           </select>

//           <select
//             value={closureType}
//             onChange={(event) =>
//               dispatch(setVerificationClosureType(event.target.value))
//             }
//             className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
//           >
//             <option value="ALL">All Closure Types</option>

//             <option value="VISIT">Visit</option>

//             <option value="PART">Part</option>

//             <option value="SERVICE">Service</option>

//             <option value="INSTALLATION">Installation</option>

//             <option value="UNINSTALLATION">Uninstallation</option>
//           </select>

//           <button
//             onClick={() => dispatch(clearVerificationFilters())}
//             className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="rounded-xl border bg-white p-12 text-center">
//           Loading verification queue...
//         </div>
//       ) : (
//         <VerificationTable
//           records={filtered}
//           onVerify={(id) => dispatch(openVerifyModal(id))}
//           onReject={(id) => dispatch(openRejectVerificationModal(id))}
//           onCorrection={(id) => dispatch(openCorrectionModal(id))}
//         />
//       )}

//       <VerifyComplaintModal
//         open={verifyModalOpen}
//         verification={selectedRecord}
//         onClose={() => dispatch(closeVerifyModal())}
//         onSubmit={handleVerify}
//       />

//       <RejectVerificationModal
//         open={rejectModalOpen}
//         verification={selectedRecord}
//         onClose={() => dispatch(closeRejectVerificationModal())}
//         onSubmit={handleReject}
//       />

//       <CorrectionRequestModal
//         open={correctionModalOpen}
//         verification={selectedRecord}
//         onClose={() => dispatch(closeCorrectionModal())}
//         onSubmit={handleCorrection}
//       />
//     </div>
//   );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
