import api from "../../../services/api/axios";
import type {
  Appointment,
  AppointmentListResponse,
  AppointmentFormData,
  // AppointmentStatus,
  RescheduleAppointmentPayload,
} from "../types/appointment.types";

const APPOINTMENT_API = "/appointments";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| Get All Appointment Complaints
|--------------------------------------------------------------------------
*/

export interface AppointmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  complaintType?: string;
  fromDate?: string;
  toDate?: string;
}

export type AppointmentStatus =
  | "APPOINTMENT_SCHEDULED"
  | "PENDING"
  | "CANCELLED"
  | "CLOSED";

  export interface UpdateAppointmentStatusPayload {
  status: AppointmentStatus;

  appointmentDate?: string;
  appointmentTime?: string;

  pendingReason?: string;

  cancellationReason?: string;
}


export async function getAppointments(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  complaintType?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const response = await api.get(APPOINTMENT_API, {
    params,
  });

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Get Appointment By ID
|--------------------------------------------------------------------------
|
| Ye tab chalega jab backend me:
| GET /api/v1/appointments/:id
| available ho.
|
*/

export async function getAppointmentById(id: string) {
  const response = await api.get(`${APPOINTMENT_API}/${id}`);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Create Appointment
|--------------------------------------------------------------------------
|
| Backend endpoint required:
| POST /api/v1/appointments
|
*/

export async function createAppointment(data: AppointmentFormData) {
  const response = await api.post(APPOINTMENT_API, data);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Update Appointment Status
|--------------------------------------------------------------------------
|
| Backend endpoint example:
| PATCH /api/v1/appointments/:id/status
|
*/

export async function updateAppointmentStatus(
  id: string,
  payload: UpdateAppointmentStatusPayload,
) {
  const response = await api.patch(
    `/appointments/${id}/status`,
    payload,
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Reschedule Appointment
|--------------------------------------------------------------------------
|
| Backend endpoint example:
| PATCH /api/v1/appointments/:id/reschedule
|
*/

export async function rescheduleAppointment(
  payload: RescheduleAppointmentPayload,
) {
  const response = await api.patch(
    `${APPOINTMENT_API}/${payload.appointmentId}/reschedule`,
    {
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      reason: payload.reason,
    },
  );

  return response.data;
}
