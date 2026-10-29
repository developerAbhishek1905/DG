
import { ListSkeleton } from "../../../components/ui/Skeleton";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  CreditCard,
  ReceiptText,
  RotateCcw,
  Save,
  Search,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { getDealerLedgerOverview } from "../services/ledgerApi";
import type { DealerLedgerOverviewItem } from "../services/ledgerApi";

// Change this import path if your existing payment service
// is in a different file.
import {
  createDealerPayment,
  getDealerUnpaidBills,
} from "../services/ledgerApi";

interface AddPaymentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  /** Pre-select a dealer (used by the per-row Payment button) */
  initialDealerId?: string;
}

type PaymentMode =
  | "CASH"
  | "BANK_TRANSFER"
  | "UPI"
  | "CHEQUE"
  | "ADJUSTMENT";

interface UnpaidBill {
  _id: string;
  complaintNumber: string;
  productName?: string;
  category?: string;
  billAmount?: number;
  paidAmount?: number;
  remainingAmount: number;
}

interface PaymentAllocation {
  billId: string;
  amount: number;
}

interface CreatePaymentPayload {
  dealerId: string;
  additionalAmount: number;
  allocations: PaymentAllocation[];
  outstandingAdjustment: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  transactionReference: string;
  remark: string;
}

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const toPaise = (amount: number) =>
  Math.round(amount * 100);

const fromPaise = (paise: number) =>
  paise / 100;

const getLocalDate = () => {
  const date = new Date();

  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 10);
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

const isValidMoney = (value: string) =>
  /^\d+(\.\d{1,2})?$/.test(value) &&
  Number.isFinite(Number(value)) &&
  Number(value) >= 0;

