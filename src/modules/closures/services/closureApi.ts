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

  startDate?: string;
  endDate?: string;

  search?: string;

  dealerId?: string;
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
  const response =
    await api.get<ClosureResponse>(
      "/appointments/closed",
      {
        params: {
          page: filters.page ?? 1,

          limit: filters.limit ?? 10,

          ...(filters.startDate && {
            startDate:
              filters.startDate,
          }),

          ...(filters.endDate && {
            endDate:
              filters.endDate,
          }),

          ...(filters.search?.trim() && {
            search:
              filters.search.trim(),
          }),

          ...(filters.dealerId && {
            dealerId:
              filters.dealerId,
          }),
        },
      },
    );

    console.log(response.data.data)

  return response.data.data;
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