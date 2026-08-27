import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
} from "lucide-react";

interface Props {
  expected: number;
  actual: number;
  difference: number;
}

export default function DifferenceCard({
  expected,
  actual,
  difference,
}: Props) {
  const matched =
    difference === 0;

  return (
    <div
      className={`rounded-xl border p-6 ${
        matched
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">
            Reconciliation Difference
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              matched
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            ₹
            {Math.abs(
              difference
            ).toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        {matched ? (
          <CheckCircle2
            size={28}
            className="text-green-600"
          />
        ) : (
          <AlertTriangle
            size={28}
            className="text-red-600"
          />
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-black/10 pt-5">
        <div>
          <p className="text-xs text-gray-500">
            Expected Balance
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            ₹
            {expected.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Actual Ledger Balance
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            ₹
            {actual.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>
      </div>

      {!matched && (
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-red-700">
          {difference >
          0 ? (
            <ArrowUp
              size={16}
            />
          ) : (
            <ArrowDown
              size={16}
            />
          )}

          {difference > 0
            ? "Ledger balance is higher than expected"
            : "Ledger balance is lower than expected"}
        </div>
      )}

      {matched && (
        <p className="mt-5 text-sm font-medium text-green-700">
          Expected and actual
          balances match.
        </p>
      )}
    </div>
  );
}