// export type CategoryStatus = "ACTIVE" | "INACTIVE";

// export interface Category {
//   id: string;

//   groupCategoryCode: string;

//   description: string;

//   category?: string;

//   categoryDescription: string;

//   //   category3?: string;

//   //   category4?: string;

//   status: CategoryStatus;

//   createdAt: string;

//   updatedAt: string;
// }

// export interface CategoryFormData {
//   groupCategoryCode: string;

//   description: string;

//   category?: string;

//   categoryDescription: string;

//   //   category3?: string;

//   //   category4?: string;

//   status: CategoryStatus;
// }

// export interface CategoryFilters {
//   search: string;

//   status: CategoryStatus | "";
// }

// export interface CategoryState {
//   categories: Category[];

//   selectedCategory: Category | null;

//   loading: boolean;

//   actionLoading: boolean;

//   error: string | null;

//   filters: CategoryFilters;
// }


export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface Category {
  id: string;
  groupCategoryCode: string;
  description: string;
  category?: string;
  product_id: number;
  product_name?: string;
  categoryDescription: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  groupCategoryCode: string;
  description: string;
  category?: string;
  categoryDescription: string;
  product_id: number;
  status: CategoryStatus;
}

export interface CategoryFilters {
  search: string;
  status: CategoryStatus | "";
}

export interface CategoryImportItem {
  row: number;
  groupCategoryCode: string;
  category?: string;
}

export interface CategoryImportError {
  row: number;
  groupCategoryCode: string;
  message: string;
}

export interface CategoryImportResponse {
  success: boolean;
  message: string;

  summary: {
    total: number;
    imported: number;
    failed: number;
  };

  imported: CategoryImportItem[];
  failed: CategoryImportError[];
}