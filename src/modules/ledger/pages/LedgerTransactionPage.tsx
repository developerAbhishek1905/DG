import {
  ArrowDownCircle,
  ArrowLeft,
  ArrowUpCircle,
  Building2,
  FileText,
  ReceiptText,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getLedgerTransactionById,
} from "../services/ledgerApi";

import type {
  LedgerTransaction,
} from "../types/ledger.types";

export default function LedgerTransactionPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [
    transaction,
    setTransaction,
  ] =
    useState<
      LedgerTransaction | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    const load =
      async () => {
        try {
          setLoading(true);

          const data =
            await getLedgerTransactionById(
              id
            );

          setTransaction(
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

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading transaction...
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Transaction not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(
            `/ledger/${transaction.dealerId}`
          )
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft
          size={17}
        />

        Back to Dealer Ledger
      </button>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <p className="text-xs font-medium text-[#123B7A]">
              {
                transaction.transactionNumber
              }
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Ledger Transaction
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {
                transaction.id
              }
            </p>
          </div>

          <StatusBadge
            status={
              transaction.status
            }
          />
        </div>

        <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <Info
            icon={
              Building2
            }
            label="Dealer"
            value={
              transaction.dealer
                .name
            }
          />

          <Info
            icon={
              ReceiptText
            }
            label="Type"
            value={transaction.transactionType.replaceAll(
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
              transaction.referenceNumber ??
              "-"
            }
          />

          <Info
            label="Date"
            value={new Date(
              transaction.transactionDate
            ).toLocaleString()}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AmountCard
          icon={
            ArrowUpCircle
          }
          label="Credit"
          amount={
            transaction.credit
          }
        />

        <AmountCard
          icon={
            ArrowDownCircle
          }
          label="Debit"
          amount={
            transaction.debit
          }
        />

        <AmountCard
          label="Balance"
          amount={
            transaction.balance
          }
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-gray-900">
          Transaction Details
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Info
            label="Description"
            value={
              transaction.description
            }
          />

          <Info
            label="Created By"
            value={
              transaction.createdBy
            }
          />

          <Info
            label="Complaint"
            value={
              transaction.complaintNumber ??
              "-"
            }
          />

          <Info
            label="Reference Type"
            value={
              transaction.referenceType
            }
          />
        </div>

        {transaction.remarks && (
          <div className="mt-5 border-t pt-5">
            <p className="text-xs text-gray-500">
              Remarks
            </p>

            <p className="mt-2 text-sm text-gray-700">
              {
                transaction.remarks
              }
            </p>
          </div>
        )}
      </div>
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
          className="mt-1 text-gray-400"
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

function AmountCard({
  icon: Icon,
  label,
  amount,
}: {
  icon?: React.ElementType;
  label: string;
  amount: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹
            {amount.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        {Icon && (
          <Icon
            size={22}
            className="text-[#123B7A]"
          />
        )}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    LedgerTransaction["status"];
}) {
  const styles = {
    POSTED:
      "border-green-200 bg-green-50 text-green-700",

    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",

    REVERSED:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`h-fit rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}