import {
  ArrowLeft,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import PaymentForm from "../components/PaymentForm";

import {
  recordPayment,
} from "../services/paymentApi";

import type {
  RecordPaymentPayload,
} from "../types/payment.types";

export default function RecordPaymentPage() {
  const navigate =
    useNavigate();

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const handleSubmit =
    async (
      data: RecordPaymentPayload
    ) => {
      try {
        setSubmitting(true);

        const payment =
          await recordPayment(
            data
          );

        navigate(
          `/payments/${payment.id}`
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to record payment"
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(
            "/payments"
          )
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft
          size={17}
        />

        Back to Payments
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Record Payment
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Record a payment made
          against a dealer's
          outstanding balance.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <PaymentForm
          submitting={
            submitting
          }
          onSubmit={
            handleSubmit
          }
        />
      </div>
    </div>
  );
}