export default function AddPaymentModal({
  onClose,
  onSuccess,
  initialDealerId,
}: AddPaymentModalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dealers, setDealers] = useState<
    DealerLedgerOverviewItem[]
  >([]);

  const [dealerId, setDealerId] = useState("");
  const [dealerSearch, setDealerSearch] = useState("");
  const [dealerOpen, setDealerOpen] = useState(false);

  const [dealersLoading, setDealersLoading] = useState(false);
  const [billsLoading, setBillsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [unpaidBills, setUnpaidBills] = useState<UnpaidBill[]>([]);

  const [billAllocations, setBillAllocations] = useState<
    Record<string, string>
  >({});

  const [paymentAmount, setPaymentAmount] = useState("");
  const [outstandingAdjustment, setOutstandingAdjustment] =
    useState("0");

  const [paymentDate, setPaymentDate] = useState(getLocalDate());
  const [paymentMode, setPaymentMode] =
    useState<PaymentMode>("BANK_TRANSFER");

  const [transactionReference, setTransactionReference] =
    useState("");

  const [remark, setRemark] = useState("");

  // Load dealers
  useEffect(() => {
    let active = true;

    const loadDealers = async () => {
      try {
        setDealersLoading(true);

        const first = await getDealerLedgerOverview({
          page: 1,
          limit: 100,
        });

        const rows = [...(first.data ?? [])];
        const totalPages = first.pagination?.totalPages ?? 1;

        for (let page = 2; page <= totalPages; page++) {
          const response = await getDealerLedgerOverview({
            page,
            limit: 100,
          });

          rows.push(...(response.data ?? []));
        }

        if (active) setDealers(rows);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dealers");
      } finally {
        if (active) setDealersLoading(false);
      }
    };

    void loadDealers();

    return () => {
      active = false;
    };
  }, []);

  // Pre-select dealer when opened from a table row
  useEffect(() => {
    if (!initialDealerId || dealerId || dealers.length === 0) return;

    const match = dealers.find(
      (dealer) => dealer.dealerId === initialDealerId,
    );

    if (match) {
      setDealerId(match.dealerId);
      setDealerSearch(`${match.headCode} - ${match.dealerName}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealers, initialDealerId]);

  // Close dealer dropdown on outside click
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDealerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const selectedDealer = useMemo(
    () =>
      dealers.find(
        (dealer) => dealer.dealerId === dealerId,
      ),
    [dealers, dealerId],
  );

  const filteredDealers = useMemo(() => {
    const search = dealerSearch.trim().toLowerCase();

    if (!search) return dealers;

    return dealers.filter((dealer) =>
      [
        dealer.dealerName,
        dealer.headCode,
        dealer.mobileNumber,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [dealers, dealerSearch]);

  // Load dealer bills
  useEffect(() => {
    if (!dealerId) {
      setUnpaidBills([]);
      setBillAllocations({});
      return;
    }

    let active = true;

    const loadBills = async () => {
      try {
        setBillsLoading(true);
        setUnpaidBills([]);
        setBillAllocations({});

        const response = await getDealerUnpaidBills(dealerId);

        if (!active) return;

        // Supports { data: [] } and { data: { bills: [] } }
        const raw = response.data as
          | UnpaidBill[]
          | { bills?: UnpaidBill[] };

        const bills = Array.isArray(raw)
          ? raw
          : raw?.bills ?? [];

        setUnpaidBills(
          bills.filter(
            (bill) => Number(bill.remainingAmount) > 0,
          ),
        );
      } catch (error) {
        console.error(error);

        if (active) {
          toast.error("Failed to load dealer unpaid bills");
        }
      } finally {
        if (active) setBillsLoading(false);
      }
    };

    void loadBills();

    return () => {
      active = false;
    };
  }, [dealerId]);

  const selectedBills = useMemo(
    () =>
      unpaidBills.filter(
        (bill) => billAllocations[bill._id] !== undefined,
      ),
    [unpaidBills, billAllocations],
  );

  const paymentPaise = toPaise(Number(paymentAmount || 0));

  const allocatedPaise = selectedBills.reduce(
    (total, bill) =>
      total +
      toPaise(Number(billAllocations[bill._id] || 0)),
    0,
  );

  const outstandingPaise = toPaise(
    Number(outstandingAdjustment || 0),
  );

  const advancePaise =
    paymentPaise - allocatedPaise - outstandingPaise;

  const debitOutstandingPaise = selectedDealer
    ? toPaise(
        selectedDealer.openingBalanceType === "DR"
          ? Number(selectedDealer.openingBalance || 0)
          : 0,
      )
    : 0;

  const validAllocations = selectedBills.every((bill) => {
    const value = billAllocations[bill._id];

    return (
      isValidMoney(value) &&
      Number(value) > 0 &&
      toPaise(Number(value)) <=
        toPaise(Number(bill.remainingAmount))
    );
  });

  const validPayment =
    isValidMoney(paymentAmount) &&
    paymentPaise > 0 &&
    isValidMoney(outstandingAdjustment) &&
    outstandingPaise <= debitOutstandingPaise &&
    validAllocations &&
    advancePaise >= 0;

  const handleSelectDealer = (
    dealer: DealerLedgerOverviewItem,
  ) => {
    setDealerId(dealer.dealerId);
    setDealerSearch(
      `${dealer.headCode} - ${dealer.dealerName}`,
    );
    setDealerOpen(false);
    setUnpaidBills([]);
    setBillAllocations({});
    setOutstandingAdjustment("0");
  };

  const handleToggleBill = (bill: UnpaidBill) => {
    setBillAllocations((previous) => {
      const next = { ...previous };

      if (next[bill._id] !== undefined) {
        delete next[bill._id];
      } else {
        const availablePaise = Math.max(
          0,
          paymentPaise -
            allocatedPaise -
            outstandingPaise,
        );

        const defaultPaise = Math.min(
          toPaise(Number(bill.remainingAmount)),
          availablePaise,
        );

        next[bill._id] = fromPaise(
          defaultPaise,
        ).toFixed(2);
      }

      return next;
    });
  };

  const handleReset = () => {
    setDealerId("");
    setDealerSearch("");
    setDealerOpen(false);
    setUnpaidBills([]);
    setBillAllocations({});
    setPaymentAmount("");
    setOutstandingAdjustment("0");
    setPaymentDate(getLocalDate());
    setPaymentMode("BANK_TRANSFER");
    setTransactionReference("");
    setRemark("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (saving) return;

    if (!dealerId) {
      toast.error("Please select a dealer");
      return;
    }

    if (billsLoading) {
      toast.error("Please wait for bills to load");
      return;
    }

    if (!validPayment) {
      toast.error(
        "Check payment amount, bill allocations and outstanding adjustment",
      );
      return;
    }

    if (!paymentDate) {
      toast.error("Select payment date");
      return;
    }

    const payload: CreatePaymentPayload = {
      dealerId,
      additionalAmount: fromPaise(paymentPaise),
      allocations: selectedBills.map((bill) => ({
        billId: bill._id,
        amount: fromPaise(
          toPaise(Number(billAllocations[bill._id])),
        ),
      })),
      outstandingAdjustment: fromPaise(outstandingPaise),
      paymentDate,
      paymentMode,
      transactionReference: transactionReference.trim(),
      remark: remark.trim(),
    };

    try {
      setSaving(true);

      // The service/backend must accept CreatePaymentPayload.
      const response = await createDealerPayment(payload);

      if (!response.success) {
        throw new Error(
          response.message || "Payment could not be saved",
        );
      }

      toast.success(
        response.message || "Payment created successfully",
      );

      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      console.error(error);

      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to create payment",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-[#6D28D9]">
              <Wallet size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Add Dealer Payment
              </h2>
              <p className="text-xs text-gray-500">
                Allocate payment against individual bills and outstanding
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-6 overflow-y-auto p-5">
            {/* Dealer */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">
                Dealer Information
              </h3>

              <div ref={dropdownRef} className="relative">
                <label className={labelClass}>
                  Select Dealer *
                </label>

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <input
                    type="text"
                    value={dealerSearch}
                    disabled={saving}
                    onFocus={() => setDealerOpen(true)}
                    onChange={(e) => {
                      setDealerSearch(e.target.value);
                      setDealerId("");
                      setDealerOpen(true);
                      setUnpaidBills([]);
                      setBillAllocations({});
                      setOutstandingAdjustment("0");
                    }}
                    placeholder="Search dealer name, code or mobile..."
                    className={`${inputClass} pl-10 pr-10`}
                  />

                  <ChevronDown
                    size={17}
                    className="absolute right-3 top-3 text-gray-400"
                  />
                </div>

                {dealerOpen && !saving && (
                  <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {dealersLoading ? (
                      <div className="p-3"><ListSkeleton rows={3} /></div>
                    ) : filteredDealers.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500">
                        No dealers found
                      </p>
                    ) : (
                      filteredDealers.map((dealer) => (
                        <button
                          key={dealer.dealerId}
                          type="button"
                          onClick={() =>
                            handleSelectDealer(dealer)
                          }
                          className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left hover:bg-blue-50"
                        >
                          <div>
                            <p className="text-sm font-semibold">
                              {dealer.dealerName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dealer.headCode} •{" "}
                              {dealer.mobileNumber}
                            </p>
                          </div>

                          {dealerId === dealer.dealerId && (
                            <Check
                              size={17}
                              className="text-[#6D28D9]"
                            />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedDealer && (
                <div className="grid gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      Pending Bills
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {money(
                        unpaidBills.reduce(
                          (sum, bill) =>
                            sum + Number(bill.remainingAmount),
                          0,
                        ),
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Debit Outstanding
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {money(fromPaise(debitOutstandingPaise))}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Available Credit
                    </p>
                    <p className="mt-1 text-lg font-bold text-green-700">
                      {money(selectedDealer.creditAmount)}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="space-y-4 border-t border-gray-100 pt-5">
              <h3 className="text-sm font-bold text-gray-900">
                Payment Details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelClass}>
                    Payment Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(e.target.value)
                    }
                    placeholder="0.00"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) =>
                      setPaymentDate(e.target.value)
                    }
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) =>
                      setPaymentMode(
                        e.target.value as PaymentMode,
                      )
                    }
                    className={inputClass}
                  >
                    <option value="BANK_TRANSFER">
                      Bank Transfer
                    </option>
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="ADJUSTMENT">
                      Adjustment
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className={labelClass}>
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={transactionReference}
                    onChange={(e) =>
                      setTransactionReference(e.target.value)
                    }
                    placeholder="UTR / cheque / receipt number"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Bills */}
            <section className="space-y-4 border-t border-gray-100 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Pending Bills
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Select bills and enter the amount to allocate.
                  </p>
                </div>

                <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  {selectedBills.length} selected
                </span>
              </div>

              {billsLoading ? (
                <div className="rounded-xl border p-8 text-center text-sm text-gray-500">
                  Loading pending bills...
                </div>
              ) : !dealerId ? (
                <div className="rounded-xl border p-8 text-center text-sm text-gray-500">
                  Select a dealer to view pending bills.
                </div>
              ) : unpaidBills.length === 0 ? (
                <div className="rounded-xl border p-8 text-center text-sm text-gray-500">
                  No pending bills found.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Select</th>
                        <th className="px-4 py-3">Bill</th>
                        <th className="px-4 py-3 text-right">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right">
                          Paid
                        </th>
                        <th className="px-4 py-3 text-right">
                          Due
                        </th>
                        <th className="px-4 py-3">
                          Allocate (₹)
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {unpaidBills.map((bill) => {
                        const selected =
                          billAllocations[bill._id] !== undefined;

                        const total = Number(
                          bill.billAmount ??
                            Number(bill.remainingAmount) +
                              Number(bill.paidAmount || 0),
                        );

                        const paid = Number(
                          bill.paidAmount ??
                            total - Number(bill.remainingAmount),
                        );

                        return (
                          <tr
                            key={bill._id}
                            className={
                              selected
                                ? "bg-blue-50/50"
                                : "hover:bg-gray-50"
                            }
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() =>
                                  handleToggleBill(bill)
                                }
                                className="h-4 w-4 accent-[#6D28D9]"
                              />
                            </td>

                            <td className="px-4 py-3">
                              <p className="font-semibold text-gray-900">
                                {bill.complaintNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {bill.productName || "-"}
                                {bill.category
                                  ? ` • ${bill.category}`
                                  : ""}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-right">
                              {money(total)}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {money(paid)}
                            </td>

                            <td className="px-4 py-3 text-right font-semibold">
                              {money(bill.remainingAmount)}
                            </td>

                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                max={bill.remainingAmount}
                                disabled={!selected}
                                value={
                                  billAllocations[bill._id] ?? ""
                                }
                                onChange={(e) =>
                                  setBillAllocations((prev) => ({
                                    ...prev,
                                    [bill._id]: e.target.value,
                                  }))
                                }
                                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6D28D9] disabled:bg-gray-100"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Outstanding */}
            <section className="space-y-4 border-t border-gray-100 pt-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Outstanding Adjustment
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Optional adjustment against existing debit outstanding.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Adjust Debit Outstanding (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    max={fromPaise(debitOutstandingPaise)}
                    value={outstandingAdjustment}
                    onChange={(e) =>
                      setOutstandingAdjustment(e.target.value)
                    }
                    disabled={!dealerId}
                    className={inputClass}
                  />
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Remaining Debit Outstanding
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {money(
                      fromPaise(
                        Math.max(
                          0,
                          debitOutstandingPaise -
                            outstandingPaise,
                        ),
                      ),
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <ReceiptText
                  size={18}
                  className="text-[#6D28D9]"
                />
                <h3 className="text-sm font-bold text-gray-900">
                  Payment Allocation Summary
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Payment Received
                  </span>
                  <span className="font-semibold">
                    {money(fromPaise(paymentPaise))}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Bill Allocation
                  </span>
                  <span className="font-semibold">
                    {money(fromPaise(allocatedPaise))}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Outstanding Adjustment
                  </span>
                  <span className="font-semibold">
                    {money(fromPaise(outstandingPaise))}
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-sm font-bold">
                    Remaining Future Advance
                  </span>

                  <span
                    className={`text-lg font-bold ${
                      advancePaise < 0
                        ? "text-red-600"
                        : "text-green-700"
                    }`}
                  >
                    {money(fromPaise(advancePaise))}
                  </span>
                </div>

                {!validPayment && paymentAmount && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                    <AlertCircle size={16} className="shrink-0" />
                    Check allocation amounts. Total allocated cannot
                    exceed payment received or individual bill dues.
                  </div>
                )}
              </div>
            </section>

            <section>
              <label className={labelClass}>
                Remark
              </label>

              <textarea
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter payment remarks..."
                className={`${inputClass} resize-y`}
              />
            </section>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                !dealerId ||
                billsLoading ||
                !validPayment
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
