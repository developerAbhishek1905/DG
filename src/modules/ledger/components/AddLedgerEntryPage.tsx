
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import { getDealerLedgerOverview } from "../services/ledgerApi";
import type { DealerLedgerOverviewItem } from "../services/ledgerApi";
import {
  getAccountsDropdown,
  type AccountDropdownOption,
} from "../services/accountApi";
import { createDealerLedger } from "../../billing/services/billingApi";


type EntryType = "DEBIT" | "CREDIT";

interface EntryRow {
  id: string;
  accountId: string;
  amount: string;
}

interface EntryPayload {
  dealerId: string;
  entryDate: string;
  referenceNumber: string;
  particulars: string;
  entries: {
    accountId: string;
    accountType: EntryType;
    amount: number;
  }[];
}

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 10);
};

const createRow = (): EntryRow => ({
  id: crypto.randomUUID(),
  accountId: "",
  amount: "",
});

const money = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const inputClass =
  "w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

export default function AddDealerEntryPage() {
  const navigate = useNavigate();

  const [dealers, setDealers] = useState<
    DealerLedgerOverviewItem[]
  >([]);
  const [accounts, setAccounts] = useState<
    AccountDropdownOption[]
  >([]);

  const [dealerId, setDealerId] = useState("");
  const [dealerSearch, setDealerSearch] = useState("");
  const [entryDate, setEntryDate] = useState(today());
  const [referenceNumber, setReferenceNumber] = useState("");
  const [particulars, setParticulars] = useState("");

  const [creditRows, setCreditRows] = useState<EntryRow[]>([
    createRow(),
  ]);
  const [debitRows, setDebitRows] = useState<EntryRow[]>([
    createRow(),
  ]);

  const [loadingDealers, setLoadingDealers] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  // LOAD DEALERS
  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoadingDealers(true);

        const first = await getDealerLedgerOverview({
          page: 1,
          limit: 100,
        });

        const all = [...(first.data ?? [])];
        const totalPages = first.pagination?.totalPages ?? 1;

        for (let page = 2; page <= totalPages; page++) {
          const result = await getDealerLedgerOverview({
            page,
            limit: 100,
          });
          all.push(...(result.data ?? []));
        }

        if (active) setDealers(all);
      } catch {
        if (active) toast.error("Failed to load dealers");
      } finally {
        if (active) setLoadingDealers(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  // LOAD ACCOUNTS
  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoadingAccounts(true);
        const result = await getAccountsDropdown("");

        if (active) setAccounts(result);
      } catch {
        if (active) toast.error("Failed to load accounts");
      } finally {
        if (active) setLoadingAccounts(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const selectedDealer = useMemo(
    () => dealers.find((d) => d.dealerId === dealerId),
    [dealers, dealerId],
  );

  const filteredDealers = useMemo(() => {
    const keyword = dealerSearch.trim().toLowerCase();

    if (!keyword) return dealers;

    return dealers.filter((dealer) =>
      [
        dealer.dealerName,
        dealer.headCode,
        dealer.mobileNumber,
      ].some((value) =>
        String(value || "").toLowerCase().includes(keyword),
      ),
    );
  }, [dealers, dealerSearch]);

  const addRow = (type: EntryType) => {
    if (type === "CREDIT") {
      setCreditRows((prev) => [...prev, createRow()]);
    } else {
      setDebitRows((prev) => [...prev, createRow()]);
    }
  };

  const updateRow = (
    type: EntryType,
    id: string,
    field: "accountId" | "amount",
    value: string,
  ) => {
    const update = (rows: EntryRow[]) =>
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      );

    if (type === "CREDIT") {
      setCreditRows(update);
    } else {
      setDebitRows(update);
    }
  };

  const removeRow = (type: EntryType, id: string) => {
    if (type === "CREDIT") {
      setCreditRows((prev) =>
        prev.filter((row) => row.id !== id),
      );
    } else {
      setDebitRows((prev) =>
        prev.filter((row) => row.id !== id),
      );
    }
  };

  const totalCredit = creditRows.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0,
  );

  const totalDebit = debitRows.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0,
  );

  const difference = totalCredit - totalDebit;

  const handleReset = () => {
    setDealerId("");
    setDealerSearch("");
    setEntryDate(today());
    setReferenceNumber("");
    setParticulars("");
    setCreditRows([createRow()]);
    setDebitRows([createRow()]);
  };

