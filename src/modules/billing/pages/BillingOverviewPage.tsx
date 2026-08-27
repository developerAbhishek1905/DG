import {
  ReceiptText,
  Settings2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import BillingStats from "../components/BillingStats";

import {
  getBills,
} from "../services/billingApi";

import type {
  Bill,
} from "../types/billing.types";

export default function BillingOverviewPage() {
  const navigate =
    useNavigate();

  const [
    bills,
    setBills,
  ] =
    useState<Bill[]>([]);

  useEffect(() => {
    getBills().then(
      setBills
    );
  }, []);

  const approvedAmount =
    bills
      .filter(
        (bill) =>
          bill.status ===
          "APPROVED"
      )
      .reduce(
        (sum, bill) =>
          sum +
          bill.totalAmount,
        0
      );

  const paidAmount =
    bills
      .filter(
        (bill) =>
          bill.status ===
          "PAID"
      )
      .reduce(
        (sum, bill) =>
          sum +
          bill.totalAmount,
        0
      );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Billing Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor complaint billing and dealer payable amounts.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(
                "/billing/rates"
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm"
          >
            <Settings2
              size={17}
            />

            Rate Master
          </button>

          <button
            onClick={() =>
              navigate(
                "/billing/bills"
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm text-white"
          >
            <ReceiptText
              size={17}
            />

            View Bills
          </button>
        </div>
      </div>

      <BillingStats
        bills={bills}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AmountCard
          label="Total Generated"
          value={bills.reduce(
            (sum, bill) =>
              sum +
              bill.totalAmount,
            0
          )}
        />

        <AmountCard
          label="Approved Payable"
          value={
            approvedAmount
          }
        />

        <AmountCard
          label="Paid"
          value={
            paidAmount
          }
        />
      </div>
    </div>
  );
}

function AmountCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        ₹
        {value.toLocaleString(
          "en-IN"
        )}
      </p>
    </div>
  );
}