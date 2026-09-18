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

export interface CalendarParams {
  startDate: string;
  endDate: string;
  status?: string;
  dealerId?: string;
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
  const response = await api.get(`/complaints/${id}`);

  return response.data.data;
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
  status: string | Partial<UpdateAppointmentStatusPayload>,
  payload: Partial<UpdateAppointmentStatusPayload> = {},
) {
  console.log(payload)
  const response = await api.patch(`/appointments/${id}/status`, typeof status === "string" ? { status, ...payload } : status);

  return response.data.data;
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

export type ReasonType =
| "close"
  | "on_call_pending"
  | "on_call_cancel"
  | "after_call_pending"
  | "after_call_cancel";

export const getReasonDropdown = async (
  reasonType: ReasonType,
) => {
  const response = await api.get("/reasons/dropdown", {
    params: {
      reasonType,
    },
  });

  return response.data;
};

export const getCalendarAppointments = async (
  params: CalendarParams,
): Promise<Appointment[]> => {
  const response = await api.get(
    "/appointments/calendar",
    {
      params,
    },
  );

  return response.data?.data || [];
};

export interface ComplaintActivity {
  _id: string;

  complaintId: string;

  complaintNumber: string;

  activityType: string;

  previousStatus?: string | null;

  newStatus?: string | null;

  title: string;

  description?: string;

  reason?: string;

  appointmentDate?: string | null;

  appointmentTime?: string;

  dealerName?: string;

  technicianName?: string;

  performedByName?: string;

  performedByRole?: string;

  metadata?: Record<
    string,
    unknown
  >;

  activityAt: string;

  createdAt: string;
}

export interface ComplaintActivityResponse {
  complaintId: string;

  complaintNumber: string;

  totalActivities: number;

  activities: ComplaintActivity[];
}

export const getComplaintActivities =
  async (
    complaintId: string,
  ): Promise<ComplaintActivityResponse> => {
    const response =
      await api.get(
        `/appointments/complaint/${complaintId}`,
      );

    return response.data.data;
  };
