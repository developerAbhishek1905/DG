// export type AreaStatus =
//   | "ACTIVE"
//   | "INACTIVE";

// export interface Area {
//   id: string;

//   areaCode: string;

//   areaName: string;

//   city: string;

//   district?: string;

//   state: string;

//   pincode?: string;

//   zone?: string;

//   latitude?: number;

//   longitude?: number;

//   status: AreaStatus;

//   createdAt: string;

//   updatedAt: string;
// }

// export interface AreaFormData {
//   areaCode: string;

//   areaName: string;

//   city: string;

//   district?: string;

//   state: string;

//   pincode?: string;

//   zone?: string;

//   latitude?: number;

//   longitude?: number;

//   status: AreaStatus;
// }

// export interface AreaFilters {
//   search: string;

//   city: string;

//   state: string;

//   status: AreaStatus | "";
// }

// export interface AreaState {
//   areas: Area[];

//   selectedArea: Area | null;

//   loading: boolean;

//   actionLoading: boolean;

//   error: string | null;

//   filters: AreaFilters;
// }

export type AreaStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Area {
  _id: string;

  areaCode: string;

  areaName: string;

  state_id: number;

  district_id: number;

  city_id: number;

  pincode_id: number;

  /*
    Backend may return these populated names
    in list/get APIs.
  */

  state_name?: string;

  district_name?: string;

  city_name?: string;

  pincode_name?: string;

  zone?: string;

  latitude?: number;

  longitude?: number;

  status: AreaStatus;

  createdAt?: string;

  updatedAt?: string;

  __v?: number;
}

export interface AreaFormData {
  areaCode: string;

  areaName: string;

  state_id: number;

  district_id: number;

  city_id: number;

  pincode_id: number;

  zone?: string;

  latitude?: number;

  longitude?: number;

  status: AreaStatus;
}

export interface AreaQueryParams {
  search?: string;

  state_id?: number;

  district_id?: number;

  city_id?: number;

  pincode_id?: number;

  status?: AreaStatus | "";

  page?: number;

  limit?: number;
}

export interface AreaListResponse {
  success: boolean;

  message: string;

  data: Area[];

  pagination: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };
}

export interface AreaSingleResponse {
  success: boolean;

  message: string;

  data: Area;
}

export interface AreaDeleteResponse {
  success: boolean;

  message: string;
}

export interface AreaImportResponse {
  success: boolean;

  message: string;

  data?: Area[];

  imported?: unknown[];

  failed?: unknown[];
}

