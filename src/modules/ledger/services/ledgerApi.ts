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