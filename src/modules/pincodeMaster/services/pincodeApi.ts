import api from "../../../services/api/axios";
import type {
  PincodeDeleteResponse,
  PincodeFormData,
  PincodeImportResponse,
  PincodeListResponse,
  PincodeMaster,
  PincodeQueryParams,
  PincodeSingleResponse,
} from "../types/pincode.types";

interface PincodesByCityResponse {
  success: boolean;
  message: string;
  data: PincodeMaster[];
}

const PINCODE_API = "/pincodes";

/* ======================================
   GET ALL
====================================== */

export const getPincodes = async (
  params: PincodeQueryParams = {},
): Promise<PincodeListResponse> => {
  const response = await api.get<PincodeListResponse>(PINCODE_API, {
    params: {
      page: params.page ?? 1,

      limit: params.limit ?? 20,

      search: params.search ?? "",

      ...(params.city_id
        ? {
            city_id: params.city_id,
          }
        : {}),
    },
  });

  return response.data;
};

/* ======================================
   GET SINGLE
====================================== */

export const getPincodeById = async (
  id: number | string,
): Promise<PincodeMaster> => {
  const response = await api.get<PincodeSingleResponse>(`${PINCODE_API}/${id}`);

  return response.data.data;
};

/* ======================================
   CREATE
====================================== */

export const createPincode = async (
  data: PincodeFormData,
): Promise<PincodeMaster> => {
  const response = await api.post<PincodeSingleResponse>(PINCODE_API, data);

  return response.data.data;
};

/* ======================================
   UPDATE
====================================== */

export const updatePincode = async (
  id: number | string,
  data: Partial<PincodeFormData>,
): Promise<PincodeMaster> => {
  const response = await api.put<PincodeSingleResponse>(
    `${PINCODE_API}/${id}`,
    data,
  );

  return response.data.data;
};

/* ======================================
   DELETE
====================================== */

export const deletePincode = async (
  id: number | string,
): Promise<PincodeDeleteResponse> => {
  const response = await api.delete<PincodeDeleteResponse>(
    `${PINCODE_API}/${id}`,
  );

  return response.data;
};

/* ======================================
   IMPORT
====================================== */

export const importPincodes = async (
  file: File,
): Promise<PincodeImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<PincodeImportResponse>(
    `${PINCODE_API}/import`,
    formData,
  );

  return response.data;
};

/* ======================================
   EXPORT
====================================== */

export const exportPincodes = async (): Promise<void> => {
  const response = await api.get(`${PINCODE_API}/export`, {
    responseType: "blob",
  });

  const headerContentType = response.headers["content-type"];

  const normalizedContentType =
    Array.isArray(headerContentType)
      ? headerContentType[0]
      : typeof headerContentType === "string"
        ? headerContentType
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const blob = new Blob([response.data], {
    type: normalizedContentType,
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "pincodes.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

export const getPincodesByCity = async (
  cityId: number | string
): Promise<PincodeMaster[]> => {
  const response =
    await api.get<PincodesByCityResponse>(
      `/pincodes/city/${cityId}`
    );

  return response.data.data ?? [];
};