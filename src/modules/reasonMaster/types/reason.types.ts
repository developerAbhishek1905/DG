export const REASON_TYPES = [
  "close",
  "on_call_pending",
  "after_call_pending",
  "on_call_cancel",
  "after_call_cancel",
] as const;

export type ReasonType =
  (typeof REASON_TYPES)[number];

export interface Reason {
  _id: string;

  reasonName: string;

  reasonType: ReasonType;

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}

export interface ReasonFormData {
  reasonName: string;

  reasonType: ReasonType;

  isActive: boolean;
}

export interface Pagination {
  total: number;

  page: number;

  limit: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

export interface ReasonListResponse {
  success: boolean;

  data: Reason[];

  pagination: Pagination;
}

export interface ReasonResponse {
  success: boolean;

  message?: string;

  data: Reason;
}