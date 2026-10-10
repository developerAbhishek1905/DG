import api from "../../../services/api/axios";
import type {
  ClosureRecord,
} from "../types/closure.types";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export interface ClosureFilters {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  dealerId?: string;
  cityId?: string;
  createdBy?: string;
  categoryId?: string;
  status?: string;
  type?: string;
}

export interface ClosureResponse {
  success: boolean;
  message?: string;

  data: ClosureRecord[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/*
|--------------------------------------------------------------------------
| Get Closed Complaints
|--------------------------------------------------------------------------
*/

export async function getClosures(
  filters: ClosureFilters = {},
): Promise<ClosureResponse> {
  const response = await api.get<ClosureResponse>(
    "/appointments/closed",
    {
      params: {
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,

        ...(filters.search?.trim() && {
          search: filters.search.trim(),
        }),

        ...(filters.startDate && {
          startDate: filters.startDate,
        }),

        ...(filters.endDate && {
          endDate: filters.endDate,
        }),

        ...(filters.dealerId && {
          dealerId: filters.dealerId,
        }),

        // City Filter
        ...(filters.cityId && {
          cityId: filters.cityId,
        }),

        // Created By Filter
        ...(filters.createdBy && {
          createdBy: filters.createdBy,
        }),

        // Category Filter
        ...(filters.categoryId && {
          categoryId: filters.categoryId,
        }),
      },
    },
  );

  return response.data;
}


export interface ApproveClosurePayload {
  remark: string;
}

export const approveClosure = async (
  complaintId: string,
  payload: ApproveClosurePayload,
) => {
  const response = await api.patch(
    `/appointments/complaints/${complaintId}/approve-closure`,
    payload,
  );

  return response.data;
};

interface CreateRatingReviewPayload {
  complaintId: string;
  rating: number;
  review?: string;
}

export const createRatingReview = async (
  payload: CreateRatingReviewPayload,
) => {
  const response = await api.post(
    "/ratings",
    payload,
  );

  return response.data;
};