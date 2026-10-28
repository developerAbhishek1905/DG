export type RateStatus = "ACTIVE" | "INACTIVE";

export interface RateListItem {
  _id: string;
  title: string;
  productId: number;
  productName: string;
  status: RateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RateListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RateListParams {
  page: number;
  limit: number;
  search?: string;
  status?: RateStatus | "";
  productId?: string;
}

export interface RateFormValues {
  title: string;
  productId: number;
  status: RateStatus;
}

export interface ProductOption {
  product_id: number;
  product_name: string;
}
