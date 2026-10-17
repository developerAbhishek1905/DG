import { useMemo, useState } from "react";
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

type Tab = "RECEIPT" | "CREDIT_NOTE" | "SECURITY_DEPOSIT";

type TransactionType = "CASH" | "BANK" | "UPI" | "NET_BANKING" | "CHEQUE";

type AllocationType =
  | ""
  | "ON_ACCOUNT"
  | "ADVANCE"
  | "DUMMY_BILL_REF"
  | "BILL_REF";

type Row = {
  id: number;
  type: AllocationType;
  refId: string;
  amount: string;
};

type Bill = {
  id: string;
  dealerId: string;
  label: string;
  outstanding: number;
  kind: "DUMMY_BILL_REF" | "BILL_REF";
};

type Dealer = {
  id: string;
  code: string;
  name: string;
  outstanding: number;
  security: number;
};

type HistoryEntry = {
  id: number;
  tab: Tab;
  dealer: string;
  amount: number;
  detail: string;
  date: string;
};

const dealers: Dealer[] = [
  {
    id: "d1",
    code: "HEAD0035",
    name: "IPS Service Center",
    outstanding: 10800,
    security: 5000,
  },
  {
    id: "d2",
    code: "HEAD0042",
    name: "Shree Balaji Services",
    outstanding: 7600,
    security: 3000,
  },
  {
    id: "d3",
    code: "HEAD0051",
    name: "Metro Repair Hub",
    outstanding: 13200,
    security: 0,
  },
];

