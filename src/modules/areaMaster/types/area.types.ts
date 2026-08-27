export type AreaStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Area {
  id: string;

  areaCode: string;

  areaName: string;

  city: string;

  district?: string;

  state: string;

  pincode?: string;

  zone?: string;

  latitude?: number;

  longitude?: number;

  status: AreaStatus;

  createdAt: string;

  updatedAt: string;
}

export interface AreaFormData {
  areaCode: string;

  areaName: string;

  city: string;

  district?: string;

  state: string;

  pincode?: string;

  zone?: string;

  latitude?: number;

  longitude?: number;

  status: AreaStatus;
}

export interface AreaFilters {
  search: string;

  city: string;

  state: string;

  status: AreaStatus | "";
}

export interface AreaState {
  areas: Area[];

  selectedArea: Area | null;

  loading: boolean;

  actionLoading: boolean;

  error: string | null;

  filters: AreaFilters;
}