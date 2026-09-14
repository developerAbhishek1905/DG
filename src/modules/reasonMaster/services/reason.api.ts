import api from "../../../services/api/axios";
import type {
  ReasonFormData,
  ReasonListResponse,
  ReasonResponse,
  ReasonType,
} from "../types/reason.types";

export interface ReasonFilters {
  search?: string;

  reasonType?: ReasonType;

  status?:
    | "active"
    | "inactive"
    | "";

  page?: number;

  limit?: number;
}

export const getReasons = async (
  filters: ReasonFilters = {},
) => {
  const response =
    await api.get<ReasonListResponse>(
      "/reasons",
      {
        params: {
          search:
            filters.search ||
            undefined,

          reasonType:
            filters.reasonType ||
            undefined,

          status:
            filters.status ||
            undefined,

          page:
            filters.page || 1,

          limit:
            filters.limit || 10,
        },
      },
    );

  return response.data;
};

export const createReason = async (
  payload: ReasonFormData,
) => {
  const response =
    await api.post<ReasonResponse>(
      "/reasons",
      payload,
    );

  return response.data;
};

export const updateReason = async (
  id: string,

  payload: Partial<ReasonFormData>,
) => {
  const response =
    await api.put<ReasonResponse>(
      `/reasons/${id}`,
      payload,
    );

  return response.data;
};

export const updateReasonStatus = async (
  id: string,
  isActive: boolean,
) => {
  const response =
    await api.patch<ReasonResponse>(
      `/reasons/${id}/status`,
      {
        isActive,
      },
    );

  return response.data;
};

export const deleteReason = async (
  id: string,
) => {
  const response =
    await api.delete<{
      success: boolean;

      message: string;
    }>(
      `/reasons/${id}`,
    );

  return response.data;
};