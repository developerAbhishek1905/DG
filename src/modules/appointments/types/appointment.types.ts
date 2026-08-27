export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "RESCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type AppointmentType =
  | "SERVICE"
  | "INSTALLATION"
  | "UNINSTALLATION"
  | "INSPECTION"
  | "VISIT";

export interface AppointmentCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

export interface AppointmentDealer {
  id: string;
  name: string;
  dealerCode: string;
  phone: string;
}

export interface Appointment {
  id: string;

  complaintId: string;
  complaintNumber: string;

  customer: AppointmentCustomer;

  dealer: AppointmentDealer;

  type: AppointmentType;

  appointmentDate: string;

  appointmentTime: string;

  status: AppointmentStatus;

  notes?: string;

  rescheduleReason?: string;

  originalAppointmentDate?: string;
  originalAppointmentTime?: string;

  rescheduleCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  complaintId: string;

  dealerId: string;

  type: AppointmentType;

  appointmentDate: string;

  appointmentTime: string;

  notes?: string;
}

export interface RescheduleAppointmentPayload {
  appointmentId: string;

  appointmentDate: string;

  appointmentTime: string;

  reason: string;
}