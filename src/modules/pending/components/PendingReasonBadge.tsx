import type {
  PendingReason,
} from "../types/pending.types";

import {
  PENDING_REASON_LABELS,
} from "../services/pendingApi";

interface Props {
  reason: PendingReason;
}

export default function PendingReasonBadge({
  reason,
}: Props) {
  return (
    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
      {
        PENDING_REASON_LABELS[
          reason
        ]
      }
    </span>
  );
}