const bills: Bill[] = [
  {
    id: "db1",
    dealerId: "d1",
    label: "DB-001 · Washing Machine",
    outstanding: 1500,
    kind: "DUMMY_BILL_REF",
  },
  {
    id: "db2",
    dealerId: "d1",
    label: "DB-002 · Refrigerator",
    outstanding: 1000,
    kind: "DUMMY_BILL_REF",
  },
  {
    id: "b1",
    dealerId: "d1",
    label: "BILL-101 · Service Charge",
    outstanding: 2200,
    kind: "BILL_REF",
  },
  {
    id: "b2",
    dealerId: "d1",
    label: "BILL-102 · Installation",
    outstanding: 3500,
    kind: "BILL_REF",
  },
  {
    id: "db3",
    dealerId: "d2",
    label: "DB-003 · AC Repair",
    outstanding: 2400,
    kind: "DUMMY_BILL_REF",
  },
  {
    id: "b3",
    dealerId: "d2",
    label: "BILL-103 · Service",
    outstanding: 5200,
    kind: "BILL_REF",
  },
  {
    id: "db4",
    dealerId: "d3",
    label: "DB-004 · Service",
    outstanding: 3200,
    kind: "DUMMY_BILL_REF",
  },
  {
    id: "b4",
    dealerId: "d3",
    label: "BILL-104 · Maintenance",
    outstanding: 10000,
    kind: "BILL_REF",
  },
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

let nextId = 1;

const makeRow = (): Row => ({
  id: nextId++,
  type: "",
  refId: "",
  amount: "",
});

const input =
  "h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-2.5 text-xs text-gray-800 outline-none transition focus:border-blue-700 focus:ring-1 focus:ring-blue-100";

const label = "mb-1 block text-xs font-medium text-gray-600";

const allocationColumns =
  "grid grid-cols-[28px_145px_minmax(190px,1fr)_115px_125px_32px] items-center gap-2";

const tabOptions: {
  key: Tab;
  label: string;
}[] = [
  { key: "RECEIPT", label: "Receipt" },
  { key: "CREDIT_NOTE", label: "Credit Note" },
  {
    key: "SECURITY_DEPOSIT",
    label: "Security Deposit",
  },
];

export default function AddDealerEntryPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("RECEIPT");
  const [dealerId, setDealerId] = useState("d1");
  const [date, setDate] = useState(today());
  const [transactionType, setTransactionType] =
    useState<TransactionType>("UPI");
  const [amount, setAmount] = useState("5000");
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");
  type CreditNoteRefType = "BILL_REF" | "DUMMY_BILL_REF";

  const [creditNoteRefType, setCreditNoteRefType] =
    useState<CreditNoteRefType>("BILL_REF");

  const [creditNoteBillId, setCreditNoteBillId] = useState("");

  const [rows, setRows] = useState<Row[]>([
    {
      id: nextId++,
      type: "DUMMY_BILL_REF",
      refId: "db1",
      amount: "1500",
    },
    {
      id: nextId++,
      type: "DUMMY_BILL_REF",
      refId: "db2",
      amount: "1000",
    },
    {
      id: nextId++,
      type: "BILL_REF",
      refId: "b1",
      amount: "1200",
    },
    {
      id: nextId++,
      type: "ON_ACCOUNT",
      refId: "",
      amount: "800",
    },
    {
      id: nextId++,
      type: "ADVANCE",
      refId: "",
      amount: "500",
    },
  ]);

  const [creditReason, setCreditReason] = useState("RATE_DIFFERENCE");

  const [securityAction, setSecurityAction] = useState<"RECEIVE" | "REFUND">(
    "RECEIVE",
  );

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [showHistory, setShowHistory] = useState(false);

  const dealer = dealers.find((item) => item.id === dealerId)!;

  const total = Number(amount) || 0;

  const creditNoteBills = bills.filter(
    (bill) =>
      bill.dealerId === dealerId &&
      bill.kind === creditNoteRefType &&
      bill.outstanding > 0,
  );

  const selectedCreditNoteBill = creditNoteBills.find(
    (bill) => bill.id === creditNoteBillId,
  );

  const creditNoteAmount = tab === "CREDIT_NOTE" ? Number(amount) || 0 : 0;

  const creditNoteRemaining = selectedCreditNoteBill
    ? roundAmount(selectedCreditNoteBill.outstanding - creditNoteAmount)
    : 0;

  const allocated = useMemo(
    () =>
      roundAmount(
        rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
      ),
    [rows],
  );

  const remaining = roundAmount(total - allocated);

  const fullyAllocated = total > 0 && remaining === 0;

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

    return Math.max(0, roundAmount(total - allocatedElsewhere));
  };

  const getMaxPayable = (row: Row, currentRows: Row[]) => {
    const available = getAvailableForRow(currentRows, row.id);

    const selectedBill = bills.find(
      (bill) =>
        bill.id === row.refId &&
        bill.dealerId === dealerId &&
        bill.kind === row.type,
    );

    return selectedBill
      ? Math.min(selectedBill.outstanding, available)
      : available;
  };

  const handleAllocationAmountChange = (rowId: number, value: string) => {
    if (value === "") {
      setRow(rowId, { amount: "" });
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    const enteredAmount = Number(value);

    if (!Number.isFinite(enteredAmount) || enteredAmount < 0) {
      return;
    }

    const currentRow = rows.find((row) => row.id === rowId);

    if (!currentRow) return;

    const maxPayable = getMaxPayable(currentRow, rows);

    if (enteredAmount > maxPayable) {
      toast.warning(`Maximum payable amount is ${format(maxPayable)}`);
      return;
    }

    setRow(rowId, { amount: value });
  };

  const changeAllocationType = (id: number, type: AllocationType) => {
    if (type === "ON_ACCOUNT" || type === "ADVANCE") {
      const alreadyExists = rows.some(
        (row) => row.id !== id && row.type === type,
      );

      if (alreadyExists) {
        toast.warning(
          `${
            type === "ON_ACCOUNT" ? "On Account" : "Advance"
          } can only be added once`,
        );
        return;
      }
    }

    setRows((prev) => {
      const available = getAvailableForRow(prev, id);

      return prev.map((row) => {
        if (row.id !== id) return row;

        return {
          ...row,
          type,
          refId: "",
          amount:
            type === "ON_ACCOUNT" && available > 0 ? available.toFixed(2) : "",
        };
      });
    });
  };

  const handleBillChange = (rowId: number, refId: string) => {
    setRow(rowId, {
      refId,
      amount: "",
    });
  };

  const handleAddDebitRow = () => {
    if (remaining <= 0 || total <= 0) {
      return;
    }

    setRows((prev) => [...prev, makeRow()]);
  };

  const handleRemoveRow = (rowId: number) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const reset = () => {
    setDate(today());
    setAmount("");
    setReference("");
    setRemarks("");
    setRows([makeRow()]);
  };

  const save = () => {
    if (!dealerId || !date || !Number.isFinite(total) || total <= 0) {
      toast.error("Select dealer, date and a valid amount");
      return;
    }

    if (tab === "RECEIPT") {
      if (!rows.length) {
        toast.error("Add at least one debit allocation");
        return;
      }

      const onAccountCount = rows.filter(
        (row) => row.type === "ON_ACCOUNT",
      ).length;

      const advanceCount = rows.filter((row) => row.type === "ADVANCE").length;

      if (onAccountCount > 1) {
        toast.error("On Account can only be added once");
        return;
      }

      if (advanceCount > 1) {
        toast.error("Advance can only be added once");
        return;
      }

      const invalidRow = rows.some(
        (row) =>
          !row.type ||
          !Number.isFinite(Number(row.amount)) ||
          Number(row.amount) <= 0 ||
          ((row.type === "BILL_REF" || row.type === "DUMMY_BILL_REF") &&
            !row.refId),
      );

      if (invalidRow) {
        toast.error("Complete every allocation row with a positive amount");
        return;
      }

      if (Math.abs(remaining) > 0.001) {
        toast.error("Receipt must be fully allocated before saving");
        return;
      }

      const selectedRefs = rows
        .filter((row) => row.refId)
        .map((row) => row.refId);

      if (new Set(selectedRefs).size !== selectedRefs.length) {
        toast.error("The same bill cannot be selected twice");
        return;
      }

      for (const row of rows) {
        const maxPayable = getMaxPayable(row, rows);

        if (Number(row.amount) > maxPayable + 0.001) {
          toast.error("Allocation exceeds maximum payable");
          return;
        }

        if (!row.refId) continue;

        const bill = bills.find(
          (item) =>
            item.id === row.refId &&
            item.dealerId === dealerId &&
            item.kind === row.type,
        );

        if (!bill || Number(row.amount) > bill.outstanding) {
          toast.error("Bill allocation exceeds available outstanding");
          return;
        }
      }
    }

    if (tab === "CREDIT_NOTE") {
      if (!selectedCreditNoteBill) {
        toast.error("Please select a bill");
        return;
      }

      if (creditNoteAmount <= 0) {
        toast.error("Enter a valid Credit Note amount");
        return;
      }

      if (creditNoteAmount > selectedCreditNoteBill.outstanding) {
        toast.error(
          `Credit Note cannot exceed ${format(
            selectedCreditNoteBill.outstanding,
          )}`,
        );
        return;
      }
    }

    if (
      tab === "SECURITY_DEPOSIT" &&
      securityAction === "REFUND" &&
      total > dealer.security
    ) {
      toast.error("Refund exceeds available security deposit");
      return;
    }

    setHistory((prev) => [
      {
        id: Date.now(),
        tab,
        dealer: dealer.name,
        amount: total,
        date,
        detail:
          tab === "RECEIPT"
            ? `${transactionType} · ${rows.length} allocations`
            : tab === "CREDIT_NOTE"
              ? creditReason
              : securityAction,
      },
      ...prev,
    ]);

    toast.success("Simulation saved locally — no API called");
  };

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
              Interactive dummy-data accounting simulation
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
            onClick={() => {
              setTab(item.key);
              reset();
              setCreditNoteBillId("");
              setCreditNoteRefType("BILL_REF");
            }}
            className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              tab === item.key
                ? "bg-[#123B7A] text-white"
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
          {tab === "RECEIPT"
            ? "Receipt Details"
            : tab === "CREDIT_NOTE"
              ? "Credit Note Details"
              : "Security Deposit Details"}
        </h2>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {/* DEALER */}
          <div>
            <label className={label}>Select Dealer *</label>

            <select
              className={input}
              value={dealerId}
              onChange={(e) => {
                setDealerId(e.target.value);
                setRows([makeRow()]);
                setCreditNoteBillId("");
              }}
            >
              {dealers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} — {item.name}
                </option>
              ))}
            </select>
          </div>

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

          {/* TRANSACTION TYPE */}
          {tab === "RECEIPT" && (
            <div>
              <label className={label}>Transaction Type *</label>

              <select
                className={input}
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value as TransactionType)
                }
              >
                {(
                  ["CASH", "BANK", "UPI", "NET_BANKING", "CHEQUE"] as const
                ).map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CREDIT REASON */}
          {/* {tab === "CREDIT_NOTE" && (
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
                      setCreditNoteRefType(e.target.value as CreditNoteRefType);
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
                    value={creditNoteBillId}
                    onChange={(e) => setCreditNoteBillId(e.target.value)}
                  >
                    <option value="">Select Outstanding Bill</option>

                    {creditNoteBills.map((bill) => (
                      <option key={bill.id} value={bill.id}>
                        {bill.label} — {format(bill.outstanding)}
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
                    max={selectedCreditNoteBill?.outstanding ?? 0}
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
                      {format(selectedCreditNoteBill.outstanding)}
                    </p>
                  </div>

                  <div className="rounded-md bg-blue-50 p-3">
                    <p className="text-xs text-blue-700">
                      Credit Note Settlement
                    </p>
                    <p className="mt-1 text-base font-semibold text-blue-900">
                      {format(creditNoteAmount)}
                    </p>
                  </div>

                  <div className="rounded-md bg-green-50 p-3">
                    <p className="text-xs text-green-700">
                      Remaining Bill Payable
                    </p>
                    <p
                      className={`mt-1 text-base font-semibold ${
                        creditNoteRemaining < 0
                          ? "text-red-700"
                          : "text-green-800"
                      }`}
                    >
                      {format(creditNoteRemaining)}
                    </p>
                  </div>
                </div>
              )}
            </section>
          )} */}

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
                onChange={(e) =>
                  setSecurityAction(e.target.value as "RECEIVE" | "REFUND")
                }
              >
                <option value="RECEIVE">Receive Deposit</option>
                <option value="REFUND">Refund Deposit (Simulation)</option>
              </select>
            </div>
          )}

