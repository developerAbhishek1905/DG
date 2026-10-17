// import api from "../../../services/api/axios";
// import type { CreateAdjustmentPayload, DealerLedgerSummary, LedgerOverviewStats, LedgerTransaction } from "../types/ledger.types";
// async function loadLedger(): Promise<{ transactions: LedgerTransaction[]; summaries: DealerLedgerSummary[] }> {
//   const { data } = await api.get("/ledger"); return data.data;
// }
// export async function getLedgerTransactions() { return (await loadLedger()).transactions; }
// export async function getLedgerTransactionById(id: string) { return (await getLedgerTransactions()).find(t => t.id === id); }
// export async function getDealerLedger(dealerId: string) { return (await getLedgerTransactions()).filter(t => t.dealerId === dealerId); }
// export async function getAllDealerLedgerSummaries() { return (await loadLedger()).summaries; }
// export async function getDealerLedgerSummary(dealerId: string) { return (await getAllDealerLedgerSummaries()).find(s => s.dealer.id === dealerId); }
// export async function getLedgerOverviewStats(): Promise<LedgerOverviewStats> {
//   const { transactions, summaries } = await loadLedger();
//   return { totalDealers: summaries.length, totalOutstanding: summaries.reduce((sum, s) => sum + s.outstandingAmount, 0), totalCredits: transactions.reduce((sum, t) => sum + t.credit, 0), totalPayments: transactions.filter(t => t.transactionType === "PAYMENT_DEBIT").reduce((sum, t) => sum + t.debit, 0), overdueOutstanding: 0 };
// }
// export async function createLedgerAdjustment(payload: CreateAdjustmentPayload) {
//   const { data } = await api.post("/ledger/adjustments", payload); return getLedgerTransactionById(data.data.id);
// }
// export async function searchLedgerDealers(query: string) {
//   const search = query.trim().toLowerCase();
//   return (await getAllDealerLedgerSummaries()).filter(({ dealer }) => [dealer.name, dealer.dealerCode, dealer.phone, dealer.city].some(value => value?.toLowerCase().includes(search))).slice(0, 10);
// }

import api from "../../../services/api/axios";


export interface GetLedgerParams {
  search?: string;
  dealerId?: string;
  status?: string;
  billingType?: string;
  transactionType?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export const getAllDealerLedgers = async (
  params: GetLedgerParams = {},
) => {
  const response = await api.get(
    "/dealer-ledger",
    {
      params: {
        search:
          params.search || undefined,

        dealerId:
          params.dealerId || undefined,

        status:
          params.status &&
          params.status !== "ALL"
            ? params.status
            : undefined,

        billingType:
          params.billingType &&
          params.billingType !== "ALL"
            ? params.billingType
            : undefined,

        transactionType:
          params.transactionType &&
          params.transactionType !== "ALL"
            ? params.transactionType
            : undefined,

        fromDate:
          params.fromDate || undefined,

        toDate:
          params.toDate || undefined,

        page:
          params.page || 1,

        limit:
          params.limit || 10,
      },
    },
  );

  return response.data;
};

export interface DealerUnpaidBill {
  _id: string;
  complaintId: string;
  complaintNumber: string;

  productName: string;
  category: string;
  serviceDescription: string;

  amount: number;
  paidAmount: number;
  remainingAmount: number;

  paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "PAID";
  entryType: "DEBIT" | "CREDIT";

  billingDate: string;
}

export interface DealerOutstandingSummary {
  openingBalance: number;
  openingBalanceType: "DR" | "CR";

  openingDebit: number;
  openingCredit: number;

  ledgerDebit: number;
  ledgerCredit: number;

  totalDebit: number;
  totalCredit: number;

  netOutstanding: number;
  balanceType: "DEBIT" | "CREDIT" | "SETTLED";
}

export interface DealerUnpaidBillsResponse {
  success: boolean;
  message: string;

