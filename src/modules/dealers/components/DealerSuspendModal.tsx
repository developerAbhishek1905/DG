import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

import { suspendDealer } from "../services/dealerApi";

interface DealerSuspendModalProps {
  open: boolean;
  dealerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DealerSuspendModal({
  open,
  dealerId,
  onClose,
  onSuccess,
}: DealerSuspendModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    if (submitting) return;

    setReason("");
    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!reason.trim()) {
      toast.error("Suspension reason is required");
      return;
    }

    try {
      setSubmitting(true);

      await suspendDealer(dealerId, {
        reason: reason.trim(),
      });

      toast.success("Dealer suspended successfully");

      setReason("");
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to suspend dealer",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={20}
              className="text-red-600"
            />

            <h2 className="text-base font-semibold text-gray-900">
              Suspend Dealer
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Suspended dealers will not receive new complaint
              allocations.
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-[#123B7A]">
                Suspension Reason *
              </label>

              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for suspension..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {submitting && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {submitting ? "Suspending..." : "Suspend Dealer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}