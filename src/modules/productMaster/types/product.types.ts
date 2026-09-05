export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  _id: string;

  product_id: number;

  product_name: string;

  status: ProductStatus;

  createdAt?: string;

  updatedAt?: string;

  __v?: number;
}

export interface ProductFormData {
  product_id?: number;

  product_name: string;

  status: ProductStatus;
}

export interface ProductQueryParams {
  page?: number;

  limit?: number;

  search?: string;

  status?: ProductStatus | "";
}

export interface ProductListResponse {
  success: boolean;

  message: string;

  data: Product[];

  pagination?: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };
}

export interface ProductSingleResponse {
  success: boolean;

  message: string;

  data: Product;
}

export interface ProductDeleteResponse {
  success: boolean;

  message: string;
}

export interface ProductImportResponse {
  success: boolean;

  message: string;

  imported?: unknown[];

  failed?: unknown[];

  data?: Product[];
}
