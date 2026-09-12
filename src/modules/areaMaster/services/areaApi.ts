import api from "../../../services/api/axios";
import type {
  Area,
  AreaDeleteResponse,
  AreaFormData,
  AreaListResponse,
  AreaQueryParams,
  AreaSingleResponse,
} from "../types/area.types";

const AREA_API = "/areas";

/* =========================================
   GET ALL AREAS
========================================= */

export const getAreas = async (
  params: AreaQueryParams = {},
): Promise<AreaListResponse> => {
  const response = await api.get<AreaListResponse>(AREA_API, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      search: params.search ?? "",
      ...(params.state_id? {state_id: params.state_id,}: {}),
      ...(params.district_id ? { district_id: params.district_id,}: {}),
      ...(params.city_id ? {  city_id: params.city_id,  }: {}),
      ...(params.pincode_id? { pincode_id: params.pincode_id, }: {}),
      ...(params.status  ? { status: params.status, } : {}),
    },
  });

  return response.data;
};

/* =========================================
   GET AREA BY ID
========================================= */

export const getAreaById = async (id: string): Promise<Area> => {
  const response = await api.get<AreaSingleResponse>(`${AREA_API}/${id}`);
  return response.data.data;
};

/* =========================================
   CREATE AREA
========================================= */

export const createArea = async (data: AreaFormData): Promise<Area> => {
  const response = await api.post<AreaSingleResponse>(AREA_API, data);
  return response.data.data;
};

/* =========================================
   UPDATE AREA
========================================= */

export const updateArea = async (
  id: string,
  data: AreaFormData,
): Promise<Area> => {
  const response = await api.put<AreaSingleResponse>(`${AREA_API}/${id}`, data);
  return response.data.data;
};

/* =========================================
   DELETE AREA
========================================= */

export const deleteArea = async (id: string): Promise<AreaDeleteResponse> => {
  const response = await api.delete<AreaDeleteResponse>(`${AREA_API}/${id}`);
  return response.data;
};

/* ======================================
   IMPORT AREAS
====================================== */

export const importAreas = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(`${AREA_API}/import`, formData);
  return response.data;
};

/* ======================================
   EXPORT AREAS
====================================== */

export const exportAreas = async (): Promise<void> => {
  const response = await api.get(`${AREA_API}/export`, {
    responseType: "blob",
  });

  const contentTypeHeader = response.headers["content-type"];
  const contentType =
    typeof contentTypeHeader === "string"
      ? contentTypeHeader
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const blob = new Blob([response.data], {
    type: contentType,
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "areas.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
