export interface ProductType {
  _id: string;

  product_id: number;

  product_code: string;

  product_type: string;

  product_name?: string;

  createdAt?: string;

  updatedAt?: string;

  __v?: number;
}

export interface ProductTypeFormData {
  product_id: number;

  product_code: string;

  product_type: string;
}

export interface ProductTypeQueryParams {
  search?: string;

  product_id?: number;

  page?: number;

  limit?: number;
}

export interface ProductTypeListResponse {
  success: boolean;

  message: string;

  data: ProductType[];

  pagination?: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };
}

export interface ProductTypeSingleResponse {
  success: boolean;

  message: string;

  data: ProductType;
}

export interface ProductTypeDeleteResponse {
  success: boolean;

  message: string;
}

export interface ProductTypeImportResponse {
  success: boolean;

  message: string;

  imported?: unknown[];

  failed?: unknown[];

  data?: ProductType[];
}