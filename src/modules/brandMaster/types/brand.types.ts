export interface Brand {
  id: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandFormData {
  brandName: string;
}

export interface BrandState {
  brands: Brand[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}