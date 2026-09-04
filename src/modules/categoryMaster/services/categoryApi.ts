// import api from "../../../services/api/axios";
// import type { Category, CategoryFormData } from "../types/category.types";

// export interface CategoryDropdown {
//   id: string;
//   groupCategoryCode: string;
//   category: string;
//   categoryDescription: string;
// }


// export const getCategories = async (): Promise<Category[]> => {
//   const response = await api.get("/categories");

//   return response.data.data ?? response.data;
// };

// export const getCategoryById = async (id: string): Promise<Category> => {
//   const response = await api.get(`/categories/${id}`);

//   return response.data.data ?? response.data;
// };

// export const createCategory = async (
//   data: CategoryFormData,
// ): Promise<Category> => {
//   const response = await api.post("/categories", data);

//   return response.data.data ?? response.data;
// };

// export const updateCategory = async (
//   id: string,
//   data: CategoryFormData,
// ): Promise<Category> => {
//   const response = await api.put(`/categories/${id}`, data);

//   return response.data.data ?? response.data;
// };

// export const updateCategoryStatus = async (
//   id: string,
//   status: "ACTIVE" | "INACTIVE",
// ): Promise<Category> => {
//   const response = await api.put(`/categories/${id}`, {
//     status,
//   });

//   return response.data.data ?? response.data;
// };

// export const toggleCategoryStatus = async (
//   id: string,
//   currentStatus: "ACTIVE" | "INACTIVE",
// ): Promise<Category> => {
//   const status = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

//   return updateCategoryStatus(id, status);
// };

// export const deleteCategory = async (id: string): Promise<void> => {
//   await api.delete(`/categories/${id}`);
// };

// export const getCategoryDropdown = async (): Promise<CategoryDropdown[]> => {
//   const response = await api.get("/categories/dropdown");

//   return response.data.data ?? [];
// };

import api from "../../../services/api/axios";

import type {
  Category,
  CategoryFormData,
  CategoryImportResponse,
} from "../types/category.types";

export interface CategoryDropdown {
  id: string;
  groupCategoryCode: string;
  category: string;
  categoryDescription: string;
}

/* =========================================================
   GET ALL CATEGORIES
========================================================= */

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");

  return response.data.data ?? response.data;
};

/* =========================================================
   GET CATEGORY BY ID
========================================================= */

export const getCategoryById = async (
  id: string,
): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);

  return response.data.data ?? response.data;
};

/* =========================================================
   CREATE CATEGORY
========================================================= */

export const createCategory = async (
  data: CategoryFormData,
): Promise<Category> => {
  const response = await api.post("/categories", data);

  return response.data.data ?? response.data;
};

/* =========================================================
   UPDATE CATEGORY
========================================================= */

export const updateCategory = async (
  id: string,
  data: CategoryFormData,
): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, data);

  return response.data.data ?? response.data;
};

/* =========================================================
   UPDATE STATUS
========================================================= */

export const updateCategoryStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE",
): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, {
    status,
  });

  return response.data.data ?? response.data;
};

/* =========================================================
   TOGGLE STATUS
========================================================= */

export const toggleCategoryStatus = async (
  id: string,
  currentStatus: "ACTIVE" | "INACTIVE",
): Promise<Category> => {
  const status =
    currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  return updateCategoryStatus(id, status);
};

/* =========================================================
   DELETE CATEGORY
========================================================= */

export const deleteCategory = async (
  id: string,
): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

/* =========================================================
   CATEGORY DROPDOWN
========================================================= */

export const getCategoryDropdown =
  async (): Promise<CategoryDropdown[]> => {
    const response = await api.get("/categories/dropdown");

    return response.data.data ?? [];
  };

/* =========================================================
   IMPORT CATEGORY EXCEL
========================================================= */

export const importCategories = async (
  file: File,
): Promise<CategoryImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/categories/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/* =========================================================
   EXPORT CATEGORY EXCEL
========================================================= */

export const exportCategories = async (): Promise<void> => {
  const response = await api.get("/categories/export", {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "categories.xlsx";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};

/* =========================================================
   DOWNLOAD SAMPLE CATEGORY EXCEL
========================================================= */

export const downloadCategorySample = async (): Promise<void> => {
  const response = await api.get("/categories/sample", {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "category-import-sample.xlsx";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};