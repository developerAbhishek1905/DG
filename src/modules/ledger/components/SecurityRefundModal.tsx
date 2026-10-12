import { useState } from "react";
import { X, RotateCcw } from "lucide-react";
import type {
  RefundPaymentMode,
  RefundSecurityPayload,
} from "../services/securityRefundApi";

interface Props {
  open: boolean;
  amount: number;
  loading: boolean;
  onClose: () => void;
  onSubmit: (
    payload: RefundSecurityPayload,
  ) => Promise<void>;
}

export default function SecurityRefundModal({
  open,
  amount,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [paymentMode, setPaymentMode] =
    useState<RefundPaymentMode>("BANK_TRANSFER");

  const [transactionReference, setTransactionReference] =
    useState("");

  const [remark, setRemark] = useState("");

  if (!open) return null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    await onSubmit({
      paymentMode,
      transactionReference:
        transactionReference.trim(),
      remark: remark.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Refund Security Amount
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-5">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-700">
                Full Refund Amount
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-900">
                ₹{amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <p className="mt-1 text-xs text-blue-700">
                The complete security amount will be cleared
                after successful refund.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment Mode *
              </label>

              <select
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(
                    e.target.value as RefundPaymentMode,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="BANK_TRANSFER">
                  Bank Transfer
                </option>
                <option value="UPI">UPI</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Transaction Reference
              </label>

              <input
                type="text"
                value={transactionReference}
                onChange={(e) =>
                  setTransactionReference(e.target.value)
                }
                placeholder="Enter UTR / transaction number"
                required={paymentMode !== "CASH"}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Remark
              </label>

              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                placeholder="Enter refund remark"
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0e3063] disabled:opacity-50"
            >
              <RotateCcw size={16} />
              {loading ? "Processing..." : "Confirm Refund"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}