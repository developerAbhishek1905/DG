import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, Plus, ReceiptText, Save, Trash2, Wallet, X } from "lucide-react";
import { toast } from "react-toastify";
import { searchDealerDropdown } from "../../dealers/services/dealerApi";
import {
  createDealerPayment,
  getDealerUnpaidBills,
  type DealerOutstandingSummary,
  type DealerUnpaidBill,
} from "../services/ledgerApi";
import { useDebounce } from "../../../hooks/useDebounce";

type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CHEQUE";
type BalanceType = "DEBIT" | "CREDIT" | "SETTLED";

interface DealerOption {
  _id?: string;
  value?: string;
  label?: string;
  headCode?: string;
  technicianFirmName?: string;
  technicianName?: string;
  mobileNumber?: string;
}

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed";
const labelClass = "mb-1.5 block text-xs font-semibold text-gray-600";
const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const toPaise = (value: number) => Math.round(value * 100);
const fromPaise = (value: number) => value / 100;
const balanceTypeOf = (paise: number): BalanceType =>
  paise > 0 ? "DEBIT" : paise < 0 ? "CREDIT" : "SETTLED";
const getLocalDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const dealerKey = (dealer: DealerOption) => dealer.value || dealer._id || "";
const dealerTitle = (dealer: DealerOption) =>
  dealer.technicianFirmName || dealer.technicianName || dealer.label || dealer.headCode || "Dealer";

