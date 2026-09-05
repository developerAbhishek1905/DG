import api from "../../../services/api/axios";
import type {
  ProductType,
  ProductTypeDeleteResponse,
  ProductTypeFormData,
  ProductTypeImportResponse,
  ProductTypeListResponse,
  ProductTypeQueryParams,
  ProductTypeSingleResponse,
} from "../types/productType.types";

const PRODUCT_TYPE_API = "/product-types";

/* =====================================
   GET PRODUCT TYPES
===================================== */

export const getProductTypes = async (
  params: ProductTypeQueryParams = {},
): Promise<ProductTypeListResponse> => {
  const response = await api.get<ProductTypeListResponse>(PRODUCT_TYPE_API, {
    params: {
      ...(params.search
        ? {
            search: params.search,
          }
        : {}),

      ...(params.product_id
        ? {
            product_id: params.product_id,
          }
        : {}),

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
    },
  });

  return response.data;
};

/* =====================================
   GET PRODUCT TYPE BY ID
===================================== */

export const getProductTypeById = async (id: string): Promise<ProductType> => {
  const response = await api.get<ProductTypeSingleResponse>(
    `${PRODUCT_TYPE_API}/${id}`,
  );

  return response.data.data;
};

/* =====================================
   CREATE PRODUCT TYPE
===================================== */

export const createProductType = async (
  data: ProductTypeFormData,
): Promise<ProductType> => {
  const response = await api.post<ProductTypeSingleResponse>(
    PRODUCT_TYPE_API,
    data,
  );

  return response.data.data;
};

/* =====================================
   UPDATE PRODUCT TYPE
===================================== */

export const updateProductType = async (
  id: string,
  data: ProductTypeFormData,
): Promise<ProductType> => {
  const response = await api.put<ProductTypeSingleResponse>(
    `${PRODUCT_TYPE_API}/${id}`,
    data,
  );

  return response.data.data;
};

/* =====================================
   DELETE PRODUCT TYPE
===================================== */

export const deleteProductType = async (
  id: string,
): Promise<ProductTypeDeleteResponse> => {
  const response = await api.delete<ProductTypeDeleteResponse>(
    `${PRODUCT_TYPE_API}/${id}`,
  );

  return response.data;
};

/* =====================================
   IMPORT PRODUCT TYPES
===================================== */

export const importProductTypes = async (
  file: File,
): Promise<ProductTypeImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<ProductTypeImportResponse>(
    `${PRODUCT_TYPE_API}/import`,
    formData,
  );

  return response.data;
};

/* =====================================
   EXPORT PRODUCT TYPES
===================================== */

export const exportProductTypes = async (): Promise<void> => {
  const response = await api.get(`${PRODUCT_TYPE_API}/export`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type:
      (response.headers["content-type"] as string) ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "product_types.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

/* =====================================
   DOWNLOAD SAMPLE
===================================== */

export const downloadProductTypeSample = async (): Promise<void> => {
  const response = await api.get(`${PRODUCT_TYPE_API}/sample`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type:
      (response.headers["content-type"] as string) ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "product_type_sample.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
