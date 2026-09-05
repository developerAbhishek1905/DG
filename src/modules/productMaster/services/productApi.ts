import api from "../../../services/api/axios";
import type {
  Product,
  ProductDeleteResponse,
  ProductFormData,
  ProductImportResponse,
  ProductListResponse,
  ProductQueryParams,
  ProductSingleResponse,
} from "../types/product.types";

const PRODUCT_API = "/products";

/* =====================================
   GET ALL PRODUCTS
===================================== */

export const getProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>(PRODUCT_API, {
    params: {
      ...(params.page
        ? {
            page: params.page,
          }
        : {}),

      ...(params.limit
        ? {
            limit: params.limit,
          }
        : {}),

      ...(params.search
        ? {
            search: params.search,
          }
        : {}),

      ...(params.status
        ? {
            status: params.status,
          }
        : {}),
    },
  });

  return response.data;
};

/* =====================================
   GET SINGLE PRODUCT
===================================== */

export const getProductById = async (
  productId: number | string,
): Promise<Product> => {
  const response = await api.get<ProductSingleResponse>(
    `${PRODUCT_API}/${productId}`,
  );

  return response.data.data;
};

/* =====================================
   CREATE PRODUCT
===================================== */

export const createProduct = async (
  data: ProductFormData,
): Promise<Product> => {
  const response = await api.post<ProductSingleResponse>(PRODUCT_API, data);

  return response.data.data;
};

/* =====================================
   UPDATE PRODUCT
===================================== */

export const updateProduct = async (
  productId: number | string,
  data: Partial<ProductFormData>,
): Promise<Product> => {
  const response = await api.put<ProductSingleResponse>(
    `${PRODUCT_API}/${productId}`,
    data,
  );

  return response.data.data;
};

/* =====================================
   DELETE PRODUCT
===================================== */

export const deleteProduct = async (
  productId: number | string,
): Promise<ProductDeleteResponse> => {
  const response = await api.delete<ProductDeleteResponse>(
    `${PRODUCT_API}/${productId}`,
  );

  return response.data;
};

/* =====================================
   IMPORT PRODUCTS
===================================== */

export const importProducts = async (
  file: File,
): Promise<ProductImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<ProductImportResponse>(
    `${PRODUCT_API}/import`,
    formData,
  );

  return response.data;
};

/* =====================================
   EXPORT PRODUCTS
===================================== */

export const exportProducts = async (): Promise<void> => {
  const response = await api.get(`${PRODUCT_API}/export`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type:
      response.headers["content-type"] ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "products.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

/* =====================================
   DOWNLOAD SAMPLE
===================================== */

export const downloadProductSample = async (): Promise<void> => {
  const response = await api.get(`${PRODUCT_API}/sample`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type:
      response.headers["content-type"] ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "product_sample.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
