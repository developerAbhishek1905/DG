import api from "../../../services/api/axios";


export interface DealerActivityDealer {
  _id: string;
  dealerCode: string;
  headCode: string;
  dealerName: string;
  firmName: string;
  mobile: string;
  city: string;
  cityId: number | null;
  status: string;
}

export interface DailyDealerActivity {
  date: string;
  assignedCalls: number;
  appointments: number;
  pending: number;
  rescheduled: number;
  cancelled: number;
  closed: number;
}

export interface DealerActivitySummary {
  assignedCalls: number;
  appointments: number;
  pending: number;
  rescheduled: number;
  cancelled: number;
  closed: number;
}

export interface DealerDailyActivityResponse {
  success: boolean;
  message: string;

  data: {
    dealer: DealerActivityDealer;

    filters: {
      startDate: string;
      endDate: string;
    };

    summary: DealerActivitySummary;

    activity: DailyDealerActivity[];
  };
}

export const getDealerDailyActivity = async (
  dealerId: string,
  startDate?: string,
  endDate?: string,
): Promise<DealerDailyActivityResponse> => {
  const params: Record<string, string> = {};

  if (startDate) {
    params.startDate = startDate;
  }

  if (endDate) {
    params.endDate = endDate;
  }

  const response = await api.get(
    `/dealers/dealer-activity/${dealerId}/daily`,
    {
      params,
    },
  );

  return response.data;
};


export interface DealerActivity {
  _id: string;
  dealerCode: string;
  dealerName: string;
  firmName: string;
  mobile: string;
  alternativeNumber: string;
  city: string;
  cityId: number | null;
  products: string[];
  status: string;

  assignedCalls: number;
  appointments: number;
  pending: number;
  rescheduled: number;
  cancelled: number;
  closed: number;
}

export interface DealerActivitySummary {
  totalDealers: number;
  activeDealers: number;
  onLeave: number;
  assignedCalls: number;
  appointments: number;
  pending: number;
  rescheduled: number;
  cancelled: number;
  closed: number;
}

export interface DealerActivityPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetDealerActivityParams {
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetDealerActivityResponse {
  success: boolean;
  message: string;

  data: DealerActivity[];

  summary: DealerActivitySummary;

  filters: {
    date: string;
    search: string;
  };

  pagination: DealerActivityPagination;
}

export const getDealerActivity = async (
  params: GetDealerActivityParams = {},
): Promise<GetDealerActivityResponse> => {
  const queryParams: Record<
    string,
    string | number
  > = {};

  if (params.date) {
    queryParams.date = params.date;
  }

  if (params.search?.trim()) {
    queryParams.search =
      params.search.trim();
  }

  if (params.page) {
    queryParams.page = params.page;
  }

  if (params.limit) {
    queryParams.limit = params.limit;
  }

  const response = await api.get(
    "/dealers/dealer-activity",
    {
      params: queryParams,
    },
  );

  return response.data;
};

export interface DealerActivityRangeSummaryResponse {
  success: boolean;
  message: string;
  summary: DealerActivitySummary;
  range: {
    days: number;
    from: string;
    to: string;
  };
}

// Totals across all dealers for the last N days (default 30)
export const getDealerActivityRangeSummary = async (
  params: { search?: string; days?: number } = {},
): Promise<DealerActivityRangeSummaryResponse> => {
  const response = await api.get("/dealers/dealer-activity/monthly-summary", {
    params: {
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
      ...(params.days ? { days: params.days } : {}),
    },
  });

  return response.data;
};
