


import api from "../../../services/api/axios";
import type { PendingComplaint } from "../types/pending.types";

export interface PendingFilters {
  page?: number;
  limit?: number;

  search?: string;

  startDate?: string;
  endDate?: string;

  dealerId?: string;

  reason?: string;
  slaStatus?: string;
  status?: string;
}

export interface PendingComplaintResponse {
  success: boolean;
  message?: string;

  data: PendingComplaint[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}




export interface PendingFilters {
  page?: number;
  limit?: number;

  search?: string;

  startDate?: string;
  endDate?: string;

  cityId?: string;
  createdBy?: string;
  dealerId?: string;
  productId?: string;
  categoryId?: string;

  reason?: string;
  slaStatus?: SLAStatus | "ALL";
  status?: PendingStatus | "ALL";
}

export interface PendingResponse {
  success: boolean;

  data: PendingComplaint[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
/*
|--------------------------------------------------------------------------
| Get Pending Complaints
|--------------------------------------------------------------------------
*/

export async function getPendingComplaints(
  filters: PendingFilters = {},
): Promise<PendingComplaintResponse> {
  const params: Record<string, string | number> = {
    page: filters.page || 1,
    limit: filters.limit || 10,
  };

  // Search
  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  // Date range
  if (filters.startDate) {
    params.startDate = filters.startDate;
  }

  if (filters.endDate) {
    params.endDate = filters.endDate;
  }

  // City
  if (filters.cityId) {
    params.cityId = filters.cityId;
  }

  // Created By
  if (filters.createdBy) {
    params.createdBy = filters.createdBy;
  }

  // Dealer
  if (filters.dealerId) {
    params.dealerId = filters.dealerId;
  }

  // Product
  if (filters.productId) {
    params.productId = filters.productId;
  }

  // Category
  if (filters.categoryId) {
    params.categoryId = filters.categoryId;
  }

  // Reason
  if (filters.reason && filters.reason !== "ALL") {
    params.reason = filters.reason;
  }

  // SLA Status
  if (filters.slaStatus && filters.slaStatus !== "ALL") {
    params.slaStatus = filters.slaStatus;
  }

  // Complaint Status
  if (filters.status && filters.status !== "ALL") {
    params.status = filters.status;
  }

  const response = await api.get<PendingComplaintResponse>(
    "/appointments/pending",
    {
      params,
    },
  );

  return response.data;
}


export const getPendingFollowUpStatuses =
  async () => {
    const response = await api.get(
      "/appointments/pending/follow-up-statuses",
    );

    return response.data;
  };

export interface SaveFollowUpPayload {
  followUpStatus: string;
  followUpDate: string;
  remark: string;
  sendToDealer: boolean;
}

export const saveComplaintFollowUp = async (
  complaintId: string,
  payload: SaveFollowUpPayload,
) => {
  const response = await api.post(
    `/appointments/complaints/${complaintId}/follow-up`,
    payload,
  );

  return response.data;
};

export const getComplaintFollowUpRemarks =
  async (complaintId: string) => {
    const response = await api.get(
      `/appointments/complaints/${complaintId}/follow-up-remarks`,
    );

    return response.data;
  };

  export const getPendingFollowUpReasons = async () => {
  const response = await api.get(
    "/reasons/dropdown",
  );

  return response.data;
};

export interface UserDropdownOption {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string | null;
}

export const searchUserDropdown = async (
  search = "",
): Promise<UserDropdownOption[]> => {
  const response = await api.get("/users/dropdown", {
    params: { search },
  });

  return response.data?.data ?? [];
};