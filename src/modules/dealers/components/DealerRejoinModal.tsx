import { useState } from "react";
import { Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "react-toastify";

import { rejoinDealer } from "../services/dealerApi";

interface DealerRejoinModalProps {
  open: boolean;
  dealerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DealerRejoinModal({
  open,
  dealerId,
  onClose,
  onSuccess,
}: DealerRejoinModalProps) {
  const [rejoiningDate, setRejoiningDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    if (submitting) return;

    setRejoiningDate("");
    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!rejoiningDate) {
      toast.error("Rejoining date is required");
      return;
    }

    try {
      setSubmitting(true);

      await rejoinDealer(dealerId, {
        rejoiningDate,
      });

      toast.success("Dealer rejoined successfully");

      setRejoiningDate("");
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to rejoin dealer",
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
            <RotateCcw
              size={20}
              className="text-[#123B7A]"
            />

            <h2 className="text-base font-semibold text-gray-900">
              Rejoin Dealer
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-5">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              Select the date from which this dealer will
              become active again.
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#123B7A]">
                Rejoining Date *
              </label>

              <input
                type="date"
                value={rejoiningDate}
                onChange={(e) =>
                  setRejoiningDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#123B7A]"
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

              {submitting
                ? "Rejoining..."
                : "Rejoin Dealer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}