  data: {
    dealer: {
      _id: string;
      headCode: string;
      technicianFirmName: string;
      technicianName: string;
      mobileNumber: string;
    };

    summary: DealerOutstandingSummary;

    bills: DealerUnpaidBill[];

    totalUnpaidBills: number;
    totalUnpaidAmount: number;
  };
}

export const getDealerUnpaidBills = async (
  dealerId: string,
): Promise<DealerUnpaidBillsResponse["data"]> => {
  const response = await api.get<DealerUnpaidBillsResponse>(
    `/dealer-ledger/${dealerId}/unpaid-bills`,
  );

  return response.data.data;
};

export interface CreateDealerPaymentPayload {
  dealerId: string;
  additionalAmount: number;
  complaintBillIds: string[];
  paymentDate: string;
  paymentMode:
    | "CASH"
    | "UPI"
    | "BANK_TRANSFER"
    | "CHEQUE";
  transactionReference?: string;
  remark?: string;
}

export const createDealerPayment = async (
  payload: CreateDealerPaymentPayload,
) => {
  const response = await api.post(
    "/dealer-payments",
    payload,
  );

  return response.data;
};

export interface DealerLedgerOverviewItem {
  dealerId: string;
  headCode: string;
  dealerName: string;
  mobileNumber: string;
  unpaidBillsCount: number;
  unpaidBillsAmount: number;
  currentOutstanding: number;
  creditAmount: number;
  securityDeposit: number;
  creditLimit?: number;
  openingBalance: number;
  openingBalanceType: "DR" | "CR";
}

export interface DealerLedgerOverviewSummary {
  totalDealers: number;
  unpaidBillsCount: number;
  unpaidBillsAmount: number;
  currentOutstanding: number;
  creditAmount: number;
  securityDeposit: number;
  openingBalance: number;
}

export interface DealerLedgerOverviewResponse {
  success: boolean;
  message: string;
  data: DealerLedgerOverviewItem[];
  summary: DealerLedgerOverviewSummary;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getDealerLedgerOverview = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<DealerLedgerOverviewResponse> => {
  const response = await api.get<DealerLedgerOverviewResponse>(
    "/dealer-ledger/overview",
    {
      params: {
        search: filters.search || undefined,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
      },
    }
  );

  return response.data;
};

export const getDealerPayments = async ({

  dealerId,
  ...filters
}: DealerPaymentFilters): Promise<DealerPaymentsResponse> => {
  const response = await api.get<DealerPaymentsResponse>(
    `/dealer-payments/dealer/${dealerId}`,
    {
      params: {
        ...(filters.search?.trim() && {
          search: filters.search.trim(),
        }),

        ...(filters.paymentMode &&
          filters.paymentMode !== "ALL" && {
            paymentMode: filters.paymentMode,
          }),

        ...(filters.status &&
          filters.status !== "ALL" && {
            status: filters.status,
          }),

        ...(filters.fromDate && {
          fromDate: filters.fromDate,
        }),

        ...(filters.toDate && {
          toDate: filters.toDate,
        }),

        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      },
    },
  );

  return response.data;
};


export type RefundPaymentMode =
  | "CASH"
  | "UPI"
  | "BANK_TRANSFER"
  | "CHEQUE";

export interface SecurityRefund {
  _id: string;
  dealerId: string;
  refundAmount: number;
  securityAmountBefore: number;
  securityAmountAfter: number;
  dateOfLeaving: string;
  eligibleRefundDate: string;
  refundDate: string;
  paymentMode: RefundPaymentMode;
  transactionReference: string;
  remark: string;
  refundedBy:
    | {
        _id: string;
        name: string;
        email?: string;
      }
    | null;
  createdAt: string;
}

export interface DealerSecurityRefundData {
  dealerId: string;
  securityAmount: number;
  dateOfLeaving: string | null;
  eligibleRefundDate: string | null;
  canRefund: boolean;
  reason: string;
  refunds: SecurityRefund[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RefundSecurityPayload {
  paymentMode: RefundPaymentMode;
  transactionReference: string;
  remark: string;
}

export const getDealerSecurityRefunds = async (
  dealerId: string,
): Promise<DealerSecurityRefundData> => {
  const response = await api.get<
    ApiResponse<DealerSecurityRefundData>
  >(`/dealers/security-refunds/${dealerId}`);

  return response.data.data;
};

export const refundDealerSecurity = async (
  dealerId: string,
  payload: RefundSecurityPayload,
): Promise<SecurityRefund> => {
  const response = await api.post<
    ApiResponse<SecurityRefund>
  >(
    `/dealers/security-refunds/${dealerId}/refund`,
    payload,
  );

  return response.data.data;
};


// export const getDealerPayments = async ({
//   dealerId,
//   page = 1,
//   limit = 20,
// }: {
//   dealerId: string;
//   page?: number;
//   limit?: number;
// }) => {
//   console.log("SERVICE FUNCTION CALLED", {
//     dealerId,
//     page,
//     limit,
//   });

//   const url = `/payments/dealer/${dealerId}`;

//   console.log("REQUEST URL:", url);

//   const response = await api.get(url, {
//     params: { page, limit },
//   });

//   console.log("AXIOS RAW RESPONSE:", response);
//   console.log("AXIOS RESPONSE DATA:", response.data);

//   return response.data;
// };

/*
|--------------------------------------------------------------------------
| DEALER ACCOUNTS — Receipt / Adjustments / Credit Note / Security Deposit
| (backend: /dealer-accounts, stored in the Ledger model)
|--------------------------------------------------------------------------
*/

export type AccountPaymentMode =
  | "CASH"
  | "UPI"
  | "BANK_TRANSFER"
  | "NET_BANKING"
  | "CHEQUE";

export type BillRefKind = "BILL_REF" | "DUMMY_BILL_REF";

export interface AccountDealer {
  dealerId: string;
  headCode: string;
  dealerName: string;
  outstanding: number;
  creditBalance: number;
  securityAmount: number;
}

export interface AccountBill {
  _id: string;
  kind: BillRefKind;
  complaintNumber: string;
  productName: string;
  serviceDescription: string;
  customerName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  billingDate: string;
}

export interface AccountReceipt {
  _id: string;
  entryNumber: string;
  date: string;
  paymentMode: AccountPaymentMode;
  reference: string;
  amount: number;
  adjustedAmount: number;
  availableAmount: number;
}

export interface DealerAccountContext {
  dealer: {
    _id: string;
    headCode: string;
    dealerName: string;
    securityAmount: number;
    creditBalance: number;
    outstanding: number;
  };
  bills: AccountBill[];
  receipts: AccountReceipt[];
}

export const searchAccountDealers = async (
  search = "",
): Promise<AccountDealer[]> => {
  const response = await api.get("/dealer-accounts/dealers", {
    params: { search: search || undefined },
  });

  return response.data?.data ?? [];
};

export const getDealerAccountContext = async (
  dealerId: string,
): Promise<DealerAccountContext> => {
  const response = await api.get(
    `/dealer-accounts/dealer/${dealerId}/context`,
  );

  return response.data.data;
};

export interface CreateReceiptsPayload {
  date: string;
  paymentMode: AccountPaymentMode;
  receipts: {
    dealerId: string;
    amount: number;
    reference?: string;
    remark?: string;
  }[];
}

export const createReceipts = async (payload: CreateReceiptsPayload) => {
  const response = await api.post("/dealer-accounts/receipts", payload);

  return response.data;
};

export interface CreateAdjustmentPayload {
  receiptId: string;
  date: string;
  remark?: string;
  allocations: { ledgerId: string; amount: number }[];
}

export const createAdjustment = async (payload: CreateAdjustmentPayload) => {
  const response = await api.post("/dealer-accounts/adjustments", payload);

  return response.data;
};

export interface CreateCreditNotePayload {
  dealerId: string;
  ledgerId: string;
  amount: number;
  date: string;
  reason: string;
  remark?: string;
}

export const createCreditNote = async (payload: CreateCreditNotePayload) => {
  const response = await api.post("/dealer-accounts/credit-notes", payload);

  return response.data;
};

export interface CreateSecurityDepositPayload {
  dealerId: string;
  amount: number;
  date: string;
  paymentMode: AccountPaymentMode;
  reference?: string;
  remark?: string;
}

export const createSecurityDeposit = async (
  payload: CreateSecurityDepositPayload,
) => {
  const response = await api.post(
    "/dealer-accounts/security-deposits",
    payload,
  );

  return response.data;
};


/*
|--------------------------------------------------------------------------
| DEALER LEDGER STATEMENT + PENDING BILLS
|--------------------------------------------------------------------------
*/

export interface DateRangeParams {
  fromDate?: string;
  toDate?: string;
}

export interface StatementChild {
  date: string;
  particulars: string;
  amount: number;
}

export interface StatementRow {
  key: string;
  date: string;
  particulars: string;
  reference: string;
  type: string;
  debit: number;
  credit: number;
  // positive = Dr (dealer owes), negative = Cr
  balance: number;
  children: StatementChild[];
}

export interface DealerStatement {
  openingBalance: number;
  rows: StatementRow[];
  totals: { debit: number; credit: number; closingBalance: number };
}

export const getDealerStatement = async (
  dealerId: string,
  params: DateRangeParams = {},
): Promise<DealerStatement> => {
  const response = await api.get(
    `/dealer-accounts/dealer/${dealerId}/statement`,
    {
      params: {
        fromDate: params.fromDate || undefined,
        toDate: params.toDate || undefined,
      },
    },
  );

  return response.data.data;
};

export interface PendingBill extends AccountBill {
  ageDays: number;
}

export interface DealerPendingBills {
  rows: PendingBill[];
  totals: {
    count: number;
    amount: number;
    paidAmount: number;
    remainingAmount: number;
  };
}

export const getDealerPendingBills = async (
  dealerId: string,
  params: DateRangeParams = {},
): Promise<DealerPendingBills> => {
  const response = await api.get(
    `/dealer-accounts/dealer/${dealerId}/pending-bills`,
    {
      params: {
        fromDate: params.fromDate || undefined,
        toDate: params.toDate || undefined,
      },
    },
  );

  return response.data.data;
};


/*
|--------------------------------------------------------------------------
| ALL BILLS OF A DEALER
|--------------------------------------------------------------------------
*/

export interface DealerBill extends AccountBill {
  // approval status of the bill itself
  status: string;
}

export interface DealerAllBills {
  rows: DealerBill[];
  totals: {
    count: number;
    amount: number;
    paidAmount: number;
    remainingAmount: number;
  };
}

export const getDealerAllBills = async (
  dealerId: string,
  params: DateRangeParams & { paymentStatus?: string } = {},
): Promise<DealerAllBills> => {
  const response = await api.get(`/dealer-accounts/dealer/${dealerId}/bills`, {
    params: {
      fromDate: params.fromDate || undefined,
      toDate: params.toDate || undefined,
      paymentStatus:
        params.paymentStatus && params.paymentStatus !== "ALL"
          ? params.paymentStatus
          : undefined,
    },
  });

  return response.data.data;
};
