import { RotateCcw, Search,Clock3, FileCheck2, XCircle  } from "lucide-react";

import { usePermission } from "../../../hooks/usePermission";
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

  const { hasPermission } = usePermission();

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

const TAB_ACCESS: Record<VerificationTab, string> = {
  PENDING: "pending.access",
  CANCELLATION: "cancellations.access",
  CLOSURE: "closures.access",
};

const allowedTabs = tabs.filter((t) => hasPermission(TAB_ACCESS[t.key]));
const currentTab = allowedTabs.some((t) => t.key === activeTab)
  ? activeTab
  : allowedTabs[0]?.key;

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
          {allowedTabs.map((tab) => {
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
                      ? "text-[#6D28D9]"
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
                      rounded-t-full bg-[#6D28D9]
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
        {allowedTabs.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
            You do not have permission to view any verification section.
          </div>
        )}

        {currentTab === "PENDING" && hasPermission("pending.table") && (
          <PendingListPage />
        )}

        {currentTab === "CANCELLATION" && hasPermission("cancellations.table") && (
          <CancellationListPage />
        )}

        {currentTab === "CLOSURE" && hasPermission("closures.table") && (
          <ClosureHistoryPage />
        )}
      </div>
    </div>
  );

}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