const handleSubmit = async () => {
  if (saving) return;

  if (!selectedDealer) {
    toast.error("Please select a dealer");
    return;
  }

  if (!entryDate) {
    toast.error("Please select entry date");
    return;
  }

  const debitEntries = debitRows
    .filter((row) => row.accountId || row.amount)
    .map((row) => ({
      accountId: row.accountId,
      amount: Number(row.amount),
    }));

  const creditEntries = creditRows
    .filter((row) => row.accountId || row.amount)
    .map((row) => ({
      accountId: row.accountId,
      amount: Number(row.amount),
    }));

  const allEntries = [
    ...debitEntries,
    ...creditEntries,
  ];

  if (!allEntries.length) {
    toast.error("Add at least one debit or credit entry");
    return;
  }

  const invalidEntry = allEntries.some(
    (entry) =>
      !entry.accountId ||
      !Number.isFinite(entry.amount) ||
      entry.amount <= 0,
  );

  if (invalidEntry) {
    toast.error(
      "Please select account and enter valid amount in every row",
    );
    return;
  }

  const payload: CreateDealerLedgerPayload = {
    dealerId: selectedDealer.dealerId,
    billingDate: entryDate,
    referenceNumber: referenceNumber.trim(),
    description: particulars.trim(),
    entrySource: "MANUAL_ACCOUNT_ENTRY",
    debitEntries,
    creditEntries,
  };

  try {
    setSaving(true);

    const response = await createDealerLedger(payload);

    if (response.success) {
      toast.success(
        response.message || "Dealer entry saved successfully",
      );

      navigate("/ledger");
    } else {
      toast.error(
        response.message || "Failed to save dealer entry",
      );
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message ||
        "Failed to save dealer entry",
    );
  } finally {
    setSaving(false);
  }
};

  const renderRows = (
    type: EntryType,
    rows: EntryRow[],
  ) => (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div
          key={row.id}
          className="grid grid-cols-[minmax(0,1fr)_minmax(100px,0.65fr)_36px] items-end gap-2"
        >
          <div className="min-w-0">
            <label className="mb-1 block text-xs text-gray-500">
              {index === 0 ? "Account" : `Account ${index + 1}`}
            </label>
            <select
              value={row.accountId}
              onChange={(e) =>
                updateRow(
                  type,
                  row.id,
                  "accountId",
                  e.target.value,
                )
              }
              disabled={loadingAccounts}
              className={inputClass}
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.accountName}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label className="mb-1 block text-xs text-gray-500">
              Amount
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={row.amount}
              onChange={(e) =>
                updateRow(type, row.id, "amount", e.target.value)
              }
              placeholder="0.00"
              className={inputClass}
            />
          </div>

          <button
            type="button"
            title="Remove row"
            onClick={() => removeRow(type, row.id)}
            className="flex h-[42px] items-center justify-center rounded-lg border border-gray-200 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => addRow(type)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
          type === "CREDIT"
            ? "border-green-200 text-green-700 hover:bg-green-50"
            : "border-red-200 text-red-700 hover:bg-red-50"
        }`}
      >
        <Plus size={15} />
        Add {type === "CREDIT" ? "Credit" : "Debit"} Row
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Add Dealer Entry
          </h1>
          <p className="text-sm text-gray-500">
            Create account-wise debit and credit entries
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* DEALER AND DATE */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Entry Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Search Dealer</label>
              <input
                value={dealerSearch}
                onChange={(e) =>
                  setDealerSearch(e.target.value)
                }
                placeholder="Search by name, code or mobile..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Select Dealer *</label>
              <select
                value={dealerId}
                onChange={(e) => setDealerId(e.target.value)}
                disabled={loadingDealers}
                className={inputClass}
              >
                <option value="">
                  {loadingDealers
                    ? "Loading dealers..."
                    : "Select Dealer"}
                </option>
                {filteredDealers.map((dealer) => (
                  <option
                    key={dealer.dealerId}
                    value={dealer.dealerId}
                  >
                    {dealer.headCode} - {dealer.dealerName}
                  </option>
                ))}
                {selectedDealer &&
                  !filteredDealers.some(
                    (d) => d.dealerId === selectedDealer.dealerId,
                  ) && (
                    <option value={selectedDealer.dealerId}>
                      {selectedDealer.headCode} -{" "}
                      {selectedDealer.dealerName}
                    </option>
                  )}
              </select>
            </div>

            <div>
              <label className={labelClass}>Entry Date *</label>
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Reference Number
              </label>
              <input
                value={referenceNumber}
                onChange={(e) =>
                  setReferenceNumber(e.target.value)
                }
                placeholder="Enter reference number"
                className={inputClass}
              />
            </div>
          </div>

          {selectedDealer && (
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-[#123B7A]">
              <span className="font-semibold">
                {selectedDealer.dealerName}
              </span>
              {" • "}
              {selectedDealer.headCode}
              {" • Outstanding: "}
              {money(selectedDealer.currentOutstanding)}
            </div>
          )}
        </div>

        {/* CREDIT / DEBIT */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-green-700">
                Credit (Cr)
              </h2>
              <span className="text-sm font-bold text-green-700">
                {money(totalCredit)}
              </span>
            </div>
            {renderRows("CREDIT", creditRows)}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-red-700">
                Debit (Dr)
              </h2>
              <span className="text-sm font-bold text-red-700">
                {money(totalDebit)}
              </span>
            </div>
            {renderRows("DEBIT", debitRows)}
          </div>
        </div>

        {/* PARTICULARS */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className={labelClass}>
            Particulars / Description
          </label>
          <textarea
            rows={3}
            value={particulars}
            onChange={(e) => setParticulars(e.target.value)}
            placeholder="Enter entry description..."
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* TOTALS */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Total Credit</p>
              <p className="mt-1 text-xl font-bold text-green-700">
                {money(totalCredit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Debit</p>
              <p className="mt-1 text-xl font-bold text-red-700">
                {money(totalDebit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Net Difference
              </p>
              <p className="mt-1 text-xl font-bold text-[#123B7A]">
                {money(Math.abs(difference))}
                {" "}
                {difference > 0
                  ? "Cr"
                  : difference < 0
                    ? "Dr"
                    : "Balanced"}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>

<button
  type="button"
  onClick={handleSubmit}
  disabled={saving}
  className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e2e60] disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving ? "Saving..." : "Save Dealer Entry"}
</button>
        </div>
      </form>
    </div>
  );
}
