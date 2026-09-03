export interface PincodeMaster {
  _id: string;

  pincode_id?: number;

  pincode_name: string;

  city_id: number;

  city_name?: string;
  district_id?: number;
  district_name?: string;
  state_id?: number;
  state_name?: string;

  createdAt?: string;
  updatedAt?: string;

  __v?: number;
}

export interface PincodeFormData {
  pincode_id?: number;

  pincode_name: string;

  city_id: number;
}

export interface PincodeQueryParams {
  page?: number;

  limit?: number;

  search?: string;

  city_id?: number;
}

export interface PincodeListResponse {
  success: boolean;

  message: string;

  data: PincodeMaster[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PincodeSingleResponse {
  success: boolean;

  message: string;

  data: PincodeMaster;
}

export interface PincodeDeleteResponse {
  success: boolean;

  message: string;
}

export interface PincodeImportResponse {
  success: boolean;

  message: string;

  data?: PincodeMaster[];

  imported?: unknown[];

  failed?: unknown[];
}
