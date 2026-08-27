import {
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import PaymentSummary from "../components/PaymentSummary";
import PaymentTable from "../components/PaymentTable";

import {
  getPayments,
  getPaymentSummary,
} from "../services/paymentApi";

import {
  clearPaymentFilters,
  setPaymentDateFrom,
  setPaymentDateTo,
  setPaymentMethod,
  setPaymentSearch,
  setPaymentStatus,
} from "../store/paymentSlice";

import type {
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentSummaryData,
} from "../types/payment.types";

export default function PaymentListPage() {
  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  const {
    search,
    status,
    method,
    dateFrom,
    dateTo,
  } = useAppSelector(
    (state) =>
      state.payments
  );

  const [
    payments,
    setPayments,
  ] =
    useState<
      Payment[]
    >([]);

  const [
    summary,
    setSummary,
  ] =
    useState<
      PaymentSummaryData | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    const load =
      async () => {
        try {
          setLoading(true);

          const [
            paymentData,
            summaryData,
          ] =
            await Promise.all([
              getPayments(),
              getPaymentSummary(),
            ]);

          setPayments(
            paymentData
          );

          setSummary(
            summaryData
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, []);

  const filtered =
    useMemo(
      () =>
        payments.filter(
          (payment) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              payment.paymentNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              payment.dealer.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              payment.dealer.dealerCode
                .toLowerCase()
                .includes(
                  query
                ) ||
              payment.transactionReference
                ?.toLowerCase()
                .includes(
                  query
                ) ||
              payment.bankReference
                ?.toLowerCase()
                .includes(
                  query
                );

            const matchesStatus =
              status === "ALL" ||
              payment.status ===
                status;

            const matchesMethod =
              method === "ALL" ||
              payment.paymentMethod ===
                method;

            const matchesFrom =
              !dateFrom ||
              payment.paymentDate >=
                dateFrom;

            const matchesTo =
              !dateTo ||
              payment.paymentDate <=
                dateTo;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesMethod &&
              matchesFrom &&
              matchesTo
            );
          }
        ),
      [
        payments,
        search,
        status,
        method,
        dateFrom,
        dateTo,
      ]
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage dealer settlements
            and payment transactions.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/payments/record"
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={17} />

          Record Payment
        </button>
      </div>

      {summary && (
        <PaymentSummary
          summary={summary}
        />
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(
                event
              ) =>
                dispatch(
                  setPaymentSearch(
                    event.target
                      .value
                  )
                )
              }
              placeholder="Search payment, dealer or reference..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
            />
          </div>

          <select
            value={status}
            onChange={(
              event
            ) =>
              dispatch(
                setPaymentStatus(
                  event.target
                    .value as
                    | PaymentStatus
                    | "ALL"
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="PROCESSING">
              Processing
            </option>

            <option value="SUCCESS">
              Success
            </option>

            <option value="FAILED">
              Failed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>

            <option value="REVERSED">
              Reversed
            </option>
          </select>

          <select
            value={method}
            onChange={(
              event
            ) =>
              dispatch(
                setPaymentMethod(
                  event.target
                    .value as
                    | PaymentMethod
                    | "ALL"
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="ALL">
              All Methods
            </option>

            <option value="BANK_TRANSFER">
              Bank Transfer
            </option>

            <option value="UPI">
              UPI
            </option>

            <option value="NEFT">
              NEFT
            </option>

            <option value="RTGS">
              RTGS
            </option>

            <option value="IMPS">
              IMPS
            </option>

            <option value="CHEQUE">
              Cheque
            </option>

            <option value="CASH">
              Cash
            </option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(
              event
            ) =>
              dispatch(
                setPaymentDateFrom(
                  event.target
                    .value
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(
              event
            ) =>
              dispatch(
                setPaymentDateTo(
                  event.target
                    .value
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />

          <button
            onClick={() =>
              dispatch(
                clearPaymentFilters()
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            <RotateCcw
              size={16}
            />

            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading payments...
        </div>
      ) : (
        <PaymentTable
          payments={filtered}
        />
      )}
    </div>
  );
}