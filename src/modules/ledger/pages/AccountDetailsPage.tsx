
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw, Search, Wallet } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAccountById,
  type Account,
} from "../services/accountApi";

interface DealerBalanceRow {
  dealerId: string;
  headCode: string;
  dealerName: string;
  mobileNumber: string;
  totalDebit: number;
  totalCredit: number;
  netAmount: number;
  netType: "DEBIT" | "CREDIT" | "BALANCED";
  totalEntries: number;
}

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as { response?: { data?: { message?: string } } }
    ).response;

    return response?.data?.message || "Failed to load account";
  }

  return "Failed to load account";
};

export default function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | FETCH ACCOUNT
  |--------------------------------------------------------------------------
  */

  const loadAccount = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getAccountById(id);
      setAccount(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  /*
  |--------------------------------------------------------------------------
  | GROUP BALANCES BY DEALER
  |--------------------------------------------------------------------------
  */

  const dealerBalances = useMemo<DealerBalanceRow[]>(() => {
    if (!account) return [];

    const dealerMap = new Map<string, DealerBalanceRow>();

    for (const entry of account.balance ?? []) {
      const dealer = entry.dealerId;

      if (!dealer?._id) continue;

      const dealerId = dealer._id;

      if (!dealerMap.has(dealerId)) {
        dealerMap.set(dealerId, {
          dealerId,
          headCode: dealer.headCode || "-",
          dealerName:
            dealer.technicianFirmName ||
            dealer.technicianName ||
            "Unknown Dealer",
          mobileNumber: dealer.mobileNumber || "-",
          totalDebit: 0,
          totalCredit: 0,
          netAmount: 0,
          netType: "BALANCED",
          totalEntries: 0,
        });
      }

      const row = dealerMap.get(dealerId)!;

      if (entry.accountType === "DEBIT") {
        row.totalDebit += Number(entry.amount) || 0;
      } else {
        row.totalCredit += Number(entry.amount) || 0;
      }

      row.totalEntries += 1;
    }

    return Array.from(dealerMap.values()).map((row) => {
      const difference = row.totalCredit - row.totalDebit;

      return {
        ...row,
        netAmount: Math.abs(difference),
        netType:
          difference > 0
            ? "CREDIT"
            : difference < 0
              ? "DEBIT"
              : "BALANCED",
      };
    });
  }, [account]);

  /*
  |--------------------------------------------------------------------------
  | FILTER DEALERS
  |--------------------------------------------------------------------------
  */

  const filteredDealers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return dealerBalances;

    return dealerBalances.filter((dealer) =>
      [
        dealer.headCode,
        dealer.dealerName,
        dealer.mobileNumber,
      ].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [dealerBalances, search]);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const summary = useMemo(() => {
    const totalDebit = dealerBalances.reduce(
      (sum, dealer) => sum + dealer.totalDebit,
      0,
    );

    const totalCredit = dealerBalances.reduce(
      (sum, dealer) => sum + dealer.totalCredit,
      0,
    );

    const difference = totalCredit - totalDebit;

    return {
      totalDealers: dealerBalances.length,
      totalDebit,
      totalCredit,
      netAmount: Math.abs(difference),
      netType:
        difference > 0
          ? "CREDIT"
          : difference < 0
            ? "DEBIT"
            : "BALANCED",
    };
  }, [dealerBalances]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        Loading account details...
      </div>
    );
  }

  if (!account) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/accounts")}
          className="flex items-center gap-2 text-sm text-[#123B7A]"
        >
          <ArrowLeft size={17} />
          Back to Accounts
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          Account not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="mb-2 flex items-center gap-2 text-sm text-gray-500 hover:text-[#123B7A]"
          >
            <ArrowLeft size={16} />
            Back to Accounts
          </button>

          <h1 className="text-xl font-bold text-gray-900">
            {account.accountName}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Dealer-wise account balance details
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadAccount()}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Total Dealers
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {summary.totalDealers}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Total Debit
          </p>

          <h2 className="mt-2 text-2xl font-bold text-red-600">
            {formatAmount(summary.totalDebit)}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Total Credit
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {formatAmount(summary.totalCredit)}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Net Balance
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#123B7A]">
            {formatAmount(summary.netAmount)}
            <span className="ml-2 text-sm">
              {summary.netType === "BALANCED"
                ? ""
                : summary.netType === "CREDIT"
                  ? "Cr"
                  : "Dr"}
            </span>
          </h2>
        </div>
      </div>

      {/* DEALER TABLE */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Dealer Balances
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredDealers.length} dealers
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dealer..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#123B7A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Dealer</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3 text-right">Debit</th>
                <th className="px-4 py-3 text-right">Credit</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-center">Entries</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredDealers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <Wallet
                      size={28}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    No dealer balances found
                  </td>
                </tr>
              ) : (
                filteredDealers.map((dealer) => (
                  <tr
                    key={dealer.dealerId}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {dealer.dealerName}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {dealer.headCode}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {dealer.mobileNumber}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-red-600">
                      {formatAmount(dealer.totalDebit)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-green-600">
                      {formatAmount(dealer.totalCredit)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-semibold ${
                          dealer.netType === "DEBIT"
                            ? "text-red-600"
                            : dealer.netType === "CREDIT"
                              ? "text-green-600"
                              : "text-gray-600"
                        }`}
                      >
                        {formatAmount(dealer.netAmount)}
                        {" "}
                        {dealer.netType === "BALANCED"
                          ? ""
                          : dealer.netType === "CREDIT"
                            ? "Cr"
                            : "Dr"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center text-gray-600">
                      {dealer.totalEntries}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {filteredDealers.length > 0 && (
              <tfoot className="border-t border-gray-200 bg-gray-50 font-semibold">
                <tr>
                  <td colSpan={2} className="px-4 py-3">
                    Total
                  </td>

                  <td className="px-4 py-3 text-right text-red-600">
                    {formatAmount(
                      filteredDealers.reduce(
                        (sum, dealer) => sum + dealer.totalDebit,
                        0,
                      ),
                    )}
                  </td>

                  <td className="px-4 py-3 text-right text-green-600">
                    {formatAmount(
                      filteredDealers.reduce(
                        (sum, dealer) => sum + dealer.totalCredit,
                        0,
                      ),
                    )}
                  </td>

                  <td className="px-4 py-3 text-right text-[#123B7A]">
                    {formatAmount(
                      Math.abs(
                        filteredDealers.reduce(
                          (sum, dealer) =>
                            sum +
                            dealer.totalCredit -
                            dealer.totalDebit,
                          0,
                        ),
                      ),
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {filteredDealers.reduce(
                      (sum, dealer) => sum + dealer.totalEntries,
                      0,
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
