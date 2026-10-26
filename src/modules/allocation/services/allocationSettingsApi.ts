import api from "../../../services/api/axios";

export interface ExcludedCity {
  cityId: number;
  cityName: string;
}

export interface AllocationApplySummary {
  from: string;
  to: string;
  dealersUpdated: number;
  creditBlocked: number;
  excludedCities: number;
  autoAllocationEnabled: boolean;
  useCreditLimit: boolean;
}

export interface AllocationSettings {
  autoAllocationEnabled: boolean;
  excludedCities: ExcludedCity[];
  useCreditLimit: boolean;
  rangeFrom: string | null;
  rangeTo: string | null;
  noActionReminderEnabled: boolean;
  noActionReminderMinutes: number;
  noActionPenaltyEnabled: boolean;
  noActionPenaltyAfterMinutes: number;
  noActionPenaltyAmount: number;
  monthlyRecalcEnabled: boolean;
  monthlyRecalcDay: number;
  lastScheduledRunAt: string | null;
  lastScheduledRunStatus: string;
  lastAppliedAt: string | null;
  lastAppliedSummary: AllocationApplySummary | null;
}

export interface SaveAllocationSettingsPayload {
  autoAllocationEnabled: boolean;
  excludedCities: ExcludedCity[];
  useCreditLimit: boolean;
  rangeFrom: string;
  rangeTo: string;
  noActionReminderEnabled: boolean;
  noActionReminderMinutes: number;
  noActionPenaltyEnabled: boolean;
  noActionPenaltyAfterMinutes: number;
  noActionPenaltyAmount?: number;
  monthlyRecalcEnabled: boolean;
  monthlyRecalcDay: number;
}

export const getAllocationSettings = async (): Promise<AllocationSettings> => {
  const response = await api.get("/allocation-settings");

  return response.data.data;
};

export const getAllocationCities = async (): Promise<ExcludedCity[]> => {
  const response = await api.get("/allocation-settings/cities");

  return response.data.data ?? [];
};

export const saveAllocationSettings = async (
  payload: SaveAllocationSettingsPayload,
): Promise<AllocationSettings> => {
  const response = await api.put("/allocation-settings", payload);

  return response.data.data;
};

export const applyAllocationSettings = async (
  range: { rangeFrom: string; rangeTo: string },
): Promise<{ message: string; data: AllocationApplySummary }> => {
  const response = await api.post("/allocation-settings/apply", range);

  return { message: response.data.message, data: response.data.data };
};

export interface DealerAllocationRow {
  dealerId: string;
  hasAllocation: boolean;
  dealerCode: string;
  dealerName: string;
  status: string;
  cities: string[];
  creditLimit: number;
  outstanding: number;
  creditBlocked: boolean;
  totalAllocated: number;
  totalCompleted: number;
  totalCancelled: number;
  completionPercentage: number;
  totalAmount: number;
  averageAmount: number;
  rating: number;
  calculatedRating: number;
  ratingOverridden: boolean;
  /** Rating in force before the last change */
  previousRating?: number | null;
}

export interface DealerAllocationList {
  data: DealerAllocationRow[];
  period: { from: string; to: string; isDefault: boolean } | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const getDealerAllocations = async (params: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<DealerAllocationList> => {
  const response = await api.get("/allocation-settings/dealers", {
    params: { ...params, search: params.search || undefined },
  });

  return {
    data: response.data.data,
    period: response.data.period ?? null,
    pagination: response.data.pagination,
  };
};

export const setDealerRating = async (
  dealerId: string,
  rating: number | null,
  previousRating?: number | null,
): Promise<void> => {
  await api.put(`/allocation-settings/dealers/${dealerId}/rating`, {
    rating,
    previousRating,
  });
};

export interface AllocationHistoryRow {
  id: string;
  complaintNumber: string;
  activityType: string;
  dealerName: string;
  reason: string;
  reasonCode: string;
  allocationType: string;
  performedBy: string;
  createdAt: string;
}

export const getAllocationHistory = async (params: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: AllocationHistoryRow[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> => {
  const response = await api.get("/allocation-settings/history", {
    params: { ...params, search: params.search || undefined },
  });

  return { data: response.data.data, pagination: response.data.pagination };
};
