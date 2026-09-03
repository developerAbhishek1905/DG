import api from "../../../services/api/axios";
import type {
  StateDeleteResponse,
  StateFormData,
  StateImportResponse,
  StateListResponse,
  StateMaster,
  StateQueryParams,
  StateSingleResponse,
} from "../types/state.types";

const STATE_API = "/states";

/**
 * GET
 * /states?page=1&limit=20&search=Madhya
 */
export const getStates = async (
  params: StateQueryParams = {},
): Promise<StateListResponse> => {
  const response = await api.get(STATE_API, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      search: params.search ?? "",
    },
  });

  return response.data;
};

/**
 * GET
 * /states/:stateId
 *
 * curl example:
 * /states/1
 *
 * stateId here is state_id, not MongoDB _id
 */
export const getStateById = async (
  stateId: number | string,
): Promise<StateMaster> => {
  const response = await api.get<StateSingleResponse>(
    `${STATE_API}/${stateId}`,
  );

  return response.data.data;
};

/**
 * POST
 * /states
 */
export const createState = async (
  data: StateFormData,
): Promise<StateMaster> => {
  const response = await api.post<StateSingleResponse>(STATE_API, data);

  return response.data.data;
};

/**
 * PUT
 * /states/:stateId
 */
export const updateState = async (
  stateId: number | string,
  data: StateFormData,
): Promise<StateMaster> => {
  const response = await api.put<StateSingleResponse>(
    `${STATE_API}/${stateId}`,
    data,
  );

  return response.data.data;
};

/**
 * DELETE
 * /states/:stateId
 */
export const deleteState = async (
  stateId: number | string,
): Promise<StateDeleteResponse> => {
  const response = await api.delete<StateDeleteResponse>(
    `${STATE_API}/${stateId}`,
  );

  return response.data;
};

/**
 * POST
 * /states/import
 *
 * multipart/form-data
 */
export const importStates = async (
  file: File,
): Promise<StateImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<StateImportResponse>(
    `${STATE_API}/import`,
    formData,
  );

  return response.data;
};

/**
 * GET
 * /states/export
 *
 * Excel file download
 */
export const exportStates = async (): Promise<void> => {
  const response = await api.get(`${STATE_API}/export`, {
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
  link.download = "states.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
