import { useEffect, useState } from "react";

import { X } from "lucide-react";

import type { Reason, ReasonFormData, ReasonType } from "../types/reason.types";

interface ReasonFormProps {
  open: boolean;

  selectedType: ReasonType;

  reason?: Reason | null;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (data: ReasonFormData) => Promise<void> | void;
}

const getReasonTypeLabel = (type: ReasonType) => {
  switch (type) {
    case "close":
      return "Close";

    case "on_call_pending":
      return "On Call Pending";

    case "after_call_pending":
      return "After Call Pending";

    case "on_call_cancel":
      return "On Call Cancel";

    case "after_call_cancel":
      return "After Call Cancel";

    default:
      return type;
  }
};

export default function ReasonForm({
  open,
  selectedType,
  reason,
  loading = false,
  onClose,
  onSubmit,
}: ReasonFormProps) {
  const [reasonName, setReasonName] = useState("");

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (reason) {
      setReasonName(reason.reasonName);
      setIsActive(reason.isActive);
    } else {
      setReasonName("");
      setIsActive(true);
    }
  }, [reason, open, selectedType]);

  const handleClose = () => {
    setReasonName("");
    setIsActive(true);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!reasonName.trim()) {
      return;
    }

    await onSubmit({
      reasonName: reasonName.trim(),
      reasonType: selectedType,
      isActive,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-start justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {reason ? "Update Reason" : "Create Reason"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {getReasonTypeLabel(selectedType)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason Type
            </label>

            <input
              value={getReasonTypeLabel(selectedType)}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="text"
              value={reasonName}
              onChange={(e) => setReasonName(e.target.value)}
              placeholder="Enter reason"
              autoFocus
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={isActive ? "active" : "inactive"}
              onChange={(e) => setIsActive(e.target.value === "active")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#123B7A] px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : reason
                  ? "Update Reason"
                  : "Create Reason"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
