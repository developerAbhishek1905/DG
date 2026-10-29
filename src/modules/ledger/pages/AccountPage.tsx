import { useCallback, useEffect, useMemo, useState } from "react";

import { TableSkeletonRows } from "../../../components/ui/TableSkeleton";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Wallet,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye
} from "lucide-react";

import { toast } from "react-toastify";

import {
  getAccounts,
  getAccountById,
  getAccountsDropdown,
  createAccount,
  updateAccount,
  deleteAccount,
  addAccountBalance,
  updateAccountBalance,
  deleteAccountBalance,
  type Account,
  type AccountBalance,
  type AccountDropdownOption,
  type BalancePayload,
} from "../services/accountApi";

import Pagination from "../../../components/ui/Pagination";
import api from "../../../services/api/axios";

import { useNavigate } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface DealerOption {
  _id: string;
  headCode: string;
  technicianFirmName: string;
  technicianName: string;
  mobileNumber?: string;
}

type BalanceType = "DEBIT" | "CREDIT";

interface BalanceForm {
  dealerId: string;
  amount: string;
  accountType: BalanceType;
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getErrorMessage = (error: any) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const emptyBalanceForm: BalanceForm = {
  dealerId: "",
  amount: "",
  accountType: "CREDIT",
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function AccountPage() {
  /*
  |--------------------------------------------------------------------------
  | ACCOUNT STATES
  |--------------------------------------------------------------------------
  */

  const navigate = useNavigate();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | ACCOUNT CREATE / EDIT MODAL
  |--------------------------------------------------------------------------
  */

  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [accountName, setAccountName] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ACCOUNT DETAILS
  |--------------------------------------------------------------------------
  */

  const [selectedAccountId, setSelectedAccountId] = useState("");

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [accountOptions, setAccountOptions] = useState<AccountDropdownOption[]>(
    [],
  );

  const [accountDropdownSearch, setAccountDropdownSearch] = useState("");

  const [loadingDetails, setLoadingDetails] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | DEALER BALANCE MODAL
  |--------------------------------------------------------------------------
  */

  const [balanceModalOpen, setBalanceModalOpen] = useState(false);

  const [editingBalance, setEditingBalance] = useState<AccountBalance | null>(
    null,
  );

  const [balanceForm, setBalanceForm] = useState<BalanceForm>(emptyBalanceForm);

  const [savingBalance, setSavingBalance] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | DEALER DROPDOWN
  |--------------------------------------------------------------------------
  */

  const [dealerOptions, setDealerOptions] = useState<DealerOption[]>([]);

  const [dealerSearch, setDealerSearch] = useState("");
  const [loadingDealers, setLoadingDealers] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | EXPAND
  |--------------------------------------------------------------------------
  */

  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | DEBOUNCE SEARCH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | LOAD ACCOUNTS
  |--------------------------------------------------------------------------
  */

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAccounts({
        search: debouncedSearch,
        page,
        limit,
      });

      setAccounts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, limit]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  /*
  |--------------------------------------------------------------------------
  | LOAD ACCOUNT DROPDOWN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      try {
        const data = await getAccountsDropdown(accountDropdownSearch.trim());

        if (active) {
          setAccountOptions(data);
        }
      } catch {
        if (active) {
          setAccountOptions([]);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [accountDropdownSearch, accounts]);

  /*
  |--------------------------------------------------------------------------
  | LOAD ACCOUNT DETAILS
  |--------------------------------------------------------------------------
  */

  const loadAccountDetails = useCallback(async (id: string) => {
    if (!id) {
      setSelectedAccount(null);
      return;
    }

    try {
      setLoadingDetails(true);

      const account = await getAccountById(id);

      setSelectedAccount(account);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSelectedAccount(null);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    void loadAccountDetails(selectedAccountId);
  }, [selectedAccountId, loadAccountDetails]);

  /*
  |--------------------------------------------------------------------------
  | LOAD DEALER DROPDOWN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!balanceModalOpen) return;

    let active = true;

    const timer = setTimeout(async () => {
      try {
        setLoadingDealers(true);

        const response = await api.get("/dealers/dropdown", {
          params: {
            search: dealerSearch.trim(),
          },
        });

        if (active) {
          setDealerOptions(response.data.data ?? []);
        }
      } catch (error) {
        if (active) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (active) {
          setLoadingDealers(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [dealerSearch, balanceModalOpen]);

  /*
  |--------------------------------------------------------------------------
  | ACCOUNT MODAL
  |--------------------------------------------------------------------------
  */

  const openCreateAccount = () => {
    setEditingAccount(null);
    setAccountName("");
    setAccountModalOpen(true);
  };

  const openEditAccount = (account: Account) => {
    setEditingAccount(account);
    setAccountName(account.accountName);
    setAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    if (savingAccount) return;

    setAccountModalOpen(false);
    setEditingAccount(null);
    setAccountName("");
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE / UPDATE ACCOUNT
  |--------------------------------------------------------------------------
  */

  const handleSaveAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = accountName.trim();

    if (!name) {
      toast.error("Account name is required");
      return;
    }

    try {
      setSavingAccount(true);

      if (editingAccount) {
        await updateAccount(editingAccount._id, name);
        toast.success("Account updated successfully");

        if (selectedAccountId === editingAccount._id) {
          await loadAccountDetails(editingAccount._id);
        }
      } else {
        await createAccount(name);
        toast.success("Account created successfully");
      }

      setAccountModalOpen(false);
      setEditingAccount(null);
      setAccountName("");

      await loadAccounts();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingAccount(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE ACCOUNT
  |--------------------------------------------------------------------------
  */

  const handleDeleteAccount = async (account: Account) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.accountName}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteAccount(account._id);

      toast.success("Account deleted successfully");

      if (selectedAccountId === account._id) {
        setSelectedAccountId("");
        setSelectedAccount(null);
      }

      if (accounts.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadAccounts();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  /*
  |--------------------------------------------------------------------------
  | BALANCE MODAL
  |--------------------------------------------------------------------------
  */

  const openAddBalance = (accountId: string) => {
    setSelectedAccountId(accountId);
    setEditingBalance(null);
    setBalanceForm({ ...emptyBalanceForm });
    setDealerSearch("");
    setDealerOptions([]);
    setBalanceModalOpen(true);
  };

  const openEditBalance = (entry: AccountBalance) => {
    setEditingBalance(entry);

    setBalanceForm({
      dealerId: entry.dealerId?._id ?? "",
      amount: String(entry.amount),
      accountType: entry.accountType,
    });

    setDealerSearch("");
    setDealerOptions([]);
    setBalanceModalOpen(true);
  };

  const closeBalanceModal = () => {
    if (savingBalance) return;

    setBalanceModalOpen(false);
    setEditingBalance(null);
    setBalanceForm({ ...emptyBalanceForm });
    setDealerSearch("");
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE DEALER BALANCE
  |--------------------------------------------------------------------------
  */

  const handleSaveBalance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedAccountId) {
      toast.error("Select an account");
      return;
    }

    if (!balanceForm.dealerId) {
      toast.error("Select a dealer");
      return;
    }

    const amount = Number(balanceForm.amount);

    if (
      balanceForm.amount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      toast.error("Amount must be greater than zero");
      return;
    }

    const payload: BalancePayload = {
      dealerId: balanceForm.dealerId,
      amount,
      accountType: balanceForm.accountType,
    };

    try {
      setSavingBalance(true);

      if (editingBalance) {
        await updateAccountBalance(
          selectedAccountId,
          editingBalance._id,
          payload,
        );

        toast.success("Balance entry updated successfully");
      } else {
        await addAccountBalance(selectedAccountId, payload);

        toast.success("Balance entry added successfully");
      }

      setBalanceModalOpen(false);
      setEditingBalance(null);
      setBalanceForm({ ...emptyBalanceForm });

      await Promise.all([
        loadAccountDetails(selectedAccountId),
        loadAccounts(),
      ]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingBalance(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE BALANCE ENTRY
  |--------------------------------------------------------------------------
  */

  const handleDeleteBalance = async (entry: AccountBalance) => {
    if (!selectedAccountId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this balance entry?",
    );

    if (!confirmed) return;

    try {
      await deleteAccountBalance(selectedAccountId, entry._id);

      toast.success("Balance entry deleted successfully");

      await Promise.all([
        loadAccountDetails(selectedAccountId),
        loadAccounts(),
      ]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const pageSummary = useMemo(() => {
    return accounts.reduce(
      (summary, account) => {
        summary.debit += account.summary?.totalDebit ?? 0;
        summary.credit += account.summary?.totalCredit ?? 0;
        return summary;
      },
      { debit: 0, credit: 0 },
    );
  }, [accounts]);

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-5">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Account Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage accounts and dealer debit / credit entries
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateAccount}
          className="flex items-center gap-2 rounded-lg bg-[#6D28D9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0d2d60]"
        >
          <Plus size={17} />
          Create Account
        </button>
      </div>


      {/* ACCOUNT LIST */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">All Accounts</h2>

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search accounts..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#6D28D9]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Account Name</th>
                <th className="px-4 py-3">Dealers</th>
                <th className="px-4 py-3">Debit</th>
                <th className="px-4 py-3">Credit</th>
                <th className="px-4 py-3">Net Balance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableSkeletonRows cols={6} />
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No accounts found
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                  <tr key={account._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Wallet size={17} className="text-[#6D28D9]" />
                        {account.accountName}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {account.summary?.totalDealers ?? 0}
                    </td>

                    <td className="px-4 py-3 text-red-600">
                      {formatAmount(account.summary?.totalDebit ?? 0)}
                    </td>

                    <td className="px-4 py-3 text-green-600">
                      {formatAmount(account.summary?.totalCredit ?? 0)}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {formatAmount(account.summary?.netAmount ?? 0)}
                      <span className="ml-1 text-xs text-gray-500">
                        {account.summary?.netType === "BALANCED"
                          ? ""
                          : account.summary?.netType}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {/* <button
                          type="button"
                          title="View Account"
                          onClick={() => {
                            const nextId =
                              expandedAccountId === account._id
                                ? null
                                : account._id;

                            setExpandedAccountId(nextId);

                            if (nextId) {
                              setSelectedAccountId(nextId);
                            }
                          }}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        >
                          {expandedAccountId === account._id ? (
                            <ChevronUp size={17} />
                          ) : (
                            <ChevronDown size={17} />
                          )}
                        </button> */}

                        <button
  type="button"
  title="View Account Dealers"
  onClick={() => navigate(`/accounts/${account._id}`)}
  className="rounded-lg p-2 text-[#6D28D9] transition hover:bg-blue-50"
>
  <Eye size={17} />
</button>

                        <button
                          type="button"
                          title="Edit Account"
                          onClick={() => openEditAccount(account)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete Account"
                          onClick={() => handleDeleteAccount(account)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Adjust props to match your existing Pagination component */}
        <Pagination
          page={page}
          limit={limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          onLimitChange={(value: number) => {
            setLimit(value);
            setPage(1);
          }}
        />
      </div>

      {/* ACCOUNT DETAILS */}
      {selectedAccountId && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4">
            <div>
              <h2 className="text-base font-semibold">Account Details</h2>
              <p className="text-xs text-gray-500">
                View and manage dealer balance entries
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadAccountDetails(selectedAccountId)}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="space-y-4 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Search Account
                </label>

                <input
                  value={accountDropdownSearch}
                  onChange={(e) => setAccountDropdownSearch(e.target.value)}
                  placeholder="Search account..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Select Account
                </label>

                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select Account</option>

                  {!accountOptions.some(
                    (option) => option._id === selectedAccountId,
                  ) &&
                    selectedAccount && (
                      <option value={selectedAccount._id}>
                        {selectedAccount.accountName}
                      </option>
                    )}

                  {accountOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.accountName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loadingDetails ? (
              <div className="py-10 text-center text-sm text-gray-500">
                Loading account details...
              </div>
            ) : selectedAccount ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedAccount.accountName}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {selectedAccount.summary.totalEntries} entries
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAddBalance(selectedAccount._id)}
                    className="flex items-center gap-2 rounded-lg bg-[#6D28D9] px-4 py-2.5 text-sm font-medium text-white"
                  >
                    <Plus size={16} />
                    Add Dealer Balance
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-xs text-red-600">Total Debit</p>
                    <p className="mt-1 font-bold text-red-700">
                      {formatAmount(selectedAccount.summary.totalDebit)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-green-600">Total Credit</p>
                    <p className="mt-1 font-bold text-green-700">
                      {formatAmount(selectedAccount.summary.totalCredit)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-[#6D28D9]">Net Balance</p>
                    <p className="mt-1 font-bold text-[#6D28D9]">
                      {formatAmount(selectedAccount.summary.netAmount)}{" "}
                      {selectedAccount.summary.netType}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Dealer</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Debit</th>
                        <th className="px-4 py-3">Credit</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {selectedAccount.balance.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-10 text-center text-gray-500"
                          >
                            No balance entries found
                          </td>
                        </tr>
                      ) : (
                        selectedAccount.balance.map((entry) => (
                          <tr key={entry._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900">
                                {entry.dealerId?.technicianFirmName ||
                                  entry.dealerId?.technicianName ||
                                  "Unknown Dealer"}
                              </p>

                              <p className="text-xs text-gray-500">
                                {entry.dealerId?.headCode || "-"}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-gray-500">
                              {formatDate(entry.createdAt)}
                            </td>

                            <td className="px-4 py-3 font-medium text-red-600">
                              {entry.accountType === "DEBIT"
                                ? formatAmount(entry.amount)
                                : "-"}
                            </td>

                            <td className="px-4 py-3 font-medium text-green-600">
                              {entry.accountType === "CREDIT"
                                ? formatAmount(entry.amount)
                                : "-"}
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEditBalance(entry)}
                                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteBalance(entry)}
                                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                Account details unavailable
              </p>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT ACCOUNT MODAL */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h2 className="text-lg font-semibold">
                {editingAccount ? "Update Account" : "Create Account"}
              </h2>

              <button
                type="button"
                onClick={closeAccountModal}
                disabled={savingAccount}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAccount}>
              <div className="p-5">
                <label className="mb-1.5 block text-sm font-medium">
                  Account Name *
                </label>

                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Enter account name"
                  required
                  autoFocus
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6D28D9]"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 p-5">
                <button
                  type="button"
                  onClick={closeAccountModal}
                  disabled={savingAccount}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingAccount}
                  className="rounded-lg bg-[#6D28D9] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {savingAccount
                    ? "Saving..."
                    : editingAccount
                      ? "Update Account"
                      : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT BALANCE MODAL */}
      {/* {balanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h2 className="text-lg font-semibold">
                {editingBalance
                  ? "Update Dealer Balance"
                  : "Add Dealer Balance"}
              </h2>

              <button
                type="button"
                onClick={closeBalanceModal}
                disabled={savingBalance}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBalance}>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Search Dealer
                  </label>

                  <input
                    value={dealerSearch}
                    onChange={(e) => setDealerSearch(e.target.value)}
                    placeholder="Search dealer by name or code"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Select Dealer *
                  </label>

                  <select
                    value={balanceForm.dealerId}
                    onChange={(e) =>
                      setBalanceForm((prev) => ({
                        ...prev,
                        dealerId: e.target.value,
                      }))
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="">
                      {loadingDealers ? "Loading dealers..." : "Select Dealer"}
                    </option>

                    {editingBalance?.dealerId &&
                      !dealerOptions.some(
                        (d) => d._id === editingBalance.dealerId?._id,
                      ) && (
                        <option value={editingBalance.dealerId._id}>
                          {editingBalance.dealerId.headCode} -{" "}
                          {editingBalance.dealerId.technicianFirmName ||
                            editingBalance.dealerId.technicianName}
                        </option>
                      )}

                    {dealerOptions.map((dealer) => (
                      <option key={dealer._id} value={dealer._id}>
                        {dealer.headCode} -{" "}
                        {dealer.technicianFirmName || dealer.technicianName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Amount (₹) *
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={balanceForm.amount}
                    onChange={(e) =>
                      setBalanceForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Account Type *
                  </label>

                  <select
                    value={balanceForm.accountType}
                    onChange={(e) =>
                      setBalanceForm((prev) => ({
                        ...prev,
                        accountType: e.target.value as BalanceType,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="CREDIT">Credit</option>
                    <option value="DEBIT">Debit</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 p-5">
                <button
                  type="button"
                  onClick={closeBalanceModal}
                  disabled={savingBalance}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingBalance}
                  className="rounded-lg bg-[#6D28D9] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {savingBalance
                    ? "Saving..."
                    : editingBalance
                      ? "Update Entry"
                      : "Add Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
}