export default function AddPaymentModal({ onClose, onSuccess }: Props) {
  const [dealerId, setDealerId] = useState("");
  const [dealerSearch, setDealerSearch] = useState("");
  const [dealerOpen, setDealerOpen] = useState(false);
  const [dealers, setDealers] = useState<DealerOption[]>([]);
  const [dealerLoading, setDealerLoading] = useState(false);
  const [billsLoading, setBillsLoading] = useState(false);
  const [dealerSummary, setDealerSummary] = useState<DealerOutstandingSummary | null>(null);
  const [unpaidBills, setUnpaidBills] = useState<DealerUnpaidBill[]>([]);
  const [additionalAmount, setAdditionalAmount] = useState("");
  const [selectedBillId, setSelectedBillId] = useState("");
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
  const [paymentDate, setPaymentDate] = useState(getLocalDate());
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("BANK_TRANSFER");
  const [transactionReference, setTransactionReference] = useState("");
  const [remark, setRemark] = useState("");
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(dealerSearch, 300);

  useEffect(() => {
    if (!dealerOpen) return;
    let active = true;
    const load = async () => {
      setDealerLoading(true);
      try {
        const options = await searchDealerDropdown(debouncedSearch.trim());
        if (active) setDealers(options as DealerOption[]);
      } catch (error) {
        console.error("Dealer dropdown failed", error);
        if (active) setDealers([]);
      } finally {
        if (active) setDealerLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [debouncedSearch, dealerOpen]);

  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDealerOpen(false);
      }
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  useEffect(() => {
    if (!dealerId) {
      setDealerSummary(null);
      setUnpaidBills([]);
      return;
    }
    let active = true;
    const load = async () => {
      setBillsLoading(true);
      try {
        // ledgerApi.getDealerUnpaidBills must return response.data.data
        const response = await getDealerUnpaidBills(dealerId);
        if (!active) return;
        setDealerSummary(response.summary);
        setUnpaidBills(response.bills ?? []);
      } catch (error) {
        console.error("Unpaid bills failed", error);
        if (active) {
          setDealerSummary(null);
          setUnpaidBills([]);
          toast.error("Failed to load dealer unpaid bills");
        }
      } finally {
        if (active) setBillsLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [dealerId]);

  const openingPaise = toPaise(Number(dealerSummary?.openingBalance ?? 0));
  const openingType = dealerSummary?.openingBalanceType ?? "DR";
  // Positive = dealer debit, negative = dealer credit.
  const startingPaise = openingType === "DR" ? openingPaise : -openingPaise;
  const debitPaise = Math.max(0, startingPaise);
  const creditPaise = Math.max(0, -startingPaise);
  const amountNumber = Number(additionalAmount || 0);
  const validAmount = Number.isFinite(amountNumber) && amountNumber >= 0 && /^\d*(\.\d{0,2})?$/.test(additionalAmount);
  const manualPaise = validAmount ? toPaise(amountNumber) : 0;
  const adjustedPaise = startingPaise - manualPaise;
  const availableCreditPaise = Math.max(0, -adjustedPaise);

  const selectedBills = useMemo(
    () => unpaidBills.filter((bill) => selectedBillIds.includes(bill._id)),
    [unpaidBills, selectedBillIds],
  );
  const selectedBillsPaise = selectedBills.reduce(
    (total, bill) => total + toPaise(Number(bill.remainingAmount)), 0,
  );
  const remainingCreditPaise = Math.max(0, availableCreditPaise - selectedBillsPaise);
  // Bills consume credit in this running-balance model.
  const finalPaise = adjustedPaise + selectedBillsPaise;
  const availableBills = unpaidBills.filter((bill) => !selectedBillIds.includes(bill._id));
  const selectedBill = unpaidBills.find((bill) => bill._id === selectedBillId);
  const canAllocate = Boolean(dealerSummary) && validAmount && selectedBillsPaise <= availableCreditPaise;

  const handleSelectDealer = (dealer: DealerOption) => {
    const id = dealerKey(dealer);
    if (!id) { toast.error("Invalid dealer selected"); return; }
    setDealerId(id);
    setDealerSearch(dealer.label || `${dealer.headCode || ""} - ${dealerTitle(dealer)}`);
    setDealerOpen(false);
    setDealerSummary(null);
    setUnpaidBills([]);
    setSelectedBillId("");
    setSelectedBillIds([]);
    setAdditionalAmount("");
  };

  const handleReset = () => {
    setDealerId("");
    setDealerSearch("");
    setDealerOpen(false);
    setDealerSummary(null);
    setUnpaidBills([]);
    setAdditionalAmount("");
    setSelectedBillId("");
    setSelectedBillIds([]);
    setPaymentDate(getLocalDate());
    setPaymentMode("BANK_TRANSFER");
    setTransactionReference("");
    setRemark("");
  };

  const handleAddBill = () => {
    if (!selectedBill) { toast.error("Please select a complaint bill"); return; }
    if (!validAmount) { toast.error("Enter a valid additional amount"); return; }
    if (selectedBillIds.includes(selectedBill._id)) { toast.error("Bill already selected"); return; }
    if (toPaise(Number(selectedBill.remainingAmount)) > remainingCreditPaise) {
      toast.error("Bill exceeds available credit");
      return;
    }
    setSelectedBillIds((ids) => [...ids, selectedBill._id]);
    setSelectedBillId("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (!dealerId || !dealerSummary || billsLoading) { toast.error("Select a dealer and wait for bills to load"); return; }
//     if (!additionalAmount || Number(additionalAmount) <= 0) {
//   toast.error("Please enter additional amount");
//   return;
// }
    if (!validAmount) { toast.error("Enter a valid additional amount (maximum 2 decimals)"); return; }
    // if (!selectedBills.length) { toast.error("Select at least one complaint bill"); return; }
    if (!canAllocate) { toast.error("Selected bills exceed available credit"); return; }
    if (!paymentDate) { toast.error("Select payment date"); return; }
    setSaving(true);
    try {
      const response = await createDealerPayment({
        dealerId,
        additionalAmount: fromPaise(manualPaise) || 0,
        complaintBillIds: selectedBills.map((bill) => bill._id),
        paymentDate,
        paymentMode,
        transactionReference: transactionReference.trim(),
        remark: [remark.trim(), `Complaints: ${selectedBills.map((bill) => bill.complaintNumber).join(", ")}`]
          .filter(Boolean).join("\n"),
      });
      if (!response.success) throw new Error(response.message || "Payment could not be saved");
      toast.success(response.message || "Payment created successfully");
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || "Failed to create payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-[#123B7A]"><Wallet size={21} /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add Dealer Payment</h2>
              <p className="mt-1 text-xs text-gray-500">Allocate available credit against unpaid complaint bills</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-5 overflow-y-auto p-4 sm:p-6">
            <section>
              <label className={labelClass}>Dealer *</label>
              <div ref={dropdownRef} className="relative">
                <input
                  value={dealerSearch}
                  onFocus={() => setDealerOpen(true)}
                  onChange={(event) => {
                    setDealerSearch(event.target.value);
                    setDealerOpen(true);
                    setDealerId("");
                    setDealerSummary(null);
                    setUnpaidBills([]);
                    setSelectedBillId("");
                    setSelectedBillIds([]);
                    setAdditionalAmount("");
                  }}
                  placeholder="Search dealer by name, code or phone..."
                  className={inputClass}
                  disabled={saving}
                />
                {dealerOpen && (
                  <div className="absolute z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {dealerLoading ? (
                      <p className="p-3 text-sm text-gray-500">Loading dealers...</p>
                    ) : dealers.length ? dealers.map((dealer) => (
                      <button key={dealerKey(dealer)} type="button" onClick={() => handleSelectDealer(dealer)} className="block w-full px-3 py-2.5 text-left hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">{dealerTitle(dealer)}</p>
                        <p className="text-xs text-gray-500">{dealer.headCode || ""} {dealer.mobileNumber ? `• ${dealer.mobileNumber}` : ""}</p>
                      </button>
                    )) : <p className="p-3 text-sm text-gray-500">No dealers found</p>}
                  </div>
                )}
              </div>
            </section>

            {dealerId && billsLoading && <p className="text-sm text-gray-500">Loading balance and unpaid bills...</p>}

            {dealerId && dealerSummary && (
              <>
                <section className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Opening Debit</p>
                      <p className="mt-1 text-base font-bold text-gray-900">{formatCurrency(fromPaise(debitPaise))}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Opening Credit</p>
                      <p className="mt-1 text-base font-bold text-gray-900">{formatCurrency(fromPaise(creditPaise))}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Starting Outstanding</p>
                      <p className={`mt-1 text-base font-bold ${startingPaise > 0 ? "text-red-600" : startingPaise < 0 ? "text-green-600" : "text-gray-900"}`}>
                        {formatCurrency(fromPaise(Math.abs(startingPaise)))}
                      </p>
                      <span className="text-[10px] font-semibold text-gray-500">{balanceTypeOf(startingPaise)}</span>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Additional Amount</label>
                    <input type="number" min="0" step="0.01" value={additionalAmount}
                      onChange={(event) => {
                        const next = event.target.value;
                        setAdditionalAmount(next);
                        const parsed = Number(next || 0);
                        if (!Number.isFinite(parsed) || parsed < 0) return;
                        const credit = Math.max(0, -(startingPaise - toPaise(parsed)));
                        if (selectedBillsPaise > credit) {
                          setSelectedBillIds([]);
                          setSelectedBillId("");
                          toast.info("Credit reduced; select complaint bills again");
                        }
                      }}
                      placeholder="Enter additional amount" className={inputClass} disabled={saving} />
                    <p className="mt-1 text-xs text-gray-500">Additional amount first clears any debit; excess becomes available credit.</p>
                    {!validAmount && <p className="mt-1 text-xs text-red-600">Enter a valid non-negative amount with up to two decimals.</p>}
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Balance After Additional Amount</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(fromPaise(Math.abs(adjustedPaise)))}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${adjustedPaise > 0 ? "bg-red-100 text-red-700" : adjustedPaise < 0 ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                        {balanceTypeOf(adjustedPaise)}
                      </span>
                    </div>
                    {adjustedPaise > 0 && <p className="mt-2 text-xs text-red-600">Clear the remaining debit before allocating complaint bills.</p>}
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-500">Available Credit for Bills</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(fromPaise(availableCreditPaise))}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-500">Selected Bills Total</p>
                      <p className="text-sm font-semibold text-gray-800">− {formatCurrency(fromPaise(selectedBillsPaise))}</p>
                    </div>
                    <div className="my-3 border-t border-gray-200" />
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-gray-900">Remaining Credit</p>
                      <p className="text-xl font-bold text-[#123B7A]">{formatCurrency(fromPaise(remainingCreditPaise))}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-xs text-gray-500">Final Balance</p>
                      <p className={`text-sm font-semibold ${finalPaise > 0 ? "text-red-600" : finalPaise < 0 ? "text-green-600" : "text-gray-700"}`}>
                        {formatCurrency(fromPaise(Math.abs(finalPaise)))} {balanceTypeOf(finalPaise)}
                      </p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full rounded-full bg-[#123B7A] transition-all" style={{ width: `${availableCreditPaise ? Math.min(100, (selectedBillsPaise / availableCreditPaise) * 100) : 0}%` }} />
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Unpaid Complaint Bills</h3>
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">{unpaidBills.length} Unpaid</span>
                  </div>
                  <label className={labelClass}>Select Complaint Bill</label>
                  <select value={selectedBillId} onChange={(event) => setSelectedBillId(event.target.value)}
                    disabled={saving || !validAmount || remainingCreditPaise <= 0 || !availableBills.length} className={inputClass}>
                    <option value="">{availableBills.length ? "Select unpaid complaint..." : "No available bills"}</option>
                    {availableBills.map((bill) => (
                      <option key={bill._id} value={bill._id} disabled={toPaise(Number(bill.remainingAmount)) > remainingCreditPaise}>
                        {bill.complaintNumber} — {formatCurrency(Number(bill.remainingAmount))}
                      </option>
                    ))}
                  </select>
                  {selectedBill && (
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-blue-50 p-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedBill.complaintNumber}</p>
                        <p className="text-xs text-gray-500">{selectedBill.productName} {selectedBill.category ? `• ${selectedBill.category}` : ""}</p>
                      </div>
                      <p className="text-lg font-bold text-[#123B7A]">{formatCurrency(Number(selectedBill.remainingAmount))}</p>
                    </div>
                  )}
                  <button type="button" onClick={handleAddBill}
                    disabled={saving || !selectedBill || !validAmount || toPaise(Number(selectedBill?.remainingAmount ?? 0)) > remainingCreditPaise}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#123B7A] px-4 py-2.5 text-sm font-semibold text-[#123B7A] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40">
                    <Plus size={17} /> Add Complaint Bill
                  </button>
                  {selectedBill && toPaise(Number(selectedBill.remainingAmount)) > remainingCreditPaise && (
                    <p className="flex items-center gap-2 text-xs text-red-600"><AlertCircle size={14} /> Bill exceeds remaining available credit.</p>
                  )}
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Selected Bills</h3>
                    <span className="text-xs text-gray-500">{selectedBills.length} bills</span>
                  </div>
                  {selectedBills.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 p-8">
                      <ReceiptText size={28} className="text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">No bills selected</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      {selectedBills.map((bill, index) => (
                        <div key={bill._id} className={`flex items-center justify-between gap-3 p-3 ${index ? "border-t border-gray-100" : ""}`}>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{bill.complaintNumber}</p>
                            <p className="truncate text-xs text-gray-500">{bill.productName} {bill.category ? `• ${bill.category}` : ""}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <p className="text-sm font-bold text-gray-900">{formatCurrency(Number(bill.remainingAmount))}</p>
                            <button type="button" disabled={saving} onClick={() => setSelectedBillIds((ids) => ids.filter((id) => id !== bill._id))}
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Remove bill"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            <section className="space-y-4 border-t border-gray-100 pt-5">
              <h3 className="text-sm font-bold text-gray-900">Payment Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Payment Date *</label>
                  <input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className={inputClass} disabled={saving} />
                </div>
                <div>
                  <label className={labelClass}>Payment Mode *</label>
                  <select value={paymentMode} onChange={(event) => setPaymentMode(event.target.value as PaymentMode)} className={inputClass} disabled={saving}>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Transaction Reference</label>
                  <input value={transactionReference} onChange={(event) => setTransactionReference(event.target.value)} placeholder="UTR / UPI / Cheque number" className={inputClass} disabled={saving} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Remark / Complaint References</label>
                <textarea rows={3} value={remark} onChange={(event) => setRemark(event.target.value)} placeholder="Enter payment remark..." className={inputClass} disabled={saving} />
                <p className="mt-1 text-xs text-gray-500">Selected complaint numbers will be added automatically.</p>
              </div>
            </section>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
            <button type="button" onClick={handleReset} disabled={saving} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50">Reset</button>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={saving || billsLoading || !dealerId || !dealerSummary || !validAmount  || !canAllocate || !paymentDate}
                className="flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e3064] disabled:cursor-not-allowed disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
