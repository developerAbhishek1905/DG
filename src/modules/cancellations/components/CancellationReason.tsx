import {
  AlertCircle,
} from "lucide-react";

import {
  CANCELLATION_REASON_LABELS,
} from "../services/cancellationApi";

import type {
  CancellationReasonType,
} from "../types/cancellation.types";

interface Props {
  reason: CancellationReasonType;

  description?: string;
}

export default function CancellationReason({
  reason,
  description,
}: Props) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
      <div className="flex gap-3">
        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0 text-amber-600"
        />

        <div>
          <p className="text-sm font-semibold text-amber-900">
            {
              CANCELLATION_REASON_LABELS[
                reason
              ]
            }
          </p>

          {description && (
            <p className="mt-2 text-sm leading-6 text-amber-800">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}