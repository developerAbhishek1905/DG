import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppSelector,
} from "../../../app/hooks";

import BillingFilters from "../components/BillingFilters";
import BillingStats from "../components/BillingStats";
import BillingTable from "../components/BillingTable";

import {
  getBills,
} from "../services/billingApi";

import type {
  Bill,
} from "../types/billing.types";

export default function BillListPage() {
  const [
    bills,
    setBills,
  ] =
    useState<Bill[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const {
    search,
    status,
    type,
  } = useAppSelector(
    (state) =>
      state.billing
  );

  useEffect(() => {
    const load =
      async () => {
        try {
          setLoading(true);

          setBills(
            await getBills()
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
        bills.filter(
          (bill) => {
            const query =
              search
                .trim()
                .toLowerCase();

            return (
              (!query ||
                bill.billNumber
                  .toLowerCase()
                  .includes(
                    query
                  ) ||
                bill.complaintNumber
                  .toLowerCase()
                  .includes(
                    query
                  ) ||
                bill.dealer.name
                  .toLowerCase()
                  .includes(
                    query
                  )) &&
              (status ===
                "ALL" ||
                bill.status ===
                  status) &&
              (type ===
                "ALL" ||
                bill.closureType ===
                  type)
            );
          }
        ),
      [
        bills,
        search,
        status,
        type,
      ]
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bills
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review generated service bills.
        </p>
      </div>

      <BillingStats
        bills={bills}
      />

      <BillingFilters />

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading bills...
        </div>
      ) : (
        <BillingTable
          bills={filtered}
        />
      )}
    </div>
  );
}