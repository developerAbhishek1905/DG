import { useState } from "react";
import { CalendarDays, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

import { leaveDealer } from "../services/dealerApi";

interface DealerLeaveModalProps {
  open: boolean;
  dealerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DealerLeaveModal({
  open,
  dealerId,
  onClose,
  onSuccess,
}: DealerLeaveModalProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setFrom("");
    setTo("");
    setReason("");
  };

  const handleClose = () => {
    if (submitting) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!from) {
      toast.error("Leave from date is required");
      return;
    }

    if (!to) {
      toast.error("Leave to date is required");
      return;
    }

    if (new Date(to) < new Date(from)) {
      toast.error(
        "Leave to date cannot be before leave from date",
      );
      return;
    }

    try {
      setSubmitting(true);

      console.log(dealerId)
      await leaveDealer(dealerId, {
        from,
        to,
        reason: reason.trim(),
      });

      toast.success("Dealer leave added successfully");

      resetForm();
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to add dealer leave",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={20}
              className="text-[#123B7A]"
            />

            <h2 className="text-base font-semibold text-gray-900">
              Dealer Leave
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#123B7A]">
                Leave From *
              </label>

              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#123B7A]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#123B7A]">
                Leave To *
              </label>

              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#123B7A]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#123B7A]">
                Reason
              </label>

              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter leave reason..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#123B7A]"
              />
            </div>
          </div>

          {/* Footer */}

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
              className="flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {submitting ? "Saving..." : "Add Leave"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}