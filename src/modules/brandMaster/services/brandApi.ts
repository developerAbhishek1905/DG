import type {
  Brand,
  BrandFormData,
} from "../types/brand.types";

let mockBrands: Brand[] = [
  {
    id: "BRD-001",
    brandName: "LG",
    createdAt: "2026-09-01T10:00:00",
    updatedAt: "2026-09-01T10:00:00",
  },
  {
    id: "BRD-002",
    brandName: "Samsung",
    createdAt: "2026-09-01T10:00:00",
    updatedAt: "2026-09-01T10:00:00",
  },
];

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getBrands = async (): Promise<Brand[]> => {
  await delay();

  return [...mockBrands];
};

export const createBrand = async (
  data: BrandFormData
): Promise<Brand> => {
  await delay();

  const duplicate = mockBrands.some(
    (brand) =>
      brand.brandName.toLowerCase() ===
      data.brandName.toLowerCase()
  );

  if (duplicate) {
    throw new Error("Brand already exists");
  }

  const now = new Date().toISOString();

  const newBrand: Brand = {
    id: `BRD-${String(mockBrands.length + 1).padStart(3, "0")}`,
    brandName: data.brandName,
    createdAt: now,
    updatedAt: now,
  };

  mockBrands = [newBrand, ...mockBrands];

  return newBrand;
};

export const updateBrand = async (
  id: string,
  data: BrandFormData
): Promise<Brand> => {
  await delay();

  const index = mockBrands.findIndex(
    (brand) => brand.id === id
  );

  if (index === -1) {
    throw new Error("Brand not found");
  }

  const duplicate = mockBrands.some(
    (brand) =>
      brand.id !== id &&
      brand.brandName.toLowerCase() ===
        data.brandName.toLowerCase()
  );

  if (duplicate) {
    throw new Error("Brand already exists");
  }

  const updatedBrand: Brand = {
    ...mockBrands[index],
    brandName: data.brandName,
    updatedAt: new Date().toISOString(),
  };

  mockBrands[index] = updatedBrand;

  return updatedBrand;
};

export const deleteBrand = async (
  id: string
): Promise<string> => {
  await delay();

  mockBrands = mockBrands.filter(
    (brand) => brand.id !== id
  );

  return id;
};