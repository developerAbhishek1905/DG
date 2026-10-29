import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  History,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DealerPicker from "./DealerPicker";
import {
  createAdjustment,
  createCreditNote,
  createReceipts,
  createSecurityDeposit,
  getDealerAccountContext,
  refundDealerSecurity,
  type AccountDealer,
  type AccountPaymentMode,
  type BillRefKind,
  type DealerAccountContext,
  type RefundPaymentMode,
} from "../services/ledgerApi";

type Tab = "RECEIPT" | "ADJUSTMENTS" | "CREDIT_NOTE" | "SECURITY_DEPOSIT";

type AllocationType = "" | BillRefKind;

type Row = {
  id: number;
  type: AllocationType;
  refId: string;
  amount: string;
};

type ReceiptRow = {
  id: number;
  dealer: AccountDealer | null;
  amount: string;
  reference: string;
};

type HistoryEntry = {
  id: number;
  tab: Tab;
  dealer: string;
  amount: number;
  detail: string;
  date: string;
};

const PAYMENT_MODES: { value: AccountPaymentMode; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "UPI", label: "UPI" },
  { value: "NET_BANKING", label: "Net Banking" },
  { value: "CHEQUE", label: "Cheque" },
];

const REFUND_MODES: RefundPaymentMode[] = [
  "CASH",
  "UPI",
  "BANK_TRANSFER",
  "CHEQUE",
];

const format = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const roundAmount = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const today = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

let nextId = 1;

const makeRow = (): Row => ({
  id: nextId++,
  type: "",
  refId: "",
  amount: "",
});

const makeReceiptRow = (): ReceiptRow => ({
  id: nextId++,
  dealer: null,
  amount: "",
  reference: "",
});

const input =
  "h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-2.5 text-xs text-gray-800 outline-none transition focus:border-blue-700 focus:ring-1 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400";

const label = "mb-1 block text-xs font-medium text-gray-600";

const receiptColumns =
  "grid grid-cols-[28px_minmax(240px,1.4fr)_120px_130px_minmax(160px,1fr)_32px] items-center gap-2";

const allocationColumns =
  "grid grid-cols-[28px_145px_minmax(190px,1fr)_115px_125px_32px] items-center gap-2";

const tabOptions: { key: Tab; label: string }[] = [
  { key: "RECEIPT", label: "Receipt" },
  { key: "ADJUSTMENTS", label: "Adjustments" },
  { key: "CREDIT_NOTE", label: "Credit Note" },
  { key: "SECURITY_DEPOSIT", label: "Security Deposit" },
];

const tabTitle: Record<Tab, string> = {
  RECEIPT: "Receipt Details",
  ADJUSTMENTS: "Adjustment Details",
  CREDIT_NOTE: "Credit Note Details",
  SECURITY_DEPOSIT: "Security Deposit Details",
};

