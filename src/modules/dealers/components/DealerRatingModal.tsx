import { useEffect, useState } from "react";
import { Loader2, Star, X } from "lucide-react";
import { toast } from "react-toastify";

import { updateDealerRating } from "../services/dealerApi";

interface DealerRatingModalProps {
  open: boolean;
  dealerId: string;
  currentRating?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DealerRatingModal({
  open,
  dealerId,
  currentRating = 0,
  onClose,
  onSuccess,
}: DealerRatingModalProps) {
  const [rating, setRating] = useState(currentRating);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setRating(currentRating);
    }
  }, [open, currentRating]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating < 0 || rating > 5) {
      toast.error("Rating must be between 0 and 5");
      return;
    }

    try {
      setSubmitting(true);

      await updateDealerRating(dealerId, {
        rating,
      });

      toast.success("Dealer rating updated successfully");

      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update dealer rating",
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
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Dealer Rating
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Rate dealer performance from 1 to 5.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex justify-center gap-2 py-5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={34}
                  className={
                    value <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          <div className="text-center">
            <span className="text-2xl font-semibold text-[#123B7A]">
              {rating}
            </span>

            <span className="text-sm text-gray-500">
              {" "}
              / 5
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {submitting ? "Updating..." : "Update Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}