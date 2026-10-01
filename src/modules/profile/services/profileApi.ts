import api from "../../../services/api/axios";

api
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (
  data: ChangePasswordPayload,
) => {
  const response = await api.put(
    "/auth/change-password",
    data,
  );

  return response.data;
};