export default function AddLedgerEntryPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("RECEIPT");
  const [date, setDate] = useState(today());
  const [paymentMode, setPaymentMode] = useState<AccountPaymentMode>("UPI");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  // Receipt tab (many dealers)
  const [receiptRows, setReceiptRows] = useState<ReceiptRow[]>([
    makeReceiptRow(),
  ]);

  // Single dealer tabs
  const [dealer, setDealer] = useState<AccountDealer | null>(null);
  const [context, setContext] = useState<DealerAccountContext | null>(null);
  const [contextLoading, setContextLoading] = useState(false);

  // Adjustments
  const [receiptId, setReceiptId] = useState("");
  const [rows, setRows] = useState<Row[]>([makeRow()]);

  // Credit note
  const [creditNoteRefType, setCreditNoteRefType] =
    useState<BillRefKind>("BILL_REF");
  const [creditNoteBillId, setCreditNoteBillId] = useState("");
  const [creditReason, setCreditReason] = useState("RATE_DIFFERENCE");

  // Security deposit
  const [securityAction, setSecurityAction] = useState<"RECEIVE" | "REFUND">(
    "RECEIVE",
  );

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const bills = context?.bills ?? [];
  const receipts = context?.receipts ?? [];

  const total = Number(amount) || 0;

  /*
  |--------------------------------------------------------------------------
  | Dealer context (unpaid bills + receipts with a balance)
  |--------------------------------------------------------------------------
  */

  const loadContext = useCallback(async (dealerId: string) => {
    try {
      setContextLoading(true);
      setContext(await getDealerAccountContext(dealerId));
    } catch (error) {
      setContext(null);
      toast.error(errorMessage(error, "Failed to load dealer account"));
    } finally {
      setContextLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "RECEIPT" || !dealer) {
      setContext(null);
      return;
    }

    loadContext(dealer.dealerId);
  }, [tab, dealer, loadContext]);

  /*
  |--------------------------------------------------------------------------
  | Receipt tab
  |--------------------------------------------------------------------------
  */

  const receiptBatchTotal = roundAmount(
    receiptRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
  );

  const selectedReceiptDealerIds = receiptRows
    .map((row) => row.dealer?.dealerId)
    .filter((id): id is string => Boolean(id));

  const setReceiptRow = (id: number, patch: Partial<ReceiptRow>) => {
    setReceiptRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const handleReceiptAmountChange = (id: number, value: string) => {
    if (value !== "" && !/^\d*\.?\d{0,2}$/.test(value)) return;
    setReceiptRow(id, { amount: value });
  };

  /*
  |--------------------------------------------------------------------------
  | Adjustments
  |--------------------------------------------------------------------------
  */

  const selectedReceipt = receipts.find((item) => item._id === receiptId);

  const receiptAvailable = selectedReceipt?.availableAmount ?? 0;

  const allocated = useMemo(
    () =>
      roundAmount(
        rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
      ),
    [rows],
  );

  // Part or all of the receipt can be used — the user decides
  const remaining = roundAmount(receiptAvailable - allocated);

  const fullyAllocated = receiptAvailable > 0 && remaining === 0;

  const setRow = (id: number, patch: Partial<Row>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const getAvailableForRow = (currentRows: Row[], rowId: number) => {
    const allocatedElsewhere = currentRows.reduce(
      (sum, row) => sum + (row.id === rowId ? 0 : Number(row.amount) || 0),
      0,
    );

    return Math.max(0, roundAmount(receiptAvailable - allocatedElsewhere));
  };

  const findBill = (row: Row) =>
    bills.find((bill) => bill._id === row.refId && bill.kind === row.type);

  const getMaxPayable = (row: Row, currentRows: Row[]) => {
    const available = getAvailableForRow(currentRows, row.id);
    const selectedBill = findBill(row);

    return selectedBill
      ? Math.min(selectedBill.remainingAmount, available)
      : available;
  };

  const handleAllocationAmountChange = (rowId: number, value: string) => {
    if (value === "") {
      setRow(rowId, { amount: "" });
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(value)) return;

    const entered = Number(value);

    if (!Number.isFinite(entered) || entered < 0) return;

    const currentRow = rows.find((row) => row.id === rowId);

    if (!currentRow) return;

    const maxPayable = getMaxPayable(currentRow, rows);

    if (entered > maxPayable) {
      toast.warning(`Maximum payable amount is ${format(maxPayable)}`);
      return;
    }

    setRow(rowId, { amount: value });
  };

  const handleAddDebitRow = () => {
    if (remaining <= 0 || !selectedReceipt) return;

    setRows((prev) => [...prev, makeRow()]);
  };

  /*
  |--------------------------------------------------------------------------
  | Credit note
  |--------------------------------------------------------------------------
  */

  const creditNoteBills = bills.filter((bill) => bill.kind === creditNoteRefType);

  const selectedCreditNoteBill = creditNoteBills.find(
    (bill) => bill._id === creditNoteBillId,
  );

  const creditNoteAmount = tab === "CREDIT_NOTE" ? total : 0;

  const creditNoteRemaining = selectedCreditNoteBill
    ? roundAmount(selectedCreditNoteBill.remainingAmount - creditNoteAmount)
    : 0;

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

  const reset = () => {
    setDate(today());
    setAmount("");
    setReference("");
    setRemarks("");
    setRows([makeRow()]);
    setReceiptRows([makeReceiptRow()]);
    setReceiptId("");
    setCreditNoteBillId("");
    setCreditNoteRefType("BILL_REF");
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    setDealer(null);
    setContext(null);
    setSecurityAction("RECEIVE");
    reset();
  };

  const addHistory = (entries: Omit<HistoryEntry, "id">[]) => {
    setHistory((prev) => [
      ...entries.map((entry, index) => ({
        ...entry,
        id: Date.now() + index,
      })),
      ...prev,
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const saveReceipts = async () => {
    if (!date) {
      toast.error("Select a date");
      return;
    }

    if (!receiptRows.length) {
      toast.error("Add at least one dealer");
      return;
    }

    if (
      receiptRows.some((row) => !row.dealer || !(Number(row.amount) > 0))
    ) {
      toast.error("Select a dealer and enter a positive amount in every row");
      return;
    }

    await createReceipts({
      date,
      paymentMode,
      receipts: receiptRows.map((row) => ({
        dealerId: row.dealer!.dealerId,
        amount: Number(row.amount),
        reference: row.reference.trim(),
        remark: remarks.trim(),
      })),
    });

    addHistory(
      receiptRows.map((row) => ({
        tab: "RECEIPT" as Tab,
        dealer: row.dealer!.dealerName,
        amount: Number(row.amount),
        date,
        detail: paymentMode.replaceAll("_", " "),
      })),
    );

    toast.success(`${receiptRows.length} receipt(s) recorded`);
    reset();
  };

  const saveAdjustment = async () => {
    if (!dealer || !selectedReceipt) {
      toast.error("Select a dealer and a receipt to adjust");
      return;
    }

    if (allocated <= 0 || allocated > receiptAvailable + 0.001) {
      toast.error(
        `Allocate an amount up to the receipt balance (${format(receiptAvailable)})`,
      );
      return;
    }

    if (
      rows.some(
        (row) =>
          !row.type || !row.refId || !(Number(row.amount) > 0),
      )
    ) {
      toast.error("Complete every row with a bill and a positive amount");
      return;
    }

    const refs = rows.map((row) => row.refId);

    if (new Set(refs).size !== refs.length) {
      toast.error("The same bill cannot be selected twice");
      return;
    }

    await createAdjustment({
      receiptId: selectedReceipt._id,
      date,
      remark: remarks.trim(),
      allocations: rows.map((row) => ({
        ledgerId: row.refId,
        amount: Number(row.amount),
      })),
    });

    addHistory([
      {
        tab: "ADJUSTMENTS",
        dealer: dealer.dealerName,
        amount: allocated,
        date,
        detail: `${selectedReceipt.entryNumber} · ${rows.length} bills`,
      },
    ]);

    toast.success("Adjustment saved");
    reset();
    await loadContext(dealer.dealerId);
  };

  const saveCreditNote = async () => {
    if (!dealer || !selectedCreditNoteBill) {
      toast.error("Please select a bill");
      return;
    }

    if (creditNoteAmount <= 0) {
      toast.error("Enter a valid Credit Note amount");
      return;
    }

    if (creditNoteAmount > selectedCreditNoteBill.remainingAmount + 0.001) {
      toast.error(
        `Credit Note cannot exceed ${format(selectedCreditNoteBill.remainingAmount)}`,
      );
      return;
    }

    await createCreditNote({
      dealerId: dealer.dealerId,
      ledgerId: selectedCreditNoteBill._id,
      amount: creditNoteAmount,
      date,
      reason: creditReason,
      remark: remarks.trim(),
    });

    addHistory([
      {
        tab: "CREDIT_NOTE",
        dealer: dealer.dealerName,
        amount: creditNoteAmount,
        date,
        detail: `${selectedCreditNoteBill.complaintNumber} · ${creditReason}`,
      },
    ]);

    toast.success("Credit note saved");
    reset();
    await loadContext(dealer.dealerId);
  };

  const saveSecurityDeposit = async () => {
    if (!dealer) {
      toast.error("Select a dealer");
      return;
    }

    if (securityAction === "REFUND") {
      if (!REFUND_MODES.includes(paymentMode as RefundPaymentMode)) {
        toast.error("Select Cash, UPI, Bank Transfer or Cheque for a refund");
        return;
      }

      const refund = await refundDealerSecurity(dealer.dealerId, {
        paymentMode: paymentMode as RefundPaymentMode,
        transactionReference: reference.trim(),
        remark: remarks.trim(),
      });

      addHistory([
        {
          tab: "SECURITY_DEPOSIT",
          dealer: dealer.dealerName,
          amount: refund.refundAmount,
          date,
          detail: "REFUND",
        },
      ]);

      toast.success("Security deposit refunded");
    } else {
      if (!(total > 0)) {
        toast.error("Enter a valid amount");
        return;
      }

      await createSecurityDeposit({
        dealerId: dealer.dealerId,
        amount: total,
        date,
        paymentMode,
        reference: reference.trim(),
        remark: remarks.trim(),
      });

      addHistory([
        {
          tab: "SECURITY_DEPOSIT",
          dealer: dealer.dealerName,
          amount: total,
          date,
          detail: "RECEIVE",
        },
      ]);

      toast.success("Security deposit recorded");
    }

    reset();
    await loadContext(dealer.dealerId);
  };

  const save = async () => {
    if (saving) return;

    try {
      setSaving(true);

      if (tab === "RECEIPT") await saveReceipts();
      else if (tab === "ADJUSTMENTS") await saveAdjustment();
      else if (tab === "CREDIT_NOTE") await saveCreditNote();
      else await saveSecurityDeposit();
    } catch (error) {
      toast.error(errorMessage(error, "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  const showDealerPicker = tab !== "RECEIPT";

  return (
    <div className="flex min-h-screen flex-col gap-2 pb-3 lg:h-[calc(100dvh-24px)] lg:min-h-0 lg:overflow-hidden lg:pb-0">
      {/* PAGE HEADER */}
      <div className="flex shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-gray-200 bg-white p-2 hover:bg-gray-50"
          >
            <ArrowLeft size={15} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Dealer Transactions
            </h1>

            <p className="text-xs text-gray-500">
              Receipts, adjustments, credit notes and security deposits
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHistory(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <History size={14} />
          <span className="hidden sm:inline">History</span>
          {history.length > 0 && (
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px]">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* TABS */}
      <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-gray-200 pb-1.5">
        {tabOptions.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => switchTab(item.key)}
            className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              tab === item.key
                ? "bg-[#6D28D9] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TRANSACTION DETAILS */}
      <div className="shrink-0 rounded-lg border border-gray-200 bg-white p-3">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">
          {tabTitle[tab]}
        </h2>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {/* DEALER */}
          {showDealerPicker && (
            <div>
              <label className={label}>Select Dealer *</label>

              <DealerPicker
                value={dealer}
                onChange={(next) => {
                  setDealer(next);
                  setReceiptId("");
                  setCreditNoteBillId("");
                  setRows([makeRow()]);
                  setAmount("");
                }}
                className={input}
              />
            </div>
          )}

          {/* DATE */}
          <div>
            <label className={label}>Date *</label>

            <input
              className={input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* PAYMENT MODE */}
          {(tab === "RECEIPT" || tab === "SECURITY_DEPOSIT") && (
            <div>
              <label className={label}>Transaction Type *</label>

              <select
                className={input}
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(e.target.value as AccountPaymentMode)
                }
              >
                {PAYMENT_MODES.filter(
                  (mode) =>
                    !(
                      tab === "SECURITY_DEPOSIT" &&
                      securityAction === "REFUND" &&
                      !REFUND_MODES.includes(mode.value as RefundPaymentMode)
                    ),
                ).map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* RECEIPT TO ADJUST */}
          {tab === "ADJUSTMENTS" && (
            <div className="md:col-span-2">
              <label className={label}>Select Receipt / Payment *</label>

              <select
                className={input}
                disabled={!dealer || contextLoading}
                value={receiptId}
                onChange={(e) => {
                  setReceiptId(e.target.value);
                  setRows([makeRow()]);
                  setAmount("");
                }}
              >
                <option value="">
                  {!dealer
                    ? "Select a dealer first"
                    : receipts.length
                      ? "Select dealer receipt"
                      : "No unadjusted receipts for this dealer"}
                </option>

                {receipts.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.entryNumber} · {item.paymentMode.replaceAll("_", " ")}{" "}
                    · {item.date.slice(0, 10)} — Available{" "}
                    {format(item.availableAmount)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CREDIT REASON */}
          {tab === "CREDIT_NOTE" && (
            <div>
              <label className={label}>Credit Reason</label>

              <select
                className={input}
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
              >
                <option value="RATE_DIFFERENCE">Rate Difference</option>
                <option value="BILL_REVERSAL">Bill Reversal</option>
                <option value="SERVICE_ADJUSTMENT">Service Adjustment</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          )}

          {/* SECURITY ACTION */}
          {tab === "SECURITY_DEPOSIT" && (
            <div>
              <label className={label}>Action</label>

              <select
                className={input}
                value={securityAction}
                onChange={(e) => {
                  const next = e.target.value as "RECEIVE" | "REFUND";

                  setSecurityAction(next);

                  if (
                    next === "REFUND" &&
                    !REFUND_MODES.includes(paymentMode as RefundPaymentMode)
                  ) {
                    setPaymentMode("BANK_TRANSFER");
                  }
                }}
              >
                <option value="RECEIVE">Receive Deposit</option>
                <option value="REFUND">Refund Deposit</option>
              </select>
            </div>
          )}

          {/* AMOUNT */}
          {(tab === "ADJUSTMENTS" ||
            (tab === "SECURITY_DEPOSIT" && securityAction === "RECEIVE")) && (
            <div>
              <label className={label}>
                {tab === "ADJUSTMENTS" ? "Adjusting (₹)" : "Amount (₹) *"}
              </label>

              <input
                className={input}
                type="number"
                min="0.01"
                step="0.01"
                readOnly={tab === "ADJUSTMENTS"}
                placeholder={tab === "ADJUSTMENTS" ? "Sum of bill rows" : ""}
                value={tab === "ADJUSTMENTS" ? (allocated ? String(allocated) : "") : amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          )}

          {/* REFERENCE */}
          {tab === "SECURITY_DEPOSIT" && (
            <div className="md:col-span-2">
              <label className={label}>Reference / UTR / Cheque No.</label>

              <input
                className={input}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Optional reference number"
              />
            </div>
          )}
        </div>

        {/* DEALER SUMMARY */}
        {tab !== "RECEIPT" && dealer && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
            <span className="font-medium">{dealer.dealerName}</span>

            {contextLoading || !context ? (
              <span className="text-gray-400">Loading account...</span>
            ) : (
              <>
                <span>
                  Outstanding: <strong>{format(context.dealer.outstanding)}</strong>
                </span>

                {context.dealer.creditBalance > 0 && (
                  <span>
                    Credit: <strong>{format(context.dealer.creditBalance)}</strong>
                  </span>
                )}

                <span>
                  Security: <strong>{format(context.dealer.securityAmount)}</strong>
                </span>

                {tab === "ADJUSTMENTS" && selectedReceipt && (
                  <span>
                    Receipt Balance: <strong>{format(receiptAvailable)}</strong>
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* RECEIPT — MULTI DEALER */}
      {tab === "RECEIPT" && (
        <section className="flex min-h-[250px] flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white lg:min-h-0">
          <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-3 py-2">
            <h2 className="text-sm font-semibold text-green-700">
              Dealer Receipts
            </h2>

            <strong className="text-sm text-green-700">
              {format(receiptBatchTotal)}
            </strong>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <div className="min-w-[780px]">
              <div
                className={`${receiptColumns} sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-2 py-2 text-[11px] font-semibold uppercase text-gray-500`}
              >
                <span>#</span>
                <span>Dealer</span>
                <span>Outstanding</span>
                <span>Amount (₹)</span>
                <span>Reference / UTR</span>
                <span>Action</span>
              </div>

              <div className="divide-y divide-gray-100">
                {receiptRows.map((row, index) => (
                  <div
                    key={row.id}
                    className={`${receiptColumns} px-2 py-1.5 transition-colors hover:bg-gray-50`}
                  >
                    <span className="text-xs text-gray-500">{index + 1}</span>

                    <DealerPicker
                      value={row.dealer}
                      onChange={(next) => setReceiptRow(row.id, { dealer: next })}
                      excludeIds={selectedReceiptDealerIds}
                      className={input}
                    />

                    <span className="text-xs font-semibold text-gray-700">
                      {row.dealer ? format(row.dealer.outstanding) : "—"}
                    </span>

                    <input
                      className={input}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={row.amount}
                      onChange={(e) =>
                        handleReceiptAmountChange(row.id, e.target.value)
                      }
                    />

                    <input
                      className={input}
                      value={row.reference}
                      onChange={(e) =>
                        setReceiptRow(row.id, { reference: e.target.value })
                      }
                      placeholder="Optional"
                    />

                    <button
                      type="button"
                      title="Remove dealer"
                      onClick={() =>
                        setReceiptRows((prev) =>
                          prev.filter((item) => item.id !== row.id),
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {receiptRows.length === 0 && (
                <div className="px-3 py-8 text-center text-xs text-gray-400">
                  No dealers added.
                </div>
              )}

              {/* room for the dealer dropdown on the last row */}
              <div className="h-56" />
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setReceiptRows((prev) => [...prev, makeReceiptRow()])
                }
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-200 px-3 text-xs font-semibold text-blue-800 hover:bg-blue-50"
              >
                <Plus size={14} />
                Add Dealer
              </button>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700">
                <span>
                  Dealers: <strong>{receiptRows.length}</strong>
                </span>

                <span>
                  Total Received: <strong>{format(receiptBatchTotal)}</strong>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ADJUSTMENT ALLOCATIONS */}
      {tab === "ADJUSTMENTS" && (
        <section className="flex min-h-[250px] flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white lg:min-h-0">
          <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-3 py-2">
            <h2 className="text-sm font-semibold text-red-700">
              Bill Adjustments
            </h2>

            <strong className="text-sm text-red-700">{format(allocated)}</strong>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <div className="min-w-[760px]">
              <div
                className={`${allocationColumns} sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-2 py-2 text-[11px] font-semibold uppercase text-gray-500`}
              >
                <span>#</span>
                <span>Allocation Type</span>
                <span>Bill Reference</span>
                <span>Amount</span>
                <span>Maximum Payable</span>
                <span>Action</span>
              </div>

              <div className="divide-y divide-gray-100">
                {rows.map((row, index) => {
                  const bill = findBill(row);
                  const options = bills.filter((item) => item.kind === row.type);
                  const maxPayable = getMaxPayable(row, rows);

                  return (
                    <div
                      key={row.id}
                      className={`${allocationColumns} px-2 py-1.5 transition-colors hover:bg-gray-50`}
                    >
                      <span className="text-xs text-gray-500">{index + 1}</span>

                      <select
                        className={input}
                        disabled={!selectedReceipt}
                        value={row.type}
                        onChange={(e) =>
                          setRow(row.id, {
                            type: e.target.value as AllocationType,
                            refId: "",
                            amount: "",
                          })
                        }
                      >
                        <option value="" disabled>
                          Select Type
                        </option>
                        <option value="DUMMY_BILL_REF">Dummy Bill Ref</option>
                        <option value="BILL_REF">Bill Ref</option>
                      </select>

                      <select
                        className={input}
                        disabled={!row.type}
                        value={row.refId}
                        onChange={(e) =>
                          setRow(row.id, { refId: e.target.value, amount: "" })
                        }
                      >
                        <option value="">Select Outstanding Bill</option>

                        {options.map((item) => (
                          <option
                            key={item._id}
                            value={item._id}
                            disabled={rows.some(
                              (other) =>
                                other.id !== row.id && other.refId === item._id,
                            )}
                          >
                            {item.complaintNumber}
                            {item.customerName ? ` · ${item.customerName}` : ""}
                            {item.productName ? ` · ${item.productName}` : ""} —{" "}
                            {format(item.remainingAmount)}
                          </option>
                        ))}
                      </select>

                      <input
                        className={input}
                        type="number"
                        min="0"
                        max={maxPayable}
                        step="0.01"
                        placeholder="0.00"
                        value={row.amount}
                        onChange={(e) =>
                          handleAllocationAmountChange(row.id, e.target.value)
                        }
                      />

                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-gray-700">
                          {format(maxPayable)}
                        </span>

                        {bill && (
                          <p className="text-[10px] text-gray-400">
                            Due: {format(bill.remainingAmount)}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        title="Remove allocation"
                        onClick={() =>
                          setRows((prev) =>
                            prev.filter((item) => item.id !== row.id),
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {rows.length === 0 && (
                <div className="px-3 py-8 text-center text-xs text-gray-400">
                  No allocations added.
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleAddDebitRow}
                disabled={remaining <= 0 || !selectedReceipt}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-200 px-3 text-xs font-semibold text-blue-800 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <Plus size={14} />
                {fullyAllocated ? "Fully Allocated" : "Add Debit Row"}
              </button>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700">
                <span>
                  Receipt Balance: <strong>{format(receiptAvailable)}</strong>
                </span>

                <span>
                  Adjusting: <strong>{format(allocated)}</strong>
                </span>

                <span>
                  Balance Left:{" "}
                  <strong
                    className={
                      remaining === 0
                        ? "text-green-700"
                        : remaining < 0
                          ? "text-red-700"
                          : "text-amber-700"
                    }
                  >
                    {format(remaining)}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CREDIT NOTE */}
      {tab === "CREDIT_NOTE" && (
        <section className="flex min-h-0 flex-1 flex-col rounded-lg border border-gray-200 bg-white p-3">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Credit Note Settlement
          </h2>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className={label}>Reference Type *</label>

              <select
                className={input}
                value={creditNoteRefType}
                onChange={(e) => {
                  setCreditNoteRefType(e.target.value as BillRefKind);
                  setCreditNoteBillId("");
                }}
              >
                <option value="BILL_REF">Bill Ref</option>
                <option value="DUMMY_BILL_REF">Dummy Bill Ref</option>
              </select>
            </div>

            <div>
              <label className={label}>Select Bill *</label>

              <select
                className={input}
                disabled={!dealer || contextLoading}
                value={creditNoteBillId}
                onChange={(e) => setCreditNoteBillId(e.target.value)}
              >
                <option value="">
                  {dealer ? "Select Outstanding Bill" : "Select a dealer first"}
                </option>

                {creditNoteBills.map((bill) => (
                  <option key={bill._id} value={bill._id}>
                    {bill.complaintNumber}
                    {bill.customerName ? ` · ${bill.customerName}` : ""} —{" "}
                    {format(bill.remainingAmount)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={label}>Credit Note Amount (₹) *</label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                max={selectedCreditNoteBill?.remainingAmount ?? 0}
                className={input}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter credit amount"
              />
            </div>
          </div>

          {selectedCreditNoteBill && (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Bill Outstanding</p>
                <p className="mt-1 text-base font-semibold">
                  {format(selectedCreditNoteBill.remainingAmount)}
                </p>
              </div>

              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs text-blue-700">Credit Note Settlement</p>
                <p className="mt-1 text-base font-semibold text-blue-900">
                  {format(creditNoteAmount)}
                </p>
              </div>

              <div className="rounded-md bg-green-50 p-3">
                <p className="text-xs text-green-700">Remaining Bill Payable</p>
                <p
                  className={`mt-1 text-base font-semibold ${
                    creditNoteRemaining < 0 ? "text-red-700" : "text-green-800"
                  }`}
                >
                  {format(creditNoteRemaining)}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECURITY DEPOSIT */}
      {tab === "SECURITY_DEPOSIT" && (
        <section className="flex min-h-[120px] flex-1 flex-col rounded-lg border border-gray-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-gray-900">
            {securityAction === "RECEIVE"
              ? "Receive Security Deposit"
              : "Refund Security Deposit"}
          </h2>

          <p className="mt-2 text-xs text-gray-600">
            {securityAction === "RECEIVE"
              ? "The amount is added to the dealer's security balance."
              : "The full security balance is refunded if the dealer is eligible (leaving date and refund rules are checked by the server)."}
          </p>

          <p className="mt-3 text-xl font-bold text-gray-900">
            {securityAction === "RECEIVE"
              ? format(total)
              : context
                ? format(context.dealer.securityAmount)
                : format(0)}
          </p>
        </section>
      )}

      {/* FIXED BOTTOM ACTION BAR */}
      <div className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[200px] flex-1">
            <input
              className={input}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Remarks (optional)"
            />
          </div>

          <button
            type="button"
            onClick={reset}
            disabled={saving}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#6D28D9] px-4 text-xs font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={14} />
            {saving
              ? "Saving..."
              : tab === "RECEIPT"
                ? "Save Receipts"
                : tab === "ADJUSTMENTS"
                  ? "Save Adjustment"
                  : tab === "CREDIT_NOTE"
                    ? "Save Credit Note"
                    : securityAction === "REFUND"
                      ? "Refund Deposit"
                      : "Save Deposit"}
          </button>
        </div>
      </div>

      {/* HISTORY MODAL */}
      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowHistory(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Saved this session"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Saved This Session
                </h2>

                <p className="text-xs text-gray-500">
                  {history.length} entries saved
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-auto p-3">
              {history.length === 0 ? (
                <div className="py-10 text-center text-xs text-gray-500">
                  Nothing saved in this session yet.
                </div>
              ) : (
                <table className="w-full min-w-[650px] text-left text-xs">
                  <thead className="sticky top-0 bg-gray-50 text-[11px] uppercase text-gray-600">
                    <tr>
                      {["Date", "Dealer", "Type", "Details", "Amount"].map(
                        (heading) => (
                          <th key={heading} className="px-3 py-2">
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {history.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{entry.date}</td>
                        <td className="px-3 py-2">{entry.dealer}</td>
                        <td className="px-3 py-2">
                          {entry.tab.replaceAll("_", " ")}
                        </td>
                        <td className="px-3 py-2">{entry.detail}</td>
                        <td className="px-3 py-2 font-semibold">
                          {format(entry.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
