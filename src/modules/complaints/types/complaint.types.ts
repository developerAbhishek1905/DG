export type ComplaintStatus =
  | "REGISTERED"
  | "ALLOCATED"
  | "APPOINTMENT_SCHEDULED"
  | "PENDING"
  | "WORK_IN_PROGRESS"
  | "WORK_COMPLETED"
  | "DG_VERIFICATION"
  | "CLOSED"
  | "CANCELLED";

export type ComplaintPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type ComplaintCategory =
  | "INSTALLATION"
  | "SERVICE"
  | "REPAIR"
  | "UNINSTALLATION"
  | "PRODUCT"
  | "OTHER";

export type ComplaintType =
  | "REGULAR"
  | "REPEAT"
  | "WARRANTY"
  | "PAID_SERVICE";

export interface Customer {
  id: string;

  customerCode?: string;

  name: string;

  phone: string;

  alternatePhone?: string;

  email?: string;

  address: string;

  city: string;

  district?: string;

  state: string;

  pincode?: string;

  contactInfo?: string;
}

export interface Product {
  id: string;

  name: string;

  model: string;

  serialNumber?: string;

  purchaseDate?: string;

  warrantyStatus?: "ACTIVE" | "EXPIRED";
}

export interface Dealer {
  id: string;

  name: string;

  code: string;

  phone: string;

  city: string;
}

export interface ComplaintTimelineItem {
  id: string;

  status: ComplaintStatus;

  title: string;

  description?: string;

  timestamp: string;

  user?: string;
}

export interface Complaint {
  id: string;

  complaintNumber: string;

  customer: Customer;

  product?: Product;

  dealer?: Dealer;

  category: ComplaintCategory;

  complaintType?: ComplaintType;

  subject: string;

  description: string;

  faultReported?: string;

  units?: number;

  quoteAmount?: number;

  adName?: string;

  repeatComplaintNumber?: string;

  status: ComplaintStatus;

  priority: ComplaintPriority;

  createdAt: string;

  updatedAt: string;

  appointmentDate?: string;

  slaDueAt?: string;

  timeline: ComplaintTimelineItem[];
}

/* =========================================
   CREATE COMPLAINT
========================================= */

export interface CreateComplaintPayload {
  customerId?: string;

  customerCode?: string;

  customerName: string;

  phone: string;

  alternatePhone?: string;

  email?: string;

  address: string;

  city: string;

  district?: string;

  state: string;

  pincode?: string;

  contactInfo?: string;

  productId?: string;

  productName?: string;

  units: number;

  quoteAmount?: number;

  productDescription?: string;

  faultReported: string;

  category: ComplaintCategory;

  complaintType: ComplaintType;

  priority: ComplaintPriority;

  adName?: string;

  repeatComplaintNumber?: string;

  subject: string;

  description?: string;
}

/* =========================================
   CUSTOMER LOOKUP
========================================= */

export interface CustomerLookupResponse {
  customer: Customer | null;

  complaintHistory: ComplaintHistoryItem[];
}

/* =========================================
   COMPLAINT HISTORY
========================================= */

export interface ComplaintHistoryItem {
  id: string;

  complaintNumber: string;

  createdAt: string;

  category: ComplaintCategory;

  complaintType?: ComplaintType;

  productName?: string;

  faultReported?: string;

  status: ComplaintStatus;

  priority?: ComplaintPriority;

  dealerName?: string;

  technicianName?: string;
}