export type ComplaintStatus =
  | "REGISTERED"
  | "ALLOCATED"
  | "APPOINTMENT_SCHEDULED"
  | "PENDING"
  | "WORK_IN_PROGRESS"
  | "WORK_COMPLETED"
  | "DG_VERIFICATION"
  | "CLOSED"
  | "CANCELLED"
  | "SUSPENDED";

export type ComplaintPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT"
  | "CRITICAL";

export type ComplaintType = "REGULAR" | "REPEAT" | "WARRANTY" | "PAID_SERVICE";

export interface ComplaintAddress {
  addressLine: string;
  stateId?: number;
  state: string;
  districtId?: number;
  district: string;
  cityId?: number;
  city: string;
  pincodeId?: number;
  pinCode: string;
}

export interface Address {
  addressLine: string;
  stateId: number | null;
  state: string;
  districtId: number | null;
  district: string;
  cityId: number | null;
  city: string;
  pincodeId: number | null;
  pinCode: string;
}

export interface Customer {
  id: string;
  customerCode?: string;
  customerName: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address: Address;
  city: string;
  state: string;
  pincode: string;
  contactInfo?: string;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id?: string;
  name: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyStatus?: "ACTIVE" | "EXPIRED";
}

export interface Dealer {
  id: string;
  name: string;
  code: string;
  phone?: string;
  city?: string;
}

export interface ComplaintTimelineItem {
  id: string;
  status: ComplaintStatus;
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
}

export type ComplaintCategory = string;

export interface Complaint {
  id: string;
   _id?: string;
  complaintNumber: string;
  complaintDateTime?: string;
  customerId?: string;
  customer: Customer;
  customerName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address: Address;
  brand?: string;
    brandId?: {
    _id: string;
    brandName: string;
  };
    productId?: number;
  productName?: string;
 
  productDescription?: string;
  units: number;
  quoteAmount?: number;
  faultReported: string;
  category: ComplaintCategory;
  complaintType: ComplaintType;
  priority: ComplaintPriority;
  parentComplaintId?: string | null;
  repeatComplaintNumber?: string;
  adName?: string;
  subject?: string;
  description?: string;
  status: ComplaintStatus;
  technicianId?: string | null;
  technicianName: string;
  dealerId?: string | null;
  dealerName?: string;
  closedAt?: string | null;
  warrantyStartDate?: string | null;
  warrantyEndDate?: string | null;
  isWarranty: boolean;
  cancelledAt?: string | null;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  appointmentDate?: string;
  slaDueAt?: string;
  timeline?: ComplaintTimelineItem[];
  allocatedDealerId:any
}


export interface CreateComplaintPayload {
  customerId?: string;
  customerName: string;
  customerCode: string;
  phone: string;
  contactInfo: any;
  alternatePhone?: string;
  email?: string;
  address: Address;
  brand?: string;
  productName: string;
  productDescription?: string;
  units: number;
  quoteAmount?: number;
  faultReported: string;
  category: ComplaintCategory;
  complaintType: ComplaintType;
  productId: any;
  productTypeId: any;
  productType: string;
  priority: ComplaintPriority;
  categoryId: any;
  adName?: string;
  repeatComplaintNumber?: string;
  subject?: string;
  description?: string;
}

export interface UpdateComplaintPayload {
  customerName?: string;
  phone?: string;
  alternatePhone?: string;
  email?: string;
  address?: Address;
  brand?: string;
  productName?: string;
  productDescription?: string;
  units?: number;
  quoteAmount?: number;
  faultReported?: string;
  category?: ComplaintCategory;
  complaintType?: ComplaintType;
  priority?: ComplaintPriority;
  adName?: string;
  subject?: string;
  description?: string;
  status?: ComplaintStatus;
  technicianId?: string | null;
  technicianName: string;
  dealerId?: string | null;
  cancellationReason?: string;
}

export interface ComplaintFilters {
  search?: string;
  status?: ComplaintStatus | "";
  complaintType?: ComplaintType | "";
  priority?: ComplaintPriority | "";
  customerId?: string;
  technicianId?: string;
  dealerId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

interface AllocatedDealer {
  _id: string;
  technicianName: string;
  mobileNumber: string;
}

export interface ComplaintHistoryItem {
  id?: string;
  _id?: string;
  allocatedDealerId: AllocatedDealer;
  complaintNumber: string;
  createdAt: string;
  productName: string;
  category: string;
  priority:string;
  faultReported: string;
  complaintType: string;
  technicianName: string;
  technicianNumber?: string;
  status: ComplaintStatus;
  warrantyStartDate?: string | null;
  warrantyEndDate?: string | null;
  isWarranty: boolean;
  dealerName: any
}

export interface CustomerLookupResponse {
  customer: Customer | null;
  complaintHistory: ComplaintHistoryItem[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ComplaintListResponse {
  data: Complaint[];
  success: boolean;
  pagination: Pagination;
}

export interface ComplaintFormData {
  complaintNumber: string;
  complaintDateTime: string;
  customerCode: string;
  customerId?: string;
  categoryId: number;
  customerPhone: string;
  customerName: string;
  alternatePhone?: string;
  customerEmail?: string;
  address: ComplaintAddress;
  contactInfo?: string;
  brandId?: string;
  brand: string;
  productId?: number;
  productName: string;
  productTypeId?: string;
  productType: string;
  productDescription?: string;
  units: number;
  quoteAmount?: number;
  faultReported: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  complaintType: ComplaintType;
  adName?: string;
  status: ComplaintStatus;
  repeatComplaintNumber?: string;
  subject?: string;
  description?: string;
}

export interface ComplaintDealer {
  _id: string;
  technicianCode?: string;
  technicianFirmName?: string;
  technicianName?: string;
  mobileNumber?: string;
  rating?: number;
  status?: string;
}

export interface ComplaintCustomer {
  _id: string;
  customerCode?: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  contactInfo?: string;

  address?: {
    addressLine?: string;
    stateId?: number;
    state?: string;
    districtId?: number;
    district?: string;
    cityId?: number;
    city?: string;
    pincodeId?: number;
    pinCode?: string;
  };
}

export interface ComplaintCategoryData {
  _id: string;
  product_id?: number;
  category?: string;
  description?: string;
  categoryDescription?: string;
  status?: string;
}

export interface ComplaintProductTypeData {
  _id: string;
  product_id?: number;
  product_code?: string;
  product_type?: string;
}