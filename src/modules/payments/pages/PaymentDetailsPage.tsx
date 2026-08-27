import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Landmark,
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

import PaymentStatusBadge from "../components/PaymentStatusBadge";

import {
  getPaymentById,
  markPaymentFailed,
  markPaymentSuccessful,
} from "../services/paymentApi";

import type {
  Payment,
} from "../types/payment.types";

export default function PaymentDetailsPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [
    payment,
    setPayment,
  ] =
    useState<
      Payment | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    if (!id) return;

    const load =
      async () => {
        try {
          setLoading(true);

          const data =
            await getPaymentById(
              id
            );

          setPayment(
            data
              ? { ...data }
              : null
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, [id]);

  const handleSuccess =
    async () => {
      if (!payment) {
        return;
      }

      const updated =
        await markPaymentSuccessful(
          payment.id
        );

      setPayment({
        ...updated,
      });
    };

  const handleFailed =
    async () => {
      if (!payment) {
        return;
      }

      const reason =
        window.prompt(
          "Enter failure reason"
        );

      if (!reason) {
        return;
      }

      const updated =
        await markPaymentFailed(
          payment.id,
          reason
        );

      setPayment({
        ...updated,
      });
    };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading payment...
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Payment not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <button
          onClick={() =>
            navigate(
              "/payments"
            )
          }
          className="inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft
            size={17}
          />

          Back to Payments
        </button>

        {[
          "PENDING",
          "PROCESSING",
        ].includes(
          payment.status
        ) && (
          <div className="flex gap-2">
            <button
              onClick={
                handleFailed
              }
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600"
            >
              <XCircle
                size={17}
              />

              Mark Failed
            </button>

            <button
              onClick={
                handleSuccess
              }
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <CheckCircle2
                size={17}
              />

              Mark Successful
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b p-6 md:flex-row">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#123B7A]">
              Payment
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {
                payment.paymentNumber
              }
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Recorded{" "}
              {new Date(
                payment.createdAt
              ).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <PaymentStatusBadge
            status={
              payment.status
            }
          />
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <Info
            icon={
              Building2
            }
            label="Dealer"
            value={
              payment.dealer
                .name
            }
          />

          <Info
            icon={
              CreditCard
            }
            label="Method"
            value={payment.paymentMethod.replaceAll(
              "_",
              " "
            )}
          />

          <Info
            icon={
              FileText
            }
            label="Reference"
            value={
              payment.transactionReference ??
              "-"
            }
          />

          <Info
            icon={
              Landmark
            }
            label="Bank Reference"
            value={
              payment.bankReference ??
              "-"
            }
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          Payment Amount
        </p>

        <p className="mt-2 text-3xl font-bold text-gray-900">
          ₹
          {payment.amount.toLocaleString(
            "en-IN"
          )}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">
          Payment Information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Info
            label="Dealer Code"
            value={
              payment.dealer
                .dealerCode
            }
          />

          <Info
            label="Payment Date"
            value={new Date(
              payment.paymentDate
            ).toLocaleDateString(
              "en-IN"
            )}
          />

          <Info
            label="Recorded By"
            value={
              payment.recordedBy
            }
          />

          <Info
            label="Ledger Transaction"
            value={
              payment.ledgerTransactionId ??
              "Not posted yet"
            }
          />

          {payment.chequeNumber && (
            <Info
              label="Cheque Number"
              value={
                payment.chequeNumber
              }
            />
          )}

          {payment.approvedBy && (
            <Info
              label="Approved By"
              value={
                payment.approvedBy
              }
            />
          )}
        </div>

        {payment.remarks && (
          <div className="mt-6 border-t pt-5">
            <p className="text-xs text-gray-500">
              Remarks
            </p>

            <p className="mt-2 text-sm text-gray-700">
              {
                payment.remarks
              }
            </p>
          </div>
        )}
      </div>

      {payment.status ===
        "FAILED" &&
        payment.failureReason && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              Payment Failed
            </p>

            <p className="mt-2 text-sm text-red-600">
              {
                payment.failureReason
              }
            </p>
          </div>
        )}

      {payment.status ===
        "SUCCESS" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="font-semibold text-green-700">
            Payment Successful
          </p>

          <p className="mt-1 text-sm text-green-600">
            This payment should
            now be posted to the
            dealer ledger.
          </p>
        </div>
      )}
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;

  label: string;

  value: string;
}) {
  return (
    <div className="flex gap-3">
      {Icon && (
        <Icon
          size={17}
          className="mt-1 shrink-0 text-gray-400"
        />
      )}

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}