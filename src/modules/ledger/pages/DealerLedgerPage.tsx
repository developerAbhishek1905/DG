import {
  ArrowLeft,
  Building2,
  Phone,
  ReceiptText,
  CreditCard,
  MapPin,
  RotateCcw,
  ShieldCheck
} from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import LedgerFilters from "../components/LedgerFilters";
import LedgerSummary from "../components/LedgerSummary";
import BillsTable from "../components/BillsTable";
import PaymentsTable from "../components/PaymentsTable";
import type { Dealer } from "../../dealers/types/dealer.types";
import { getAllDealerLedgers, getDealerPayments } from "../services/ledgerApi";
// import {  } from "../../payments/services/paymentApi";
// getDealerPayments
import type {
  DealerLedgerSummary,
  LedgerTransaction,
} from "../types/ledger.types";

import type { DealerPayment } from "../../payments/types/payment.types";

import { useDebounce } from "../../../hooks/useDebounce";
import { getDealerById } from "../../dealers/services/dealerApi";
// import { getDealerPayments } from "../services/ledgerApi";

import { toast } from "react-toastify";

import SecurityRefundModal from "../components/SecurityRefundModal";

import {
  getDealerSecurityRefunds,
  refundDealerSecurity,
} from "../services/ledgerApi";

import type {
  DealerSecurityRefundData,
  RefundSecurityPayload,
} from "../services/ledgerApi";

/* =====================================================
   TYPES
===================================================== */

type LedgerTab = "BILLS" | "PAYMENTS";

