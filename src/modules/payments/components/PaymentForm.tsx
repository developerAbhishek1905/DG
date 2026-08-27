import {
  Building2,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  searchPaymentDealers,
} from "../services/paymentApi";

import type {
  PaymentDealer,
  RecordPaymentPayload,
} from "../types/payment.types";

interface PaymentFormValues {
  amount: number;

  paymentMethod:
    RecordPaymentPayload["paymentMethod"];

  transactionReference?: string;

  bankReference?: string;

  chequeNumber?: string;

  paymentDate: string;

  remarks?: string;
}

interface Props {
  onSubmit: (
    data: RecordPaymentPayload
  ) => Promise<void>;

  submitting?: boolean;
}

export default function PaymentForm({
  onSubmit,
  submitting = false,
}: Props) {
  const [
    dealerSearch,
    setDealerSearch,
  ] =
    useState("");

  const [
    dealerResults,
    setDealerResults,
  ] =
    useState<
      PaymentDealer[]
    >([]);

  const [
    selectedDealer,
    setSelectedDealer,
  ] =
    useState<
      PaymentDealer | null
    >(null);

  const [
    searching,
    setSearching,
  ] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,

    formState: {
      errors,
    },
  } =
    useForm<PaymentFormValues>({
      defaultValues: {
        paymentMethod:
          "BANK_TRANSFER",

        paymentDate:
          new Date()
            .toISOString()
            .split("T")[0],

        amount: 0,

        remarks: "",
      },
    });

  const paymentMethod =
    watch(
      "paymentMethod"
    );

  useEffect(() => {
    if (
      selectedDealer ||
      dealerSearch.trim()
        .length < 2
    ) {
      setDealerResults(
        []
      );

      return;
    }

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setSearching(
              true
            );

            const results =
              await searchPaymentDealers(
                dealerSearch
              );

            setDealerResults(
              results
            );
          } finally {
            setSearching(
              false
            );
          }
        },
        300
      );

    return () =>
      window.clearTimeout(
        timeout
      );
  }, [
    dealerSearch,
    selectedDealer,
  ]);

  const submit =
    async (
      data: PaymentFormValues
    ) => {
      if (
        !selectedDealer
      ) {
        return;
      }

      await onSubmit({
        dealerId:
          selectedDealer.id,

        amount:
          Number(
            data.amount
          ),

        paymentMethod:
          data.paymentMethod,

        transactionReference:
          data.transactionReference,

        bankReference:
          data.bankReference,

        chequeNumber:
          data.chequeNumber,

        paymentDate:
          data.paymentDate,

        remarks:
          data.remarks,
      });
    };

  return (
    <form
      onSubmit={
        handleSubmit(
          submit
        )
      }
      className="space-y-6"
    >
      {/* Dealer */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Dealer
        </label>

        {!selectedDealer ? (
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              value={
                dealerSearch
              }
              onChange={(
                event
              ) =>
                setDealerSearch(
                  event.target
                    .value
                )
              }
              placeholder="Search dealer name, code, phone or city..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#123B7A]"
            />

            {dealerSearch.trim()
              .length >= 2 && (
              <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                {searching ? (
                  <div className="p-5 text-center text-sm text-gray-500">
                    Searching...
                  </div>
                ) : dealerResults.length >
                  0 ? (
                  dealerResults.map(
                    (
                      dealer
                    ) => (
                      <button
                        type="button"
                        key={
                          dealer.id
                        }
                        onClick={() => {
                          setSelectedDealer(
                            dealer
                          );

                          setDealerSearch(
                            ""
                          );

                          setDealerResults(
                            []
                          );
                        }}
                        className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-none hover:bg-gray-50"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
                          <Building2
                            size={
                              17
                            }
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {
                              dealer.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {
                              dealer.dealerCode
                            }

                            {dealer.city &&
                              ` • ${dealer.city}`}

                            {dealer.phone &&
                              ` • ${dealer.phone}`}
                          </p>
                        </div>
                      </button>
                    )
                  )
                ) : (
                  <div className="p-5 text-center text-sm text-gray-500">
                    No dealer
                    found.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#123B7A]">
                <Building2
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {
                    selectedDealer.name
                  }
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {
                    selectedDealer.dealerCode
                  }

                  {selectedDealer.city &&
                    ` • ${selectedDealer.city}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedDealer(
                  null
                )
              }
              className="rounded-lg p-2 text-gray-500 hover:bg-white"
            >
              <X
                size={17}
              />
            </button>
          </div>
        )}

        {!selectedDealer && (
          <p className="mt-2 text-xs text-gray-500">
            Select a dealer before
            recording payment.
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Amount */}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Payment Amount
          </label>

          <input
            type="number"
            min={1}
            step="0.01"
            {...register(
              "amount",
              {
                required:
                  "Amount is required",

                valueAsNumber:
                  true,

                min: {
                  value: 1,

                  message:
                    "Amount must be greater than zero",
                },
              }
            )}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />

          {errors.amount && (
            <p className="mt-1 text-xs text-red-600">
              {
                errors.amount
                  .message
              }
            </p>
          )}
        </div>

        {/* Method */}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Payment Method
          </label>

          <select
            {...register(
              "paymentMethod"
            )}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
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

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>

        {/* Date */}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Payment Date
          </label>

          <input
            type="date"
            {...register(
              "paymentDate",
              {
                required:
                  "Payment date is required",
              }
            )}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />
        </div>

        {/* Transaction Ref */}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Transaction Reference
          </label>

          <input
            {...register(
              "transactionReference"
            )}
            placeholder="Transaction ID"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />
        </div>

        {[
          "BANK_TRANSFER",
          "NEFT",
          "RTGS",
          "IMPS",
        ].includes(
          paymentMethod
        ) && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bank / UTR Reference
            </label>

            <input
              {...register(
                "bankReference"
              )}
              placeholder="Enter UTR number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
        )}

        {paymentMethod ===
          "CHEQUE" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cheque Number
            </label>

            <input
              {...register(
                "chequeNumber"
              )}
              placeholder="Enter cheque number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Remarks
        </label>

        <textarea
          {...register(
            "remarks"
          )}
          rows={4}
          placeholder="Optional payment remarks..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="flex justify-end border-t pt-5">
        <button
          type="submit"
          disabled={
            submitting ||
            !selectedDealer
          }
          className="rounded-lg bg-[#123B7A] px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Recording..."
            : "Record Payment"}
        </button>
      </div>
    </form>
  );
}