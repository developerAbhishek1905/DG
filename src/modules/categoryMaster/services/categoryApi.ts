import type {
  Category,
  CategoryFormData,
} from "../types/category.types";

export let mockCategories: Category[] = [
  {
    id: "CAT-001",
    groupCategoryCode: "WM",
    categoryDescription: "WASHING MACHINE",
    category2: "FMR",
    category3: "",
    category4: "",
    status: "ACTIVE",
    createdAt: "2026-08-01T10:00:00",
    updatedAt: "2026-08-01T10:00:00",
  },
  {
    id: "CAT-002",
    groupCategoryCode: "AC",
    categoryDescription: "AIR CONDITIONER",
    category2: "SPLIT",
    category3: "",
    category4: "",
    status: "ACTIVE",
    createdAt: "2026-08-02T10:00:00",
    updatedAt: "2026-08-02T10:00:00",
  },
];

const delay = (
  milliseconds = 300
) =>
  new Promise((resolve) =>
    setTimeout(
      resolve,
      milliseconds
    )
  );

export const getCategories =
  async (): Promise<
    Category[]
  > => {
    await delay();

    return [...mockCategories];
  };

export const getCategoryById =
  async (
    id: string
  ): Promise<
    Category | undefined
  > => {
    await delay();

    return mockCategories.find(
      (item) =>
        item.id === id
    );
  };

export const createCategory =
  async (
    data: CategoryFormData
  ): Promise<Category> => {
    await delay();

    const duplicate =
      mockCategories.some(
        (item) =>
          item.groupCategoryCode
            .toLowerCase() ===
          data.groupCategoryCode
            .toLowerCase()
      );

    if (duplicate) {
      throw new Error(
        "Category code already exists"
      );
    }

    const now =
      new Date().toISOString();

    const category: Category = {
      id: `CAT-${String(
        mockCategories.length +
          1
      ).padStart(3, "0")}`,

      ...data,

      createdAt: now,
      updatedAt: now,
    };

    mockCategories = [
      category,
      ...mockCategories,
    ];

    return category;
  };

export const updateCategory =
  async (
    id: string,
    data: CategoryFormData
  ): Promise<Category> => {
    await delay();

    const index =
      mockCategories.findIndex(
        (item) =>
          item.id === id
      );

    if (index === -1) {
      throw new Error(
        "Category not found"
      );
    }

    const duplicate =
      mockCategories.some(
        (item) =>
          item.id !== id &&
          item.groupCategoryCode
            .toLowerCase() ===
            data.groupCategoryCode
              .toLowerCase()
      );

    if (duplicate) {
      throw new Error(
        "Category code already exists"
      );
    }

    const updated: Category = {
      ...mockCategories[index],
      ...data,
      updatedAt:
        new Date().toISOString(),
    };

    mockCategories[index] =
      updated;

    return updated;
  };

export const toggleCategoryStatus =
  async (
    id: string
  ): Promise<Category> => {
    await delay();

    const category =
      mockCategories.find(
        (item) =>
          item.id === id
      );

    if (!category) {
      throw new Error(
        "Category not found"
      );
    }

    category.status =
      category.status ===
      "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    category.updatedAt =
      new Date().toISOString();

    return {
      ...category,
    };
  };