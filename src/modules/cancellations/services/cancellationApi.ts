import api from "../../../services/api/axios";
import type {
  ApproveCancellationPayload,
  CancellationRequest,
  RejectCancellationPayload,
} from "../types/cancellation.types";

export interface CancellationFilters {
  page?: number;
  limit?: number;

  startDate?: string;
  endDate?: string;

  search?: string;

  dealerId?: string;
}

export interface CancellationResponse {
  success: boolean;

  data: CancellationRequest[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Get Cancelled Complaints
|--------------------------------------------------------------------------
*/

export async function getCancellationRequests(
  filters: CancellationFilters = {},
): Promise<CancellationResponse> {
  const response = await api.get<CancellationResponse>(
    "/appointments/cancelled",
    {
      params: {
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,

        ...(filters.startDate && {
          startDate: filters.startDate,
        }),

        ...(filters.endDate && {
          endDate: filters.endDate,
        }),

        ...(filters.search?.trim() && {
          search: filters.search.trim(),
        }),

        ...(filters.dealerId && {
          dealerId: filters.dealerId,
        }),
      },
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Approve Cancellation
|--------------------------------------------------------------------------
*/

export async function approveCancellation(
  payload: ApproveCancellationPayload,
) {
  const response = await api.put(
    `/api/v1/complaints/${payload.cancellationId}/cancellation/approve`,
    payload,
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Reject Cancellation
|--------------------------------------------------------------------------
*/

export async function rejectCancellation(
  payload: RejectCancellationPayload,
) {
  const response = await api.put(
    `/api/v1/complaints/${payload.cancellationId}/cancellation/reject`,
    payload,
  );

  return response.data;
}

export interface SaveCancellationRemarkPayload {
  reasonId: string;
  followUpDate: string;
  remark: string;
}

export const saveCancellationRemark = async (
  complaintId: string,
  payload: SaveCancellationRemarkPayload,
) => {
  const response = await api.post(
    `/appointments/complaints/${complaintId}/cancellation-remark`,
    payload,
  );

  return response.data;
};


/*
|--------------------------------------------------------------------------
| Reason Dropdown
|--------------------------------------------------------------------------
*/

export interface ReasonDropdownItem {
  id: string;
  reasonName: string;
  reasonType: string;
}

export const getReasonsDropdown = async () => {
  const response = await api.get(
    "/reasons/dropdown",
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Cancel Complaint
|--------------------------------------------------------------------------
*/

export interface CancelComplaintPayload {
  reasonId: string;
  followUpDate: string;
  remark: string;
}

export const cancelComplaint = async (
  complaintId: string,
  payload: CancelComplaintPayload,
) => {
  const response = await api.patch(
    `/appointments/complaints/${complaintId}/cancel`,
    payload,
  );

  return response.data;
};