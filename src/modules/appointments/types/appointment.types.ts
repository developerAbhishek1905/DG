export type AppointmentStatus =
  | "APPOINTMENT_SCHEDULED"
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

  
export interface Appointment {
  _id: string;

  complaintNumber: string;
  complaintDateTime: string;

  customerId?: {
    _id: string;
    name: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
  } | null;

  customerName: string;

  phone: string;
  alternatePhone?: string;
  email?: string;

  address: {
    addressLine: string;
    stateId?: number | null;
    state: string;
    districtId?: number | null;
    district?: string;
    cityId?: number | null;
    city: string;
    pincodeId?: number | null;
    pinCode?: string;
  };

  city: string;
  district: string;
  state: string;
  pincode: string;

  brand?: string;

  productName: string;
  productDescription?: string;
  category?: string;

  units: number;
  quoteAmount: number;

  faultReported: string;

  // category?: string;

  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  complaintType: "REGULAR" | "REPEAT" | "WARRANTY" | "INQUIRY";

  parentComplaintId?: string | null;

  repeatComplaintNumber?: string;

  adName?: string;
  subject?: string;
  description?: string;

  status:
    | "REGISTERED"
    | "ALLOCATED"
    | "APPOINTMENT_SCHEDULED"
    | "PENDING"
    | "WORK_IN_PROGRESS"
    | "WORK_COMPLETED"
    | "DG_VERIFICATION"
    | "CLOSED"
    | "CANCELLED";

  technicianId?: string | null;
  technicianName?: string;

  dealerId?: string | null;
  dealerName?: string;
  categoryId?: {
    _id: string;
    product_id: number;
    description: string;
    category: string;
  } | null;

  closedAt?: string | null;

  cancelledAt?: string | null;
  pendingReason?: string;
  cancellationReason?: string;

  allocatedDealerId?: {
  _id: string;
  headCode?: string;
  technicianFirmName?: string;
  technicianName?: string;
  mobileNumber?: string;
  alternativeNumber?: string;
  email?: string;
  status?: string;
} | null;

  createdAt: string;
  updatedAt: string;
}

export interface AppointmentComplaint {
  _id: string;

  complaintNumber: string;

  complaintDateTime: string;

  customerId?: {
    _id: string;
    name: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
  };

  customerName: string;

  phone: string;

  alternatePhone?: string;

  email?: string;

  address: {
    addressLine: string;
    stateId?: number | null;
    state: string;
    districtId?: number | null;
    district?: string;
    cityId?: number | null;
    city: string;
    pincodeId?: number | null;
    pinCode?: string;
  };

  productId?: number | null;

  productName: string;

  productType?: string;

  productCode?: string;

  category?: string;

  faultReported: string;

  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  complaintType: "REGULAR" | "REPEAT" | "WARRANTY" | "INQUIRY";

  status:
    | "REGISTERED"
    | "ALLOCATED"
    | "APPOINTMENT_SCHEDULED"
    | "PENDING"
    | "WORK_IN_PROGRESS"
    | "WORK_COMPLETED"
    | "DG_VERIFICATION"
    | "CLOSED"
    | "CANCELLED";

  allocatedDealerId?: {
    _id: string;
    dealerCode?: string;
    name?: string;
    ownerName?: string;
    phone?: string;
    email?: string;
    status?: string;
  } | null;

  createdAt: string;

  updatedAt: string;
}

export interface AppointmentCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

export interface AppointmentListResponse {
  success: boolean;

  message: string;

  data: AppointmentComplaint[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
