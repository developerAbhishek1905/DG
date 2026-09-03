import api from "../../../services/api/axios";
import type { Category, CategoryFormData } from "../types/category.types";

export interface CategoryDropdown {
  id: string;
  groupCategoryCode: string;
  category: string;
  categoryDescription: string;
}

// export let mockCategories: Category[] = [
//   {
//     id: "CAT-001",
//     groupCategoryCode: "WM",
//     categoryDescription: "WASHING MACHINE",
//     category2: "FMR",
//     category3: "",
//     category4: "",
//     status: "ACTIVE",
//     createdAt: "2026-08-01T10:00:00",
//     updatedAt: "2026-08-01T10:00:00",
//   },
//   {
//     id: "CAT-002",
//     groupCategoryCode: "AC",
//     categoryDescription: "AIR CONDITIONER",
//     category2: "SPLIT",
//     category3: "",
//     category4: "",
//     status: "ACTIVE",
//     createdAt: "2026-08-02T10:00:00",
//     updatedAt: "2026-08-02T10:00:00",
//   },
// ];

// const delay = (milliseconds = 300) =>
//   new Promise((resolve) => setTimeout(resolve, milliseconds));

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");

  return response.data.data ?? response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);

  return response.data.data ?? response.data;
};

export const createCategory = async (
  data: CategoryFormData,
): Promise<Category> => {
  const response = await api.post("/categories", data);

  return response.data.data ?? response.data;
};

export const updateCategory = async (
  id: string,
  data: CategoryFormData,
): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, data);

  return response.data.data ?? response.data;
};

export const updateCategoryStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE",
): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, {
    status,
  });

  return response.data.data ?? response.data;
};

export const toggleCategoryStatus = async (
  id: string,
  currentStatus: "ACTIVE" | "INACTIVE",
): Promise<Category> => {
  const status = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  return updateCategoryStatus(id, status);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const getCategoryDropdown = async (): Promise<CategoryDropdown[]> => {
  const response = await api.get("/categories/dropdown");

  return response.data.data ?? [];
};