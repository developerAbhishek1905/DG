export interface StateMaster {
  _id: string;
  state_id: number;
  state_name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StateFormData {
  state_id: number;
  state_name: string;
}

export interface StateQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface StateListResponse {
  success?: boolean;
  message?: string;

  data: StateMaster[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StateSingleResponse {
  success?: boolean;
  message?: string;
  data: StateMaster;
}

export interface StateDeleteResponse {
  success?: boolean;
  message?: string;
}

export interface StateImportResponse {
  success?: boolean;
  message?: string;

  data?: StateMaster[];

  imported?: unknown[];
  failed?: unknown[];
}