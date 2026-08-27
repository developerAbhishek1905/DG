import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import BillDetails from "../components/BillDetails";

import {
  approveBill,
  getBillById,
  rejectBill,
} from "../services/billingApi";

import type {
  Bill,
} from "../types/billing.types";

export default function BillDetailsPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [
    bill,
    setBill,
  ] =
    useState<
      Bill | null
    >(null);

  useEffect(() => {
    if (!id) return;

    getBillById(id).then(
      (data) =>
        setBill(
          data
            ? { ...data }
            : null
        )
    );
  }, [id]);

  if (!bill) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Bill not found.
      </div>
    );
  }

  const handleApprove =
    async () => {
      const updated =
        await approveBill({
          billId:
            bill.id,

          remarks:
            "Bill reviewed and approved.",
        });

      setBill({
        ...updated,
      });
    };

  const handleReject =
    async () => {
      const reason =
        window.prompt(
          "Enter rejection reason"
        );

      if (!reason) {
        return;
      }

      const updated =
        await rejectBill({
          billId:
            bill.id,

          reason,
        });

      setBill({
        ...updated,
      });
    };

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <button
          onClick={() =>
            navigate(
              "/billing/bills"
            )
          }
          className="inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft
            size={17}
          />

          Back to Bills
        </button>

        {[
          "GENERATED",
          "UNDER_REVIEW",
        ].includes(
          bill.status
        ) && (
          <div className="flex gap-2">
            <button
              onClick={
                handleReject
              }
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm text-red-600"
            >
              <XCircle
                size={17}
              />

              Reject
            </button>

            <button
              onClick={
                handleApprove
              }
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm text-white"
            >
              <CheckCircle2
                size={17}
              />

              Approve Bill
            </button>
          </div>
        )}
      </div>

      <BillDetails
        bill={bill}
      />

      {bill.status ===
        "REJECTED" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-semibold text-red-700">
            Bill Rejected
          </h3>

          <p className="mt-2 text-sm text-red-600">
            {
              bill.rejectionReason
            }
          </p>
        </div>
      )}
    </div>
  );
}