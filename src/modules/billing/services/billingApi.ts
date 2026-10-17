
import api from "../../../services/api/axios";
import type {
  DealerLedger,
  LedgerFilters,
  LedgerListResponse,
} from "../types/billing.types";

/*
|--------------------------------------------------------------------------
| GET DEALER LEDGERS
|--------------------------------------------------------------------------
*/

export const getDealerLedgers = async (
  filters: LedgerFilters = {},
): Promise<LedgerListResponse> => {
  const response = await api.get(
    "/dealer-ledger",
    {
      params: {
        search:
          filters.search || undefined,

        dealerId:
          filters.dealerId || undefined,

        status:
          filters.status &&
          filters.status !== "ALL"
            ? filters.status
            : undefined,

        billingType:
          filters.billingType &&
          filters.billingType !== "ALL"
            ? filters.billingType
            : undefined,

        transactionType:
          filters.transactionType &&
          filters.transactionType !== "ALL"
            ? filters.transactionType
            : undefined,

        fromDate:
          filters.fromDate || undefined,

        toDate:
          filters.toDate || undefined,

        page:
          filters.page || 1,

        limit:
          filters.limit || 10,
      },
    },
  );

  return {
    data: response.data.data || [],

    summary:
      response.data.summary || {
        totalAmount: 0,
        approvedAmount: 0,
        pendingAmount: 0,
        totalDebit: 0,
        totalCredit: 0,
        balance: 0,
      },

    pagination:
      response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
  };
};

/*
|--------------------------------------------------------------------------
| APPROVE LEDGER
|--------------------------------------------------------------------------
*/

export const approveDealerLedger =
  async (
    id: string,
    remarks = "",
  ): Promise<DealerLedger> => {
    const response = await api.patch(
      `/dealer-ledger/${id}/approve`,
      {
        remarks,
      },
    );

    return response.data.data.ledger;
  };

  export const createDealerLedger = async (
  data: BillFormValues,
) => {
  const response = await api.post(
    "/dealer-ledger",
    data,
  );

  return response.data;
};

export const updateDealerLedger = async (
  id: string,
  data: BillFormValues,
) => {
  const response = await api.patch(
    `/dealer-ledger/${id}`,
    data,
  );

  return response.data;
};

export const searchAllCategories = async (
  search = "",
): Promise<CategoryDropdownOption[]> => {
  const response = await api.get("/categories/dropdown", {
    params: { search },
  });

  return response.data?.data?.categories ?? response.data?.data ?? [];
};

/*
|--------------------------------------------------------------------------
| CREATE DUMMY BILL
|--------------------------------------------------------------------------
*/

export interface DummyBillValues {
  dealerId: string;
  complaintNumber: string;
  billingDate: string;
  amount: number;
  serviceDescription: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
}

export const createDummyBill = async (data: DummyBillValues) => {
  const response = await api.post("/dealer-ledger/dummy-bills", data);

  return response.data;
};
