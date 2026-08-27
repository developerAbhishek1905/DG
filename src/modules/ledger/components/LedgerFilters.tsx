import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  clearLedgerFilters,
  setLedgerDateFrom,
  setLedgerDateTo,
  setLedgerSearch,
  setLedgerStatus,
  setLedgerTransactionType,
} from "../store/ledgerSlice";

import type {
  LedgerTransactionStatus,
  LedgerTransactionType,
} from "../types/ledger.types";

export default function LedgerFilters() {
  const dispatch =
    useAppDispatch();

  const {
    search,
    transactionType,
    status,
    dateFrom,
    dateTo,
  } = useAppSelector(
    (state) =>
      state.ledger
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              dispatch(
                setLedgerSearch(
                  event.target.value
                )
              )
            }
            placeholder="Search transaction, bill or complaint..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
          />
        </div>

        <select
          value={
            transactionType
          }
          onChange={(event) =>
            dispatch(
              setLedgerTransactionType(
                event.target.value as
                  | LedgerTransactionType
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Transactions
          </option>

          <option value="BILL_CREDIT">
            Bill Credit
          </option>

          <option value="PAYMENT_DEBIT">
            Payment
          </option>

          <option value="ADJUSTMENT_CREDIT">
            Adjustment Credit
          </option>

          <option value="ADJUSTMENT_DEBIT">
            Adjustment Debit
          </option>

          <option value="REVERSAL">
            Reversal
          </option>

          <option value="OPENING_BALANCE">
            Opening Balance
          </option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setLedgerStatus(
                event.target.value as
                  | LedgerTransactionStatus
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="POSTED">
            Posted
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="REVERSED">
            Reversed
          </option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(event) =>
            dispatch(
              setLedgerDateFrom(
                event.target.value
              )
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(event) =>
            dispatch(
              setLedgerDateTo(
                event.target.value
              )
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        />

        <button
          onClick={() =>
            dispatch(
              clearLedgerFilters()
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
  );
}