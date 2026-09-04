// export interface Brand {
//   id: string;
//   brandName: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface BrandFormData {
//   brandName: string;
// }

// export interface BrandState {
//   brands: Brand[];
//   loading: boolean;
//   actionLoading: boolean;
//   error: string | null;
// }

export interface Brand {
  id: string;

  brandName: string;

  createdAt: string;

  updatedAt: string;
}

export interface BrandFormData {
  brandName: string;
}

export interface BrandApiResponse {
  success: boolean;

  message?: string;

  data: Brand;
}

export interface BrandListApiResponse {
  success: boolean;

  count: number;

  data: Brand[];
}

export interface BrandImportSummary {
  total: number;

  imported: number;

  failed: number;
}

export interface BrandImportFailedRow {
  row: number;

  data?: Record<string, unknown>;

  reason: string;
}

export interface BrandImportResponse {
  success: boolean;

  message: string;

  summary: BrandImportSummary;

  imported: Brand[];

  failed: BrandImportFailedRow[];
}