interface LedgerFilterValues {
  search: string;
  transactionType: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

const initialFilters: LedgerFilterValues = {
  search: "",
  transactionType: "ALL",
  status: "ALL",
  dateFrom: "",
  dateTo: "",
};

/* =====================================================
   COMPONENT
===================================================== */

export default function DealerLedgerPage() {
  const navigate = useNavigate();

  const { dealerId } = useParams<{
    dealerId: string;
  }>();

  /* =======================
     TAB
  ======================= */

  const [activeTab, setActiveTab] = useState<LedgerTab>("BILLS");

  /* =======================
     FILTERS
  ======================= */

  const [filters, setFilters] = useState<LedgerFilterValues>({
    ...initialFilters,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  /* =======================
     DATA
  ======================= */

  const [summary, setSummary] = useState<DealerLedgerSummary | null>(null);

  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);

  const [payments, setPayments] = useState<DealerPayment[]>([]);

  /* =======================
     LOADING & ERROR
  ======================= */

  const [billsLoading, setBillsLoading] = useState(false);

  const [paymentsLoading, setPaymentsLoading] = useState(false);

  const [billsError, setBillsError] = useState<string | null>(null);

  const [paymentsError, setPaymentsError] = useState<string | null>(null);

  /* =======================
     PAGINATION
  ======================= */

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dealer, setDealer] = useState<Dealer | null>(null);
const [dealerLoading, setDealerLoading] = useState(false);
const [dealerError, setDealerError] = useState<string | null>(null);

const [refundData, setRefundData] =
  useState<DealerSecurityRefundData | null>(null);

const [refundLoading, setRefundLoading] = useState(false);
const [refundSubmitting, setRefundSubmitting] = useState(false);
const [refundModalOpen, setRefundModalOpen] = useState(false);

  /*
   * Prevent stale requests from overwriting
   * data after tab/filter changes.
   */

  const billsRequestId = useRef(0);
  const paymentsRequestId = useRef(0);

  const loading = activeTab === "BILLS" ? billsLoading : paymentsLoading;

  const error = activeTab === "BILLS" ? billsError : paymentsError;

  /* =====================================================
     LOAD BILLS
  ===================================================== */

  const loadDealerLedger = useCallback(async () => {
    if (!dealerId) return;

    const requestId = ++billsRequestId.current;

    try {
      setBillsLoading(true);
      setBillsError(null);

      console.log("CALLING BILLS API", {
        dealerId,
        page,
        limit,
      });

      const response = await getAllDealerLedgers({
        dealerId,

        search: debouncedSearch || undefined,

        transactionType:
          filters.transactionType === "ALL"
            ? undefined
            : filters.transactionType,

        status: filters.status === "ALL" ? undefined : filters.status,

        fromDate: filters.dateFrom || undefined,
        toDate: filters.dateTo || undefined,

        page,
        limit,
      });

      if (requestId !== billsRequestId.current) {
        return;
      }

      console.log("BILLS API RESPONSE:", response);

      setTransactions(Array.isArray(response.data) ? response.data : []);

      setTotal(response.pagination?.total ?? 0);
      setTotalPages(response.pagination?.totalPages ?? 0);

      if (response.summary) {
        setSummary(response.summary);
      }
    } catch (err) {
      if (requestId !== billsRequestId.current) {
        return;
      }

      console.error("BILLS API ERROR:", err);

      setBillsError("Failed to load dealer bills.");
      setTransactions([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      if (requestId === billsRequestId.current) {
        setBillsLoading(false);
      }
    }
  }, [
    dealerId,
    debouncedSearch,
    filters.transactionType,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
    page,
    limit,
  ]);

  /* =====================================================
     LOAD PAYMENTS
  ===================================================== */

  const loadDealerPayments = useCallback(async () => {
    console.log("PAYMENT FUNCTION EXECUTED");
    console.log("DEALER ID:", dealerId);

    if (!dealerId) {
      setPaymentsError("Dealer ID is missing.");
      return;
    }

    const requestId = ++paymentsRequestId.current;

    try {
      setPaymentsLoading(true);
      setPaymentsError(null);

      console.log("CALLING PAYMENTS API", {
        dealerId,
        page,
        limit,
      });

      /*
       * Payment filters intentionally omitted
       * during initial debugging.
       * Once fetching works, add paymentMode,
       * status and date filters here.
       */

      const response = await getDealerPayments({
        dealerId,
        page,
        limit,
      });

      if (requestId !== paymentsRequestId.current) {
        return;
      }

      console.log("PAYMENTS API RESPONSE:", response);

      const paymentData = Array.isArray(response.data) ? response.data : [];

      setPayments(paymentData);

      setTotal(response.pagination?.total ?? 0);
      setTotalPages(response.pagination?.totalPages ?? 0);
    } catch (err) {
      if (requestId !== paymentsRequestId.current) {
        return;
      }

      console.error("PAYMENTS API ERROR:", err);

      setPaymentsError("Failed to load dealer payments.");

      setPayments([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      if (requestId === paymentsRequestId.current) {
        setPaymentsLoading(false);
      }
    }
  }, [dealerId, page, limit]);

  /* =====================================================
     FETCH ON TAB / FILTER / PAGE CHANGE
  ===================================================== */

  useEffect(() => {
    console.log("ACTIVE TAB:", activeTab);

    /*
     * Invalidate requests belonging to
     * the inactive tab.
     */

    if (activeTab === "BILLS") {
      paymentsRequestId.current += 1;
      setPaymentsLoading(false);

      void loadDealerLedger();
    } else {
      billsRequestId.current += 1;
      setBillsLoading(false);

      void loadDealerPayments();
    }
  }, [activeTab, loadDealerLedger, loadDealerPayments]);

  /*
   * Fetch dealer summary independently of
   * the active tab by using the existing
   * ledger endpoint when necessary.
   */

  useEffect(() => {
    if (!dealerId) return;

    let cancelled = false;

    const loadSummary = async () => {
      try {
        const response = await getAllDealerLedgers({
          dealerId,
          page: 1,
          limit: 1,
        });

        if (!cancelled && response.summary) {
          setSummary(response.summary);
        }
      } catch (err) {
        console.error("FAILED TO LOAD DEALER SUMMARY:", err);
      }
    };

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, [dealerId]);

  useEffect(() => {
    if (!dealerId) return;

    let cancelled = false;

    const loadDealerDetails = async () => {
      try {
        setDealerLoading(true);
        setDealerError(null);

        const response = await getDealerById(dealerId);

        if (cancelled) return;

        console.log("DEALER DETAILS:", response);

        setDealer(response);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch dealer:", error);
        setDealerError("Unable to load dealer information.");
      } finally {
        if (!cancelled) {
          setDealerLoading(false);
        }
      }
    };

    void loadDealerDetails();

    return () => {
      cancelled = true;
    };
  }, [dealerId]);

  const handleRefundAmount = () => {
  if (!dealerId || !dealer) return;

  // Refund modal ya API integration yahan add hogi.
  console.log("Refund requested for dealer:", dealerId);
};

const loadRefundDetails = useCallback(async () => {
  if (!dealerId) return;

  try {
    setRefundLoading(true);

    const response = await getDealerSecurityRefunds(
      dealerId,
    );

    setRefundData(response);
  } catch (error) {
    console.error("Refund details error:", error);
    toast.error("Failed to load refund details");
  } finally {
    setRefundLoading(false);
  }
}, [dealerId]);

useEffect(() => {
  void loadRefundDetails();
}, [loadRefundDetails]);

const handleRefundSubmit = async (
  payload: RefundSecurityPayload,
) => {
  if (!dealerId) return;

  try {
    setRefundSubmitting(true);

    await refundDealerSecurity(dealerId, payload);

    toast.success(
      "Security amount refunded successfully",
    );

    setRefundModalOpen(false);

    await Promise.all([
      loadRefundDetails(),
      loadDealerDetails(),
    ]);
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to refund security amount",
    );
  } finally {
    setRefundSubmitting(false);
  }
};

const loadDealerDetails = useCallback(async () => {
  if (!dealerId) return;

  try {
    setDealerLoading(true);

    const response = await getDealerById(dealerId);

    setDealer(response);
  } catch (error) {
    console.error("Dealer details error:", error);
  } finally {
    setDealerLoading(false);
  }
}, [dealerId]);

useEffect(() => {
  void loadDealerDetails();
}, [loadDealerDetails]);

  /* =====================================================
     TAB CHANGE
  ===================================================== */

  const handleTabChange = (tab: LedgerTab) => {
    console.log("TAB CLICKED:", tab);

    if (activeTab === tab) return;

    setActiveTab(tab);
    setPage(1);
    setTotal(0);
    setTotalPages(0);
    setFilters({ ...initialFilters });
  };

  /* =====================================================
     FILTER CHANGE
  ===================================================== */

  const handleFilterChange = (newFilters: LedgerFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const handleReset = () => {
    setFilters({ ...initialFilters });
    setPage(1);
  };

  /* =====================================================
     UI
  ===================================================== */

  if (!dealerId) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-10 text-center text-sm text-red-600">
        Dealer ID is missing from the URL.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =======================
          BACK
      ======================= */}

      <button
        type="button"
        onClick={() => navigate("/ledger")}
        className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#123B7A]"
      >
        <ArrowLeft size={17} />
        Back to Ledger
      </button>

      {/* =======================
          DEALER HEADER
      ======================= */}
{/* =======================
    DEALER INFORMATION
======================= */}

<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
  <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
    {/* Dealer Profile */}

    <div className="flex min-w-0 items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
        <Building2 size={23} />
      </div>

      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold text-gray-900">
          {dealer?.technicianFirmName ||
            summary?.dealer?.name ||
            "Dealer Ledger"}
        </h1>

        <p className="mt-1 text-xs font-medium text-gray-500">
          {dealer?.headCode ||
            summary?.dealer?.dealerCode ||
            "-"}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600">
          {/* Technician Name */}

          {dealer?.technicianName && (
            <span className="font-medium">
              {dealer.technicianName}
            </span>
          )}

          {/* Mobile */}

          {(dealer?.mobileNumber ||
            summary?.dealer?.phone) && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400" />

              <span>
                {dealer?.mobileNumber ||
                  summary?.dealer?.phone}
              </span>
            </div>
          )}

          {/* City */}

          {summary?.dealer?.city && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400" />

              <span>{summary.dealer.city}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Security Amount + Refund */}

    {/* <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center lg:border-l lg:border-t-0 lg:py-1 lg:pl-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <ShieldCheck size={20} />
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500">
            Security Amount
          </p>

          <p className="mt-0.5 text-xl font-bold text-gray-900">
            {dealerLoading
              ? "Loading..."
              : `₹${Number(
                  dealer?.securityAmount ?? 0,
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRefundAmount}
        disabled={
          dealerLoading ||
          !dealer ||
          Number(dealer.securityAmount ?? 0) <= 0 ||
          true // Remove when refund workflow is implemented
        }
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e3063] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RotateCcw size={16} />
        Refund Amount
      </button>
    </div> */}

    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center lg:border-l lg:border-t-0 lg:py-1 lg:pl-6">
  <div>
    <p className="text-xs font-medium text-gray-500">
      Security Amount
    </p>

    <p className="mt-1 text-xl font-bold text-gray-900">
      ₹{Number(
        refundData?.securityAmount ??
          dealer?.securityAmount ??
          0,
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}
    </p>

    {refundData?.eligibleRefundDate && (
      <p className="mt-1 text-xs text-gray-500">
        Refund eligible from:{" "}
        {new Date(
          refundData.eligibleRefundDate,
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    )}
  </div>

  <button
    type="button"
    onClick={() => setRefundModalOpen(true)}
    disabled={
      refundLoading ||
      refundSubmitting ||
      !refundData?.canRefund
    }
    title={refundData?.reason || "Refund security amount"}
    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e3063] disabled:cursor-not-allowed disabled:opacity-50"
  >
    <RotateCcw size={16} />
    Refund Amount
  </button>
</div>
  </div>

  {/* API Error */}

  {dealerError && (
    <div className="border-t border-red-100 bg-red-50 px-5 py-2.5 text-xs text-red-600">
      {dealerError}
    </div>
  )}
</div>

      {/* =======================
          SUMMARY
      ======================= */}

      {/* {summary && (
        <LedgerSummary summary={summary} />
      )} */}

      {/* =======================
          TABS
      ======================= */}

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-white p-2">
        <button
          type="button"
          onClick={() => handleTabChange("BILLS")}
          className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${
            activeTab === "BILLS"
              ? "bg-[#123B7A] text-white shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ReceiptText size={17} />
          Bills
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("PAYMENTS")}
          className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${
            activeTab === "PAYMENTS"
              ? "bg-[#123B7A] text-white shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <CreditCard size={17} />
          Payments
        </button>
      </div>

      {/* =======================
          BILLS FILTERS
      ======================= */}

      {activeTab === "BILLS" && (
        <LedgerFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />
      )}

      {/* =======================
          ERROR
      ======================= */}

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => {
              if (activeTab === "BILLS") {
                void loadDealerLedger();
              } else {
                void loadDealerPayments();
              }
            }}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* =======================
          TABLES
      ======================= */}

      {activeTab === "BILLS" ? (
        <BillsTable transactions={transactions} loading={billsLoading} />
      ) : (
        <PaymentsTable payments={payments} loading={paymentsLoading} />
      )}

      {/* =======================
          PAGINATION
      ======================= */}

      {!loading && total > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            Showing {(page - 1) * limit + 1}
            {" - "}
            {Math.min(page * limit, total)} of {total}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-2 py-2 text-xs"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="whitespace-nowrap px-2 text-xs font-medium text-gray-600">
              Page {page} of {totalPages || 1}
            </span>

            <button
              type="button"
              disabled={totalPages === 0 || page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
