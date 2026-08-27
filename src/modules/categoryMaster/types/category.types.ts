export type CategoryStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Category {
  id: string;

  groupCategoryCode: string;

  categoryDescription: string;

  category2?: string;

  category3?: string;

  category4?: string;

  status: CategoryStatus;

  createdAt: string;

  updatedAt: string;
}

export interface CategoryFormData {
  groupCategoryCode: string;

  categoryDescription: string;

  category2?: string;

  category3?: string;

  category4?: string;

  status: CategoryStatus;
}

export interface CategoryFilters {
  search: string;

  status:
    | CategoryStatus
    | "";
}

export interface CategoryState {
  categories: Category[];

  selectedCategory:
    | Category
    | null;

  loading: boolean;

  actionLoading: boolean;

  error:
    | string
    | null;

  filters: CategoryFilters;
}