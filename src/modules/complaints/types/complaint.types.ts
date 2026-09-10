// export type ComplaintStatus =
//   | "REGISTERED"
//   | "ALLOCATED"
//   | "APPOINTMENT_SCHEDULED"
//   | "PENDING"
//   | "WORK_IN_PROGRESS"
//   | "WORK_COMPLETED"
//   | "DG_VERIFICATION"
//   | "CLOSED"
//   | "CANCELLED";

// export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// export interface ComplaintMobileNumber {
//   number: string;
//   description?: string;
// }

// export interface ComplaintAddress {
//   address: string;
//   description?: string;
// }

// export type ComplaintCategory =
//   | "INSTALLATION"
//   | "SERVICE"
//   | "REPAIR"
//   | "UNINSTALLATION"
//   | "PRODUCT"
//   | "OTHER";

// export type ComplaintType = "REGULAR" | "REPEAT" | "WARRANTY" | "PAID_SERVICE";

// export interface Customer {
//   id: string;

//   customerCode?: string;

//   name: string;

//   phone: string;

//   alternatePhone?: string;

//   email?: string;

//   address: string;

//   city: string;

//   district?: string;

//   state: string;

//   pincode?: string;

//   contactInfo?: string;
// }

// export interface Product {
//   id: string;

//   name: string;

//   model: string;

//   serialNumber?: string;

//   purchaseDate?: string;

//   warrantyStatus?: "ACTIVE" | "EXPIRED";
// }

// export interface Dealer {
//   id: string;

//   name: string;

//   code: string;

//   phone: string;

//   city: string;
// }

// export interface ComplaintTimelineItem {
//   id: string;

//   status: ComplaintStatus;

//   title: string;

//   description?: string;

//   timestamp: string;

//   user?: string;
// }

// export interface Complaint {
//   id: string;

//   complaintNumber: string;

//   customer: Customer;

//   product?: Product;

//   dealer?: Dealer;

//   category: ComplaintCategory;

//   complaintType?: ComplaintType;

//   subject: string;

//   description: string;

//   faultReported?: string;

//   units?: number;

//   quoteAmount?: number;

//   adName?: string;

//   repeatComplaintNumber?: string;

//   status: ComplaintStatus;

//   priority: ComplaintPriority;

//   createdAt: string;

//   updatedAt: string;

//   appointmentDate?: string;

//   slaDueAt?: string;

//   timeline: ComplaintTimelineItem[];
// }

// /* =========================================
//    CREATE COMPLAINT
// ========================================= */

// export interface CreateComplaintPayload {
//   complaintNumber?: string;
//   customerId?: string;

//   customerCode?: string;

//   customerName: string;

//   mobileNumbers: ComplaintMobileNumber[];
//   addresses: ComplaintAddress[];

//   // phone: string;

//   // alternatePhone?: string;

//   email?: string;

//   // address: string;

//   city: string;

//   district?: string;

//   state: string;

//   pincode?: string;

//   contactInfo?: string;

//   productId?: string;

//   productName?: string;

//   units: number;

//   quoteAmount?: number;

//   productDescription?: string;

//   faultReported: string;

//   category: ComplaintCategory;

//   complaintType: ComplaintType;

//   priority: ComplaintPriority;

//   adName?: string;

//   repeatComplaintNumber?: string;

//   subject: string;

//   description?: string;
// }

// /* =========================================
//    CUSTOMER LOOKUP
// ========================================= */

// export interface CustomerLookupResponse {
//   customer: Customer | null;

//   complaintHistory: ComplaintHistoryItem[];
// }

// /* =========================================
//    COMPLAINT HISTORY
// ========================================= */

// export interface ComplaintHistoryItem {
//   id: string;

//   complaintNumber: string;

//   createdAt: string;

//   category: ComplaintCategory;

//   complaintType?: ComplaintType;

//   productName?: string;

//   faultReported?: string;

//   status: ComplaintStatus;

//   priority?: ComplaintPriority;

//   dealerName?: string;

//   technicianName?: string;
// }


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
  | "URGENT";


export type ComplaintType =
  | "REGULAR"
  | "REPEAT"
  | "WARRANTY"
  | "PAID_SERVICE";


/*
|--------------------------------------------------------------------------
| Address
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Customer
|--------------------------------------------------------------------------
*/

export interface Customer {
  id: string;

  customerCode?: string;

  name: string;

  phone: string;

  alternatePhone?: string;

  email?: string;

