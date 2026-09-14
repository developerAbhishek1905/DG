export type PendingReason =
  | "WAITING_FOR_CUSTOMER"
  | "PRODUCT_INSPECTION_PENDING"
  | "SPARE_PARTS_NOT_AVAILABLE"
  | "DEALER_UNAVAILABLE"
  | "CUSTOMER_RESCHEDULE_REQUEST"
  | "TECHNICAL_SUPPORT_REQUIRED"
  | "OTHER";

export type SLAStatus =
  | "SAFE"
  | "WARNING"
  | "BREACHED"
  | "RESOLVED";

export type PendingStatus =
  | "PENDING"
  | "RESOLVED"
  | "ESCALATED"
  | "REASSIGNED"
  | "CANCELLED";

export type PendingAction =
  | "CONTINUE"
  | "REASSIGN"
  | "ESCALATE"
  | "CANCEL"
  | "RESOLVE";

export interface PendingCustomer {
  id: string;
  name: string;
  phone: string;
  city: string;
}

export interface PendingDealer {
  id: string;
  name: string;
  dealerCode: string;
  phone: string;
}

// export interface PendingComplaint {
//   id: string;

//   complaintId: string;
//   complaintNumber: string;

//   customer: PendingCustomer;

//   dealer: PendingDealer;

//   productName: string;

//   reason: PendingReason;

//   reasonLabel: string;

//   remarks?: string;

//   pendingSince: string;

//   slaDeadline: string;

//   slaStatus: SLAStatus;

//   status: PendingStatus;

//   reminderCount: number;

//   lastReminderAt?: string;

//   createdAt: string;

//   updatedAt: string;
// }

export interface SetPendingPayload {
  complaintId: string;

  reason: PendingReason;

  remarks?: string;
}

export interface PendingActionPayload {
  pendingId: string;

  action: PendingAction;

  remarks?: string;
}
export interface PendingComplaint {
  _id: string;

  complaintNumber: string;
  complaintDateTime: string;

  customerId: {
    _id: string;
    customerCode: string;
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

    stateId: number | null;
    state: string;

    districtId: number | null;
    district: string;

    cityId: number | null;
    city: string;

    pincodeId: number | null;
    pinCode: string;
  };

  productId: number | null;
  productName: string;

  productTypeId: string | null;
  productType: string;

  categoryId: string | null;
  category: string;

  priority: string;

  status: string;

  allocatedDealerId: {
    _id: string;
    technicianFirmName: string;
    technicianName: string;
    mobileNumber: string;
    status: string;
    technicianCode: string;
  } | null;

  allocationId: string | null;
  allocationRuleId: string | null;
  allocatedAt: string | null;

  appointmentDate: string | null;
  appointmentTime: string;

  pendingReason: string;

  closedAt: string | null;

  cancelledAt: string | null;
  cancellationReason: string;

  createdAt: string;
  updatedAt: string;
}