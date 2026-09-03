export interface CityMaster {
  _id: string;

  city_id: number;
  city_name: string;

  district_id: number;
  state_id: number;

  district_name?: string;
  state_name?: string;

  createdAt?: string;
  updatedAt?: string;

  __v?: number;
}

export interface CityFormData {
  city_id: number;
  city_name: string;

  district_id: number;
  state_id: number;
}

export interface CityQueryParams {
  page?: number;
  limit?: number;
  search?: string;

  state_id?: number;
  district_id?: number;
}

export interface CityListResponse {
  success: boolean;
  message: string;

  data: CityMaster[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CitySingleResponse {
  success: boolean;
  message: string;
  data: CityMaster;
}

export interface CityDeleteResponse {
  success: boolean;
  message: string;
}

export interface CityImportResponse {
  success: boolean;
  message: string;

  data?: CityMaster[];

  imported?: unknown[];
  failed?: unknown[];
}