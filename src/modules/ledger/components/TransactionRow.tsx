import {
  Eye,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  LedgerTransaction,
} from "../types/ledger.types";

interface Props {
  transaction: LedgerTransaction;
}

export default function TransactionRow({
  transaction,
}: Props) {
  const navigate =
    useNavigate();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-5 py-4">
        <button
          onClick={() =>
            navigate(
              `/ledger/transactions/${transaction.id}`
            )
          }
          className="text-sm font-semibold text-[#123B7A] hover:underline"
        >
          {
            transaction.transactionNumber
          }
        </button>

        <p className="mt-1 text-xs text-gray-400">
          {
            transaction.id
          }
        </p>
      </td>

      <td className="px-5 py-4">
        <TypeBadge
          type={
            transaction.transactionType
          }
        />
      </td>

      <td className="px-5 py-4 text-sm text-gray-600">
        {
          transaction.referenceNumber ??
          "-"
        }
      </td>

      <td className="max-w-xs px-5 py-4 text-sm text-gray-600">
        {
          transaction.description
        }
      </td>

      <td className="px-5 py-4 text-sm font-medium text-green-700">
        {transaction.credit
          ? `₹${transaction.credit.toLocaleString(
              "en-IN"
            )}`
          : "-"}
      </td>

      <td className="px-5 py-4 text-sm font-medium text-red-600">
        {transaction.debit
          ? `₹${transaction.debit.toLocaleString(
              "en-IN"
            )}`
          : "-"}
      </td>

      <td className="px-5 py-4 text-sm font-bold text-gray-900">
        ₹
        {transaction.balance.toLocaleString(
          "en-IN"
        )}
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          status={
            transaction.status
          }
        />
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
        {new Date(
          transaction.transactionDate
        ).toLocaleString()}
      </td>

      <td className="px-5 py-4">
        <button
          onClick={() =>
            navigate(
              `/ledger/transactions/${transaction.id}`
            )
          }
          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye size={17} />
        </button>
      </td>
    </tr>
  );
}

function TypeBadge({
  type,
}: {
  type:
    LedgerTransaction["transactionType"];
}) {
  const styles = {
    BILL_CREDIT:
      "border-green-200 bg-green-50 text-green-700",

    PAYMENT_DEBIT:
      "border-blue-200 bg-blue-50 text-blue-700",

    ADJUSTMENT_CREDIT:
      "border-purple-200 bg-purple-50 text-purple-700",

    ADJUSTMENT_DEBIT:
      "border-amber-200 bg-amber-50 text-amber-700",

    REVERSAL:
      "border-red-200 bg-red-50 text-red-700",

    OPENING_BALANCE:
      "border-gray-200 bg-gray-50 text-gray-700",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[type]}`}
    >
      {type.replaceAll(
        "_",
        " "
      )}
    </span>
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
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}