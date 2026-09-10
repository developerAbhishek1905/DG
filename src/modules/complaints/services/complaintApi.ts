import api from "../../../services/api/axios";

import type {
  Complaint,
  ComplaintFilters,
  ComplaintHistoryItem,
  ComplaintListResponse,
  CreateComplaintPayload,
  Customer,
  CustomerLookupResponse,
  UpdateComplaintPayload,
} from "../types/complaint.types";

const COMPLAINT_API = "/complaints";

const CUSTOMER_API = "/customers";

/*
|--------------------------------------------------------------------------
| Backend Types
|--------------------------------------------------------------------------
|
| MongoDB returns _id.
| Frontend currently expects id.
|
|--------------------------------------------------------------------------
*/

interface BackendCustomer extends Omit<Customer, "id"> {
  _id: string;
}

interface BackendComplaint extends Omit<Complaint, "id" | "customer"> {
  _id: string;

  customerId?: string | BackendCustomer;

  parentComplaintId?:
    | string
    | {
        _id: string;
        complaintNumber: string;
        complaintType?: string;
        status?: string;
      }
    | null;
}

export interface UpdateCustomerPayload {
  name: string;

  phone: string;

  alternatePhone?: string;

  email?: string;

  address: Address;

  contactInfo?: string;

  status?: "ACTIVE" | "INACTIVE";
}

/*
|--------------------------------------------------------------------------
| Normalize Customer
|--------------------------------------------------------------------------
*/

const normalizeCustomer = (
  customer?: BackendCustomer | null,
): Customer | null => {
  if (!customer) {
    return null;
  }

  return {
    ...customer,

    id: customer._id,
  };
};

/*
|--------------------------------------------------------------------------
| Normalize Complaint
|--------------------------------------------------------------------------
*/

const normalizeComplaint = (complaint: BackendComplaint): Complaint => {
  let customer: Customer | undefined;

  let customerId: string | undefined;

  if (complaint.customerId && typeof complaint.customerId === "object") {
    customer = normalizeCustomer(complaint.customerId) || undefined;

    customerId = complaint.customerId._id;
  } else {
    customerId = complaint.customerId;
  }

  let parentComplaintId: string | null | undefined;

  if (
    complaint.parentComplaintId &&
    typeof complaint.parentComplaintId === "object"
  ) {
    parentComplaintId = complaint.parentComplaintId._id;
  } else {
    parentComplaintId = complaint.parentComplaintId;
  }

  return {
    ...complaint,

    id: complaint._id,

    customerId,

    customer,

    parentComplaintId,

    timeline: complaint.timeline || [],
  };
};

/*
|--------------------------------------------------------------------------
| Normalize Complaint History
|--------------------------------------------------------------------------
*/

const normalizeHistoryItem = (
  complaint: BackendComplaint,
): ComplaintHistoryItem => {
  return {
    id: complaint._id,

    complaintNumber: complaint.complaintNumber,

    createdAt: complaint.createdAt,

    category: complaint.category,

    complaintType: complaint.complaintType,

    productName: complaint.productName,

    faultReported: complaint.faultReported,

    status: complaint.status,

    priority: complaint.priority,

    isWarranty: complaint.isWarranty,

    technicianName: complaint.technicianName,

    dealerName: complaint.dealerName,
  };
};

/*
|--------------------------------------------------------------------------
| GET ALL COMPLAINTS
|--------------------------------------------------------------------------
*/

export const getComplaints = async (
  filters: ComplaintFilters = {},
): Promise<ComplaintListResponse> => {
  const params: Record<string, string | number> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.complaintType) {
    params.complaintType = filters.complaintType;
  }

  if (filters.priority) {
    params.priority = filters.priority;
  }

  if (filters.customerId) {
    params.customerId = filters.customerId;
  }

  if (filters.technicianId) {
    params.technicianId = filters.technicianId;
  }

  if (filters.dealerId) {
    params.dealerId = filters.dealerId;
  }

  if (filters.fromDate) {
    params.fromDate = filters.fromDate;
  }

  if (filters.toDate) {
    params.toDate = filters.toDate;
  }

  params.page = filters.page || 1;

  params.limit = filters.limit || 10;

  const response = await api.get(COMPLAINT_API, {
    params,
  });

  const complaints = (response.data?.data || []).map(
    (complaint: BackendComplaint) => normalizeComplaint(complaint),
  );

  return {
    data: complaints,

    pagination: response.data?.pagination || {
      total: complaints.length,

      page: filters.page || 1,

      limit: filters.limit || 10,

      totalPages: 1,
    },
  };
};

