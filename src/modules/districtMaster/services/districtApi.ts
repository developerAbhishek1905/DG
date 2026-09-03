import api from "../../../services/api/axios";
import type {
  DistrictDeleteResponse,
  DistrictFormData,
  DistrictImportResponse,
  DistrictListResponse,
  DistrictMaster,
  DistrictQueryParams,
  DistrictSingleResponse,
} from "../types/district.types";

const DISTRICT_API = "/districts";

interface DistrictByStateResponse {
  success: boolean;
  message: string;
  data: DistrictMaster[];
}


export const getDistricts = async (
  params: DistrictQueryParams = {},
): Promise<DistrictListResponse> => {
  const response = await api.get<DistrictListResponse>(DISTRICT_API, {
    params: {
      page: params.page ?? 1,

      limit: params.limit ?? 20,

      search: params.search ?? "",
    },
  });

  return response.data;
};

export const getDistrictById = async (
  districtId: number | string,
): Promise<DistrictMaster> => {
  const response = await api.get<DistrictSingleResponse>(
    `${DISTRICT_API}/${districtId}`,
  );

  return response.data.data;
};

export const createDistrict = async (
  data: DistrictFormData,
): Promise<DistrictMaster> => {
  const response = await api.post<DistrictSingleResponse>(DISTRICT_API, data);

  return response.data.data;
};

export const updateDistrict = async (
  districtId: number | string,

  data: DistrictFormData,
): Promise<DistrictMaster> => {
  const response = await api.put<DistrictSingleResponse>(
    `${DISTRICT_API}/${districtId}`,
    data,
  );

  return response.data.data;
};

export const deleteDistrict = async (
  districtId: number | string,
): Promise<DistrictDeleteResponse> => {
  const response = await api.delete<DistrictDeleteResponse>(
    `${DISTRICT_API}/${districtId}`,
  );

  return response.data;
};

export const importDistricts = async (
  file: File,
): Promise<DistrictImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<DistrictImportResponse>(
    `${DISTRICT_API}/import`,
    formData,
  );

  return response.data;
};

export const exportDistricts = async (): Promise<void> => {
  const response = await api.get(`${DISTRICT_API}/export`, {
    responseType: "blob",
  });

  const contentTypeHeader = response.headers["content-type"];

  const mimeType = Array.isArray(contentTypeHeader)
    ? contentTypeHeader.join(",")
    : String(contentTypeHeader) ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const blob = new Blob([response.data], {
    type: mimeType,
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "districts.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

export const getDistrictsByState = async (
  stateId: number | string,
): Promise<DistrictMaster[]> => {
  const response = await api.get<DistrictByStateResponse>(
    `/districts/state/${stateId}`,
  );

  return response.data.data ?? [];
};
