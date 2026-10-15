import api from "../../../services/api/axios";

export interface AccountDealer {
  _id: string;
  headCode: string;
  technicianFirmName: string;
  technicianName: string;
  mobileNumber: string;
}

export interface AccountBalance {
  _id: string;
  dealerId: AccountDealer | null;
  amount: number;
  accountType: "DEBIT" | "CREDIT";
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountSummary {
  totalDebit: number;
  totalCredit: number;
  netAmount: number;
  netType: "DEBIT" | "CREDIT" | "BALANCED";
  totalEntries: number;
  totalDealers: number;
}

export interface Account {
  _id: string;
  accountName: string;
  balance: AccountBalance[];
  summary: AccountSummary;
  createdAt: string;
  updatedAt: string;
}

export interface AccountDropdownOption {
  _id: string;
  accountName: string;
  label: string;
  value: string;
}

export interface AccountFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface AccountListResponse {
  success: boolean;
  data: Account[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BalancePayload {
  dealerId: string;
  amount: number;
  accountType: "DEBIT" | "CREDIT";
}

export const getAccounts = async (
  filters: AccountFilters = {},
): Promise<AccountListResponse> => {
  const response = await api.get("/accounts", {
    params: filters,
  });

  return response.data;
};

export const getAccountById = async (
  id: string,
): Promise<Account> => {
  const response = await api.get(`/accounts/${id}`);
  return response.data.data;
};

export const getAccountsDropdown = async (
  search = "",
): Promise<AccountDropdownOption[]> => {
  const response = await api.get("/accounts/dropdown", {
    params: { search },
  });

  return response.data.data;
};

export const createAccount = async (
  accountName: string,
): Promise<Account> => {
  const response = await api.post("/accounts", {
    accountName,
  });

  return response.data.data;
};

export const updateAccount = async (
  id: string,
  accountName: string,
): Promise<Account> => {
  const response = await api.put(`/accounts/${id}`, {
    accountName,
  });

  return response.data.data;
};

export const deleteAccount = async (
  id: string,
): Promise<void> => {
  await api.delete(`/accounts/${id}`);
};

export const addAccountBalance = async (
  accountId: string,
  payload: BalancePayload,
): Promise<void> => {
  await api.post(`/accounts/${accountId}/balance`, payload);
};

export const updateAccountBalance = async (
  accountId: string,
  balanceId: string,
  payload: BalancePayload,
): Promise<void> => {
  await api.put(
    `/accounts/${accountId}/balance/${balanceId}`,
    payload,
  );
};

export const deleteAccountBalance = async (
  accountId: string,
  balanceId: string,
): Promise<void> => {
  await api.delete(
    `/accounts/${accountId}/balance/${balanceId}`,
  );
};