/*
|--------------------------------------------------------------------------
| GET COMPLAINT BY ID
|--------------------------------------------------------------------------
*/

export const getComplaintById = async (id: string): Promise<Complaint> => {
  const response = await api.get(`${COMPLAINT_API}/${id}`);

  return normalizeComplaint(response.data.data);
};

/*
|--------------------------------------------------------------------------
| CREATE COMPLAINT
|--------------------------------------------------------------------------
*/

export const createComplaint = async (
  data: CreateComplaintPayload,
): Promise<Complaint> => {
  const response = await api.post(COMPLAINT_API, data);

  return normalizeComplaint(response.data.data);
};

/*
|--------------------------------------------------------------------------
| UPDATE COMPLAINT
|--------------------------------------------------------------------------
*/

export const updateComplaint = async (
  id: string,
  data: UpdateComplaintPayload,
): Promise<Complaint> => {
  const response = await api.put(`${COMPLAINT_API}/${id}`, data);

  return normalizeComplaint(response.data.data);
};

/*
|--------------------------------------------------------------------------
| DELETE COMPLAINT
|--------------------------------------------------------------------------
*/

export const deleteComplaint = async (id: string): Promise<string> => {
  const response = await api.delete(`${COMPLAINT_API}/${id}`);

  return response.data?.message || "Complaint deleted successfully";
};

/*
|--------------------------------------------------------------------------
| LOOKUP CUSTOMER BY PHONE
|--------------------------------------------------------------------------
*/

export const lookupCustomerByPhone = async (
  phone: string,
): Promise<CustomerLookupResponse> => {
  const cleanedPhone = phone.trim();

  const response = await api.get(`${CUSTOMER_API}/lookup/${cleanedPhone}`);

  const customer = normalizeCustomer(response.data?.customer);

  const complaintHistory = (response.data?.complaintHistory || []).map(
    (complaint: BackendComplaint) => normalizeHistoryItem(complaint),
  );

  return {
    customer,

    complaintHistory,
  };
};

export const updateCustomer = async (
  customerId: string,
  data: UpdateCustomerPayload,
): Promise<Customer> => {
  const response = await api.put(`/customers/${customerId}`, data);

  const customer = response.data.data;

  return {
    ...customer,
    id: customer._id,
  };
};

/* ===============================
   BRAND
================================ */

export interface BrandDropdownOption {
  id: string;
  brandName: string;
}

export const searchBrands = async (
  search = "",
): Promise<BrandDropdownOption[]> => {
  const response = await api.get("/brands/dropdown", {
    params: {
      search,
    },
  });

  return response.data?.data || [];
};

/* ===============================
   PRODUCT
================================ */

export interface ProductDropdownOption {
  product_id: number;
  product_name: string;
}

export const searchProducts = async (
  search = "",
): Promise<ProductDropdownOption[]> => {
  const response = await api.get("/products/dropdown", {
    params: {
      search,
    },
  });

  return response.data?.data || [];
};

/* ===============================
   PRODUCT TYPE
================================ */

export interface ProductTypeDropdownOption {
  id?: string;

  product_id: number;

  product_code?: string;

  product_type: string;
}

interface ProductTypeSearchParams {
  productId: number;
  search?: string;
}

export const searchProductTypes = async ({
  productId,
  search = "",
}: ProductTypeSearchParams): Promise<ProductTypeDropdownOption[]> => {
  const response = await api.get("/product-types/dropdown", {
    params: {
      product_id: productId,
      search,
    },
  });

  return response.data?.data || [];
};
