export interface DistrictMaster {
  _id: string;

  district_id: number;

  district_name: string;

  state_name?: string;

  state_id: number;

  createdAt?: string;

  updatedAt?: string;

  __v?: number;
}

export interface DistrictFormData {
  district_id: number;

  district_name: string;

  state_id: number;
}

export interface DistrictQueryParams {
  page?: number;

  limit?: number;

  search?: string;
}

export interface DistrictListResponse {
  success?: boolean;

  message?: string;

  data: DistrictMaster[];

  pagination?: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };
}

export interface DistrictSingleResponse {
  success?: boolean;

  message?: string;

  data: DistrictMaster;
}

export interface DistrictDeleteResponse {
  success?: boolean;

  message?: string;
}

export interface DistrictImportResponse {
  success?: boolean;

  message?: string;

  data?: DistrictMaster[];

  imported?: unknown[];

  failed?: unknown[];
}