  address: Address;

  contactInfo?: string;

  status?: "ACTIVE" | "INACTIVE";

  createdAt?: string;

  updatedAt?: string;
}


/*
|--------------------------------------------------------------------------
| Product
|--------------------------------------------------------------------------
*/

export interface Product {
  id?: string;

  name: string;

  model?: string;

  serialNumber?: string;

  purchaseDate?: string;

  warrantyStatus?: "ACTIVE" | "EXPIRED";
}


/*
|--------------------------------------------------------------------------
| Dealer
|--------------------------------------------------------------------------
*/

export interface Dealer {
  id: string;

  name: string;

  code: string;

  phone?: string;

  city?: string;
}


/*
|--------------------------------------------------------------------------
| Timeline
|--------------------------------------------------------------------------
*/

export interface ComplaintTimelineItem {
  id: string;

  status: ComplaintStatus;

  title: string;

  description?: string;

  timestamp: string;

  user?: string;
}


/*
|--------------------------------------------------------------------------
| Category
|--------------------------------------------------------------------------
|
| Your backend currently accepts string categories such as:
| WASHING_MACHINE
|
|--------------------------------------------------------------------------
*/

export type ComplaintCategory = string;


/*
|--------------------------------------------------------------------------
| Complaint
|--------------------------------------------------------------------------
*/

export interface Complaint {
  id: string;

  complaintNumber: string;

  complaintDateTime?: string;

  customerId?: string;

  customer?: Customer;

  customerName: string;

  phone: string;

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

  priority: ComplaintPriority;

  parentComplaintId?: string | null;

  repeatComplaintNumber?: string;

  adName?: string;

  subject?: string;

  description?: string;

  status: ComplaintStatus;

  technicianId?: string | null;

  technicianName?: string;

  dealerId?: string | null;

  dealerName?: string;

  closedAt?: string | null;

    warrantyStartDate?:
    | string
    | null;

  warrantyEndDate?:
    | string
    | null;

  isWarranty: boolean;

  cancelledAt?: string | null;

  cancellationReason?: string;

  createdAt: string;

  updatedAt: string;

  appointmentDate?: string;

  slaDueAt?: string;

  timeline?: ComplaintTimelineItem[];
}


/*
|--------------------------------------------------------------------------
| Create Complaint
|--------------------------------------------------------------------------
*/

export interface CreateComplaintPayload {
  customerId?: string;

  customerName: string;

  phone: string;

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

  priority: ComplaintPriority;

  adName?: string;

  repeatComplaintNumber?: string;

  subject?: string;

  description?: string;
}


/*
|--------------------------------------------------------------------------
| Update Complaint
|--------------------------------------------------------------------------
*/

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

  technicianName?: string;

  dealerId?: string | null;

  cancellationReason?: string;
}


/*
|--------------------------------------------------------------------------
| Complaint List Filters
|--------------------------------------------------------------------------
*/

// export interface ComplaintFilters {
//   search?: string;

//   status?: ComplaintStatus | "";

//   complaintType?: ComplaintType | "";

//   priority?: ComplaintPriority | "";

//   customerId?: string;

//   technicianId?: string;

//   dealerId?: string;

//   page?: number;

//   limit?: number;
// }

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


/*
|--------------------------------------------------------------------------
| Complaint History
|--------------------------------------------------------------------------
*/

export interface ComplaintHistoryItem {
  id?: string;
  _id?: string;

  complaintNumber: string;

  createdAt: string;

  productName: string;

  category: string;

  faultReported: string;

  complaintType: string;

  technicianName?: string;

  status: ComplaintStatus;

  warrantyStartDate?: string | null;

  warrantyEndDate?: string | null;

  isWarranty: boolean;
}


/*
|--------------------------------------------------------------------------
| Customer Lookup
|--------------------------------------------------------------------------
*/

export interface CustomerLookupResponse {
  customer: Customer | null;

  complaintHistory: ComplaintHistoryItem[];
}


/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

export interface Pagination {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}


export interface ComplaintListResponse {
  data: Complaint[];

  pagination: Pagination;
}

export interface ComplaintFormData {
  complaintNumber: string;
  complaintDateTime: string;

  customerId?: string;

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

  category?: ComplaintCategory;
  priority?: ComplaintPriority;

  complaintType: ComplaintType;

  adName?: string;
  status: ComplaintStatus;
  repeatComplaintNumber?: string;

  subject?: string;
  description?: string;
}