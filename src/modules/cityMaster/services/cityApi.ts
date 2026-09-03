import api from "../../../services/api/axios";
import type {
  CityDeleteResponse,
  CityFormData,
  CityImportResponse,
  CityListResponse,
  CityMaster,
  CityQueryParams,
  CitySingleResponse,
} from "../types/city.types";

const CITY_API = "/cities";

/* ========================================
   GET ALL CITIES
======================================== */

interface CityFilterResponse {
  success: boolean;
  message: string;
  data: CityMaster[];
}

export const getCities = async (
  params: CityQueryParams = {},
): Promise<CityListResponse> => {
  const response = await api.get<CityListResponse>(CITY_API, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      search: params.search ?? "",

      ...(params.state_id
        ? {
            state_id: params.state_id,
          }
        : {}),

      ...(params.district_id
        ? {
            district_id: params.district_id,
          }
        : {}),
    },
  });

  return response.data;
};

/* ========================================
   GET SINGLE CITY
======================================== */

export const getCityById = async (
  cityId: number | string,
): Promise<CityMaster> => {
  const response = await api.get<CitySingleResponse>(`${CITY_API}/${cityId}`);

  return response.data.data;
};

/* ========================================
   CREATE CITY
======================================== */

export const createCity = async (data: CityFormData): Promise<CityMaster> => {
  const response = await api.post<CitySingleResponse>(CITY_API, data);

  return response.data.data;
};

/* ========================================
   UPDATE CITY
======================================== */

export const updateCity = async (
  cityId: number | string,
  data: CityFormData,
): Promise<CityMaster> => {
  const response = await api.put<CitySingleResponse>(
    `${CITY_API}/${cityId}`,
    data,
  );

  return response.data.data;
};

/* ========================================
   DELETE CITY
======================================== */

export const deleteCity = async (
  cityId: number | string,
): Promise<CityDeleteResponse> => {
  const response = await api.delete<CityDeleteResponse>(
    `${CITY_API}/${cityId}`,
  );

  return response.data;
};

/* ========================================
   IMPORT CITIES
======================================== */

export const importCities = async (file: File): Promise<CityImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<CityImportResponse>(
    `${CITY_API}/import`,
    formData,
  );

  return response.data;
};

/* ========================================
   EXPORT CITIES
======================================== */

export const exportCities = async (): Promise<void> => {
  const response = await api.get(`${CITY_API}/export`, {
    responseType: "blob",
  });

  const contentTypeValue = response.headers["content-type"];
  const contentType =
    Array.isArray(contentTypeValue)
      ? contentTypeValue[0]
      : typeof contentTypeValue === "string"
        ? contentTypeValue
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const blob = new Blob([response.data], {
    type: contentType,
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "cities.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

export const getCitiesByStateAndDistrict = async (
  stateId: number | string,
  districtId: number | string
): Promise<CityMaster[]> => {
  const response =
    await api.get<CityFilterResponse>(
      "/cities/filter",
      {
        params: {
          state_id: stateId,
          district_id: districtId,
        },
      }
    );

  return response.data.data ?? [];
};