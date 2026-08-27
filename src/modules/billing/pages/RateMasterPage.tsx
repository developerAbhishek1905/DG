import {
  Plus,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import RateForm from "../components/RateForm";
import RateTable from "../components/RateTable";

import {
  createRate,
  getRates,
  updateRate,
} from "../services/billingApi";

import {
  setRateSearch,
} from "../store/billingSlice";

import type {
  RateFormData,
  RateMaster,
} from "../types/billing.types";

export default function RateMasterPage() {
  const dispatch =
    useAppDispatch();

  const {
    rateSearch,
  } = useAppSelector(
    (state) =>
      state.billing
  );

  const [
    rates,
    setRates,
  ] =
    useState<
      RateMaster[]
    >([]);

  const [
    formOpen,
    setFormOpen,
  ] =
    useState(false);

  const [
    selectedRate,
    setSelectedRate,
  ] =
    useState<
      RateMaster | undefined
    >();

  const loadRates =
    async () => {
      setRates(
        await getRates()
      );
    };

  useEffect(() => {
    loadRates();
  }, []);

  const filtered =
    useMemo(
      () =>
        rates.filter(
          (rate) => {
            const query =
              rateSearch
                .trim()
                .toLowerCase();

            return (
              !query ||
              rate.code
                .toLowerCase()
                .includes(
                  query
                ) ||
              rate.serviceName
                .toLowerCase()
                .includes(
                  query
                )
            );
          }
        ),
      [
        rates,
        rateSearch,
      ]
    );

  const handleSubmit =
    async (
      data: RateFormData
    ) => {
      if (
        selectedRate
      ) {
        await updateRate(
          selectedRate.id,
          data
        );
      } else {
        await createRate(
          data
        );
      }

      setFormOpen(false);

      setSelectedRate(
        undefined
      );

      await loadRates();
    };

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rate Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Configure billing rates for complaint closure types.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedRate(
              undefined
            );

            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm text-white"
        >
          <Plus size={17} />

          Add Rate
        </button>
      </div>

      <div className="relative max-w-lg">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={
            rateSearch
          }
          onChange={(
            event
          ) =>
            dispatch(
              setRateSearch(
                event.target.value
              )
            )
          }
          placeholder="Search rate..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
        />
      </div>

      <RateTable
        rates={filtered}
        onEdit={(rate) => {
          setSelectedRate(
            rate
          );

          setFormOpen(true);
        }}
      />

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-semibold">
              {selectedRate
                ? "Edit Rate"
                : "Create Rate"}
            </h2>

            <RateForm
              rate={
                selectedRate
              }
              onSubmit={
                handleSubmit
              }
              onCancel={() => {
                setFormOpen(
                  false
                );

                setSelectedRate(
                  undefined
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}