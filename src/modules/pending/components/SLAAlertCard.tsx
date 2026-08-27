import {
  AlertTriangle,
  BellRing,
  Clock3,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import SLACountdown from "./SLACountdown";

import type {
  PendingComplaint,
} from "../types/pending.types";

interface Props {
  complaint: PendingComplaint;

  onReminder?: (
    id: string
  ) => void;

  onAction?: (
    id: string
  ) => void;
}

export default function SLAAlertCard({
  complaint,
  onReminder,
  onAction,
}: Props) {
  return (
    <Card className="border-red-200 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={18}
              className="text-red-600"
            />

            <p className="font-semibold text-gray-900">
              {
                complaint.complaintNumber
              }
            </p>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {
              complaint.customer
                .name
            }{" "}
            •{" "}
            {
              complaint.dealer
                .name
            }
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {
              complaint.reasonLabel
            }
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <SLACountdown
            deadline={
              complaint.slaDeadline
            }
          />

          <div className="flex gap-2">
            {onReminder && (
              <button
                type="button"
                onClick={() =>
                  onReminder(
                    complaint.id
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <BellRing
                  size={14}
                />

                Reminder
              </button>
            )}

            {onAction && (
              <button
                type="button"
                onClick={() =>
                  onAction(
                    complaint.id
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white"
              >
                <Clock3
                  size={14}
                />

                Take Action
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}