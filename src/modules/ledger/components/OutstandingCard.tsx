import {
  AlertTriangle,
  Building2,
  Eye,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  DealerLedgerSummary,
} from "../types/ledger.types";

interface Props {
  summary: DealerLedgerSummary;
}

export default function OutstandingCard({
  summary,
}: Props) {
  const navigate =
    useNavigate();

  const highOutstanding =
    summary.outstandingAmount >
    2000;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
            <Building2
              size={18}
            />
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {
                summary.dealer
                  .name
              }
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {
                summary.dealer
                  .dealerCode
              }
            </p>
          </div>
        </div>

        {highOutstanding && (
          <AlertTriangle
            size={18}
            className="text-amber-500"
          />
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs text-gray-500">
          Outstanding Amount
        </p>

        <p
          className={`mt-1 text-2xl font-bold ${
            highOutstanding
              ? "text-amber-600"
              : "text-gray-900"
          }`}
        >
          ₹
          {summary.outstandingAmount.toLocaleString(
            "en-IN"
          )}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
        <div>
          <p className="text-xs text-gray-500">
            Credits
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-800">
            ₹
            {summary.totalCredits.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Paid
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-800">
            ₹
            {summary.totalPaid.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>
      </div>

      <button
        onClick={() =>
          navigate(
            `/ledger/${summary.dealer.id}`
          )
        }
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Eye size={16} />

        View Ledger
      </button>
    </div>
  );
}