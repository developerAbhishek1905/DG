
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



// GET ALL BRANDS
export const getBrands = async (): Promise<Brand[]> => {
  const response = await api.get<
    Omit<BrandListApiResponse, "data"> & {
      data: BackendBrand[];
    }
  >(BRAND_API);
  return response.data.data.map(normalizeBrand);
};



// GET BRAND BY ID
export const getBrandById = async (id: string): Promise<Brand> => {
  const response = await api.get<
    Omit<BrandApiResponse, "data"> & {
      data: BackendBrand;
    }
  >(`${BRAND_API}/${id}`);

  return normalizeBrand(response.data.data);
};



// CREATE BRAND
export const createBrand = async (data: BrandFormData): Promise<Brand> => {
  const response = await api.post<
    Omit<BrandApiResponse, "data"> & {
      data: BackendBrand;
    }
  >(BRAND_API, data);

  return normalizeBrand(response.data.data);
};



// UPDATE BRAND
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



// DELETE BRAND
export const deleteBrand = async (id: string): Promise<void> => {
  await api.delete(`${BRAND_API}/${id}`);
};



// IMPORT BRANDS
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



// EXPORT BRANDS
export const exportBrands = async () => {
  const response = await api.get(`${BRAND_API}/export`, {
    responseType: "blob",
  });

  downloadBlob(response.data, "brands.xlsx");
};



// DOWNLOAD SAMPLE
export const downloadBrandSample = async () => {
  const response = await api.get(`${BRAND_API}/sample`, {
    responseType: "blob",
  });

  downloadBlob(response.data, "brand-import-sample.xlsx");
};



// DOWNLOAD HELPER
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