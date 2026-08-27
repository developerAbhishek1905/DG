import {
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  DifferenceType,
  Reconciliation,
  ReconcilePayload,
} from "../types/reconciliation.types";

interface Props {
  reconciliation: Reconciliation;

  open: boolean;

  loading?: boolean;

  onClose: () => void;

  onReconcile: (
    payload: ReconcilePayload
  ) => Promise<void>;
}

export default function ReconcileModal({
  reconciliation,
  open,
  loading = false,
  onClose,
  onReconcile,
}: Props) {
  const [
    differenceType,
    setDifferenceType,
  ] =
    useState<DifferenceType>(
      reconciliation.differenceType ===
        "NONE"
        ? "OTHER"
        : reconciliation.differenceType
    );

  const [
    note,
    setNote,
  ] =
    useState("");

  if (!open) {
    return null;
  }

  const submit =
    async () => {
      if (!note.trim()) {
        return;
      }

      await onReconcile({
        reconciliationId:
          reconciliation.id,

        differenceType,

        reconciliationNote:
          note.trim(),
      });
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Reconcile Difference
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {
                reconciliation.reconciliationNumber
              }
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <p className="text-xs text-red-600">
              Difference
            </p>

            <p className="mt-1 text-xl font-bold text-red-700">
              ₹
              {Math.abs(
                reconciliation.difference
              ).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Difference Reason
            </label>

            <select
              value={
                differenceType
              }
              onChange={(
                event
              ) =>
                setDifferenceType(
                  event.target
                    .value as DifferenceType
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="LEDGER_HIGH">
                Ledger Higher Than Expected
              </option>

              <option value="LEDGER_LOW">
                Ledger Lower Than Expected
              </option>

              <option value="PAYMENT_MISSING">
                Payment Missing
              </option>

              <option value="BILL_MISSING">
                Bill Missing
              </option>

              <option value="DUPLICATE_ENTRY">
                Duplicate Entry
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Reconciliation Note
            </label>

            <textarea
              value={note}
              onChange={(
                event
              ) =>
                setNote(
                  event.target
                    .value
                )
              }
              rows={4}
              placeholder="Explain why this difference occurred and how it was resolved..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={
              loading ||
              !note.trim()
            }
            className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading
              ? "Reconciling..."
              : "Confirm Reconciliation"}
          </button>
        </div>
      </div>
    </div>
  );
}