{/* AMOUNT - HIDE IN CREDIT NOTE TAB */}
{tab !== "CREDIT_NOTE" && (
  <div>
    <label className={label}>
      Amount (₹) *
    </label>

    <input
      className={input}
      type="number"
      min="0.01"
      step="0.01"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />
  </div>
)}

          {/* REFERENCE */}
          <div className="md:col-span-2">
            <label className={label}>Reference / UTR / Cheque No.</label>

            <input
              className={input}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Optional reference number"
            />
          </div>
        </div>

        {/* DEALER SUMMARY */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
          <span className="font-medium">{dealer.name}</span>

          <span>
            Outstanding: <strong>{format(dealer.outstanding)}</strong>
          </span>

          <span>
            Security: <strong>{format(dealer.security)}</strong>
          </span>
        </div>
      </div>

      {/* RECEIPT ALLOCATIONS */}
      {tab === "RECEIPT" && (
        <section className="flex min-h-[250px] flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white lg:min-h-0">
          {/* FIXED SECTION HEADER */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-3 py-2">
            <h2 className="text-sm font-semibold text-red-700">
              Debit (Dr) · Allocations
            </h2>

            <strong className="text-sm text-red-700">
              {format(allocated)}
            </strong>
          </div>

          {/* SCROLLABLE TABLE */}
          <div className="min-h-0 flex-1 overflow-auto">
            <div className="min-w-[760px]">
              {/* STICKY TABLE HEADER */}
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

              {/* ALLOCATION ROWS */}
              <div className="divide-y divide-gray-100">
                {rows.map((row, index) => {
                  const bill = bills.find(
                    (item) =>
                      item.id === row.refId &&
                      item.dealerId === dealerId &&
                      item.kind === row.type,
                  );

                  const options = bills.filter(
                    (item) =>
                      item.dealerId === dealerId && item.kind === row.type,
                  );

                  const maxPayable = getMaxPayable(row, rows);

                  const isBillType =
                    row.type === "BILL_REF" || row.type === "DUMMY_BILL_REF";

                  const onAccountExists = rows.some(
                    (item) => item.id !== row.id && item.type === "ON_ACCOUNT",
                  );

                  const advanceExists = rows.some(
                    (item) => item.id !== row.id && item.type === "ADVANCE",
                  );

                  return (
                    <div
                      key={row.id}
                      className={`${allocationColumns} px-2 py-1.5 transition-colors hover:bg-gray-50`}
                    >
                      {/* ROW NUMBER */}
                      <span className="text-xs text-gray-500">{index + 1}</span>

                      {/* ALLOCATION TYPE */}
                      <select
                        className={input}
                        value={row.type}
                        onChange={(e) =>
                          changeAllocationType(
                            row.id,
                            e.target.value as AllocationType,
                          )
                        }
                      >
                        <option value="" disabled>
                          Select Type
                        </option>

                        <option value="ON_ACCOUNT" disabled={onAccountExists}>
                          On Account
                        </option>

                        <option value="ADVANCE" disabled={advanceExists}>
                          Advance
                        </option>

                        <option value="DUMMY_BILL_REF">Dummy Bill Ref</option>

                        <option value="BILL_REF">Bill Ref</option>
                      </select>

                      {/* BILL REFERENCE */}
                      {isBillType ? (
                        <select
                          className={input}
                          value={row.refId}
                          onChange={(e) =>
                            handleBillChange(row.id, e.target.value)
                          }
                        >
                          <option value="">Select Outstanding Bill</option>

                          {options.map((item) => {
                            const selectedElsewhere = rows.some(
                              (other) =>
                                other.id !== row.id && other.refId === item.id,
                            );

                            return (
                              <option
                                key={item.id}
                                value={item.id}
                                disabled={selectedElsewhere}
                              >
                                {item.label} — {format(item.outstanding)}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        <span className="px-2 text-xs text-gray-400">
                          Not Applicable
                        </span>
                      )}

                      {/* AMOUNT */}
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

                      {/* MAX PAYABLE */}
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-gray-700">
                          {format(maxPayable)}
                        </span>

                        {bill && (
                          <p className="text-[10px] text-gray-400">
                            Due: {format(bill.outstanding)}
                          </p>
                        )}
                      </div>

                      {/* DELETE */}
                      <button
                        type="button"
                        title="Remove allocation"
                        onClick={() => handleRemoveRow(row.id)}
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

          {/* FIXED ALLOCATION FOOTER */}
          <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleAddDebitRow}
                disabled={remaining <= 0 || total <= 0}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-200 px-3 text-xs font-semibold text-blue-800 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <Plus size={14} />
                {fullyAllocated ? "Fully Allocated" : "Add Debit Row"}
              </button>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700">
                <span>
                  Receipt: <strong>{format(total)}</strong>
                </span>

                <span>
                  Allocated: <strong>{format(allocated)}</strong>
                </span>

                <span>
                  Remaining:{" "}
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

      {/* CREDIT NOTE / SECURITY DEPOSIT PREVIEW */}
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
                      setCreditNoteRefType(e.target.value as CreditNoteRefType);
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
                    value={creditNoteBillId}
                    onChange={(e) => setCreditNoteBillId(e.target.value)}
                  >
                    <option value="">Select Outstanding Bill</option>

                    {creditNoteBills.map((bill) => (
                      <option key={bill.id} value={bill.id}>
                        {bill.label} — {format(bill.outstanding)}
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
                    max={selectedCreditNoteBill?.outstanding ?? 0}
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
                      {format(selectedCreditNoteBill.outstanding)}
                    </p>
                  </div>

                  <div className="rounded-md bg-blue-50 p-3">
                    <p className="text-xs text-blue-700">
                      Credit Note Settlement
                    </p>
                    <p className="mt-1 text-base font-semibold text-blue-900">
                      {format(creditNoteAmount)}
                    </p>
                  </div>

                  <div className="rounded-md bg-green-50 p-3">
                    <p className="text-xs text-green-700">
                      Remaining Bill Payable
                    </p>
                    <p
                      className={`mt-1 text-base font-semibold ${
                        creditNoteRemaining < 0
                          ? "text-red-700"
                          : "text-green-800"
                      }`}
                    >
                      {format(creditNoteRemaining)}
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

      {/* {tab !== "RECEIPT" && (
        <section className="flex min-h-[150px] flex-1 flex-col rounded-lg border border-gray-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-gray-900">
            {tab === "CREDIT_NOTE"
              ? "Credit Note Preview"
              : "Security Deposit Preview"}
          </h2>

          <p className="mt-2 text-xs text-gray-600">
            {tab === "CREDIT_NOTE"
              ? "Simulated dealer credit adjustment. No invoice or outstanding will be modified."
              : securityAction === "RECEIVE"
                ? "Simulated security deposit receipt. Security balance will not change until backend integration."
                : "Simulated security refund. Real refund eligibility and approval rules are not applied here."}
          </p>

          <p className="mt-3 text-xl font-bold text-gray-900">
            {format(total)}
          </p>
        </section>
      )} */}

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
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            type="button"
            onClick={save}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#123B7A] px-4 text-xs font-semibold text-white hover:bg-blue-900"
          >
            <Save size={14} />
            Save Simulation
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
            aria-label="Session Simulation History"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          >
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Session Simulation History
                </h2>

                <p className="text-xs text-gray-500">
                  {history.length} saved simulations
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

            {/* MODAL TABLE */}
            <div className="overflow-auto p-3">
              {history.length === 0 ? (
                <div className="py-10 text-center text-xs text-gray-500">
                  No simulation history available.
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
