import {
  ArrowLeft,
  BookOpen,
  FileText,
  Building2,
  MapPin,
  Phone,
  ReceiptText,
  RotateCcw,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import AllBillsTab from "../components/AllBillsTab";
import LedgerStatementTab from "../components/LedgerStatementTab";
import PendingBillsTab from "../components/PendingBillsTab";
import SecurityRefundModal from "../components/SecurityRefundModal";
import type { Dealer } from "../../dealers/types/dealer.types";
import { getDealerById } from "../../dealers/services/dealerApi";
import {
  getDealerSecurityRefunds,
  refundDealerSecurity,
} from "../services/ledgerApi";
import type {
  DealerSecurityRefundData,
  RefundSecurityPayload,
} from "../services/ledgerApi";

type LedgerTab = "LEDGER" | "PENDING" | "ALL_BILLS";

const tabs: { key: LedgerTab; label: string; icon: typeof BookOpen }[] = [
  { key: "LEDGER", label: "Ledger", icon: BookOpen },
  { key: "PENDING", label: "Pending Bills", icon: ReceiptText },
  { key: "ALL_BILLS", label: "All Bills", icon: FileText },
];

export default function DealerLedgerPage() {
  const navigate = useNavigate();

  const { dealerId } = useParams<{ dealerId: string }>();

  const [activeTab, setActiveTab] = useState<LedgerTab>("LEDGER");

  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [dealerError, setDealerError] = useState<string | null>(null);

  const [refundData, setRefundData] =
    useState<DealerSecurityRefundData | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const loadDealerDetails = useCallback(async () => {
    if (!dealerId) return;

    try {
      setDealerError(null);
      setDealer(await getDealerById(dealerId));
    } catch (error) {
      console.error("Failed to fetch dealer:", error);
      setDealerError("Unable to load dealer information.");
    }
  }, [dealerId]);

  const loadRefundDetails = useCallback(async () => {
    if (!dealerId) return;

    try {
      setRefundLoading(true);
      setRefundData(await getDealerSecurityRefunds(dealerId));
    } catch (error) {
      console.error("Refund details error:", error);
      toast.error("Failed to load refund details");
    } finally {
      setRefundLoading(false);
    }
  }, [dealerId]);

  useEffect(() => {
    void loadDealerDetails();
    void loadRefundDetails();
  }, [loadDealerDetails, loadRefundDetails]);

  const handleRefundSubmit = async (payload: RefundSecurityPayload) => {
    if (!dealerId) return;

    try {
      setRefundSubmitting(true);

      await refundDealerSecurity(dealerId, payload);

      toast.success("Security amount refunded successfully");

      setRefundModalOpen(false);

      await Promise.all([loadRefundDetails(), loadDealerDetails()]);
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to refund security amount",
      );
    } finally {
      setRefundSubmitting(false);
    }
  };

  if (!dealerId) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-10 text-center text-sm text-red-600">
        Dealer ID is missing from the URL.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/ledger")}
        className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#123B7A]"
      >
        <ArrowLeft size={17} />
        Back to Ledger
      </button>

      {/* DEALER INFORMATION */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
              <Building2 size={23} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-gray-900">
                {dealer?.technicianFirmName || "Dealer Ledger"}
              </h1>

              <p className="mt-1 text-xs font-medium text-gray-500">
                {dealer?.headCode || "-"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600">
                {dealer?.technicianName && (
                  <span className="font-medium">{dealer.technicianName}</span>
                )}

                {dealer?.mobileNumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={14} className="text-gray-400" />
                    <span>{dealer.mobileNumber}</span>
                  </div>
                )}

                {(dealer as { city?: string } | null)?.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{(dealer as { city?: string }).city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center lg:border-l lg:border-t-0 lg:py-1 lg:pl-6">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Security Amount
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                ₹
                {Number(
                  refundData?.securityAmount ?? dealer?.securityAmount ?? 0,
                ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>

              {refundData?.eligibleRefundDate && (
                <p className="mt-1 text-xs text-gray-500">
                  Refund eligible from:{" "}
                  {new Date(refundData.eligibleRefundDate).toLocaleDateString(
                    "en-IN",
                    { day: "2-digit", month: "short", year: "numeric" },
                  )}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setRefundModalOpen(true)}
              disabled={
                refundLoading || refundSubmitting || !refundData?.canRefund
              }
              title={refundData?.reason || "Refund security amount"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e3063] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Refund Amount
            </button>
          </div>
        </div>

        {dealerError && (
          <div className="border-t border-red-100 bg-red-50 px-5 py-2.5 text-xs text-red-600">
            {dealerError}
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-200 bg-white p-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === key
                ? "bg-[#123B7A] text-white shadow-sm"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "LEDGER" && <LedgerStatementTab dealerId={dealerId} />}
      {activeTab === "PENDING" && <PendingBillsTab dealerId={dealerId} />}
      {activeTab === "ALL_BILLS" && <AllBillsTab dealerId={dealerId} />}

      <SecurityRefundModal
        open={refundModalOpen}
        amount={Number(
          refundData?.securityAmount ?? dealer?.securityAmount ?? 0,
        )}
        loading={refundSubmitting}
        onClose={() => setRefundModalOpen(false)}
        onSubmit={handleRefundSubmit}
      />
    </div>
  );
}
