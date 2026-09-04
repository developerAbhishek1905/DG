// import type {
//   Brand,
//   BrandFormData,
// } from "../types/brand.types";

// let mockBrands: Brand[] = [
//   {
//     id: "BRD-001",
//     brandName: "LG",
//     createdAt: "2026-09-01T10:00:00",
//     updatedAt: "2026-09-01T10:00:00",
//   },
//   {
//     id: "BRD-002",
//     brandName: "Samsung",
//     createdAt: "2026-09-01T10:00:00",
//     updatedAt: "2026-09-01T10:00:00",
//   },
// ];

// const delay = (ms = 300) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// export const getBrands = async (): Promise<Brand[]> => {
//   await delay();

//   return [...mockBrands];
// };

// export const createBrand = async (
//   data: BrandFormData
// ): Promise<Brand> => {
//   await delay();

//   const duplicate = mockBrands.some(
//     (brand) =>
//       brand.brandName.toLowerCase() ===
//       data.brandName.toLowerCase()
//   );

//   if (duplicate) {
//     throw new Error("Brand already exists");
//   }

//   const now = new Date().toISOString();

//   const newBrand: Brand = {
//     id: `BRD-${String(mockBrands.length + 1).padStart(3, "0")}`,
//     brandName: data.brandName,
//     createdAt: now,
//     updatedAt: now,
//   };

//   mockBrands = [newBrand, ...mockBrands];

//   return newBrand;
// };

// export const updateBrand = async (
//   id: string,
//   data: BrandFormData
// ): Promise<Brand> => {
//   await delay();

//   const index = mockBrands.findIndex(
//     (brand) => brand.id === id
//   );

//   if (index === -1) {
//     throw new Error("Brand not found");
//   }

//   const duplicate = mockBrands.some(
//     (brand) =>
//       brand.id !== id &&
//       brand.brandName.toLowerCase() ===
//         data.brandName.toLowerCase()
//   );

//   if (duplicate) {
//     throw new Error("Brand already exists");
//   }

//   const updatedBrand: Brand = {
//     ...mockBrands[index],
//     brandName: data.brandName,
//     updatedAt: new Date().toISOString(),
//   };

//   mockBrands[index] = updatedBrand;

//   return updatedBrand;
// };

// export const deleteBrand = async (
//   id: string
// ): Promise<string> => {
//   await delay();

//   mockBrands = mockBrands.filter(
//     (brand) => brand.id !== id
//   );

//   return id;
// };

import api from "../../../services/api/axios";

import type {
  Brand,
  BrandApiResponse,
  BrandFormData,
  BrandImportResponse,
  BrandListApiResponse,
} from "../types/brand.types";

const BRAND_API = "/brands";

interface BackendBrand {
  _id: string;

  brandName: string;

  createdAt: string;

  updatedAt: string;
}

const normalizeBrand = (brand: BackendBrand): Brand => {
  return {
    id: brand._id,

    brandName: brand.brandName,

    createdAt: brand.createdAt,

    updatedAt: brand.updatedAt,
  };
};

// ==========================================
// GET ALL BRANDS
// ==========================================

export const getBrands = async (): Promise<Brand[]> => {
  const response = await api.get<
    Omit<BrandListApiResponse, "data"> & {
      data: BackendBrand[];
    }
  >(BRAND_API);

  return response.data.data.map(normalizeBrand);
};

// ==========================================
// GET BRAND BY ID
// ==========================================

export const getBrandById = async (id: string): Promise<Brand> => {
  const response = await api.get<
    Omit<BrandApiResponse, "data"> & {
      data: BackendBrand;
    }
  >(`${BRAND_API}/${id}`);

  return normalizeBrand(response.data.data);
};

// ==========================================
// CREATE BRAND
// ==========================================

export const createBrand = async (data: BrandFormData): Promise<Brand> => {
  const response = await api.post<
    Omit<BrandApiResponse, "data"> & {
      data: BackendBrand;
    }
  >(BRAND_API, data);

  return normalizeBrand(response.data.data);
};

// ==========================================
// UPDATE BRAND
// ==========================================

export const updateBrand = async (
  id: string,
  data: BrandFormData,
): Promise<Brand> => {
  const response = await api.put<
    Omit<BrandApiResponse, "data"> & {
      data: BackendBrand;
    }
  >(`${BRAND_API}/${id}`, data);

  return normalizeBrand(response.data.data);
};

// ==========================================
// DELETE BRAND
// ==========================================

export const deleteBrand = async (id: string): Promise<void> => {
  await api.delete(`${BRAND_API}/${id}`);
};

// ==========================================
// IMPORT BRANDS
// ==========================================

export const importBrands = async (
  file: File,
): Promise<BrandImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<BrandImportResponse>(
    `${BRAND_API}/import`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// ==========================================
// EXPORT BRANDS
// ==========================================

export const exportBrands = async () => {
  const response = await api.get(`${BRAND_API}/export`, {
    responseType: "blob",
  });

  downloadBlob(response.data, "brands.xlsx");
};

// ==========================================
// DOWNLOAD SAMPLE
// ==========================================

export const downloadBrandSample = async () => {
  const response = await api.get(`${BRAND_API}/sample`, {
    responseType: "blob",
  });

  downloadBlob(response.data, "brand-import-sample.xlsx");
};

// ==========================================
// DOWNLOAD HELPER
// ==========================================

const downloadBlob = (data: BlobPart, fileName: string) => {
  const blob = new Blob([data]);

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
