import { useState } from "react";
import { X } from "lucide-react";

import DealerPicker from "../../ledger/components/DealerPicker";
import type { AccountDealer } from "../../ledger/services/ledgerApi";
import type { DummyBillValues } from "../services/billingApi";

type Props = {
  onClose: () => void;
  onSubmit: (values: DummyBillValues) => Promise<void>;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-gray-600";

const today = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

export default function DummyBillForm({ onClose, onSubmit }: Props) {
  const [dealer, setDealer] = useState<AccountDealer | null>(null);
  const [complaintNumber, setComplaintNumber] = useState("");
  const [billingDate, setBillingDate] = useState(today());
  const [amount, setAmount] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!dealer) return;

    try {
      setSaving(true);

      await onSubmit({
        dealerId: dealer.dealerId,
        complaintNumber: complaintNumber.trim(),
        billingDate,
        amount: Number(amount),
        serviceDescription: serviceDescription.trim(),
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),
        customerAddress: customerAddress.trim(),
      });
    } catch {
      // The page shows the error toast; keep the form open
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Create Dummy Bill
            </h2>

            <p className="text-xs text-gray-500">
              Provisional bill that can be settled later as a Dummy Bill Ref
              in Adjustments
            </p>
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

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-6 overflow-y-auto p-6">
            <section>
              <h3 className="mb-4 border-b border-gray-100 pb-2 text-sm font-bold text-gray-800">
                Bill Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Dealer *</label>

                  <DealerPicker
                    value={dealer}
                    onChange={setDealer}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Complaint Number *</label>

                  <input
                    required
                    value={complaintNumber}
                    onChange={(e) => setComplaintNumber(e.target.value)}
                    className={inputClass}
                    placeholder="Enter complaint number"
                  />
                </div>

                <div>
                  <label className={labelClass}>Date *</label>

                  <input
                    required
                    type="date"
                    value={billingDate}
                    onChange={(e) => setBillingDate(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Service Amount (₹) *</label>

                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={inputClass}
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Service Description</label>

                  <input
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Washing machine motor replacement"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-4 border-b border-gray-100 pb-2 text-sm font-bold text-gray-800">
                Customer Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Customer Name *</label>

                  <input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={inputClass}
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Mobile Number</label>

                  <input
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    className={inputClass}
                    placeholder="Customer mobile"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Address</label>

                  <input
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className={inputClass}
                    placeholder="Customer address"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !dealer}
              className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e3064] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create Dummy Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
