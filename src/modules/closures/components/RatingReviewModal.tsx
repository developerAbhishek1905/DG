import {
  Star,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

interface RatingReviewModalProps {
  open: boolean;

  complaintNumber?: string;

  dealerName?: string;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (
    rating: number,
    review: string,
  ) => Promise<void>;
}

export default function RatingReviewModal({
  open,
  complaintNumber,
  dealerName,
  loading = false,
  onClose,
  onSubmit,
}: RatingReviewModalProps) {
  const [rating, setRating] = useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [review, setReview] =
    useState("");

  useEffect(() => {
    if (open) {
      setRating(0);
      setHoverRating(0);
      setReview("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    if (!rating) {
      return;
    }

    await onSubmit(
      rating,
      review.trim(),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Rate Dealer
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {complaintNumber || "Complaint"}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5">

          {/* Dealer */}

          {dealerName && (
            <div className="rounded-lg bg-gray-50 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Dealer
              </p>

              <p className="mt-0.5 text-sm font-medium text-gray-800">
                {dealerName}
              </p>
            </div>
          )}

          {/* Rating */}

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Rating
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div
              className="mt-3 flex items-center gap-2"
              onMouseLeave={() =>
                setHoverRating(0)
              }
            >
              {[1, 2, 3, 4, 5].map(
                (value) => {
                  const active =
                    value <=
                    (hoverRating || rating);

                  return (
                    <button
                      key={value}
                      type="button"
                      onMouseEnter={() =>
                        setHoverRating(value)
                      }
                      onClick={() =>
                        setRating(value)
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={30}
                        className={
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  );
                },
              )}

              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Review */}

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Review
              </label>

              <span className="text-[10px] text-gray-400">
                Optional
              </span>
            </div>

            <textarea
              value={review}
              onChange={(event) =>
                setReview(
                  event.target.value.slice(
                    0,
                    1000,
                  ),
                )
              }
              rows={4}
              placeholder="Write your review..."
              className="
                mt-2 w-full resize-none
                rounded-lg border border-gray-300
                px-3 py-2.5
                text-sm text-gray-700
                outline-none
                placeholder:text-gray-400
                focus:border-[#123B7A]
                focus:ring-1
                focus:ring-[#123B7A]
              "
            />

            <p className="mt-1 text-right text-[10px] text-gray-400">
              {review.length}/1000
            </p>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              rounded-lg border border-gray-300
              px-4 py-2
              text-sm font-medium text-gray-600
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              loading || rating === 0
            }
            onClick={handleSubmit}
            className="
              rounded-lg bg-[#123B7A]
              px-4 py-2
              text-sm font-medium text-white
              hover:bg-[#0f3268]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}