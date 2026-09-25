import api from "../../../services/api/axios";

import type {
  Complaint,
  ComplaintFilters,
  ComplaintHistoryItem,
  ComplaintListResponse,
  CreateComplaintPayload,
  Customer,
  Address,
  CustomerLookupResponse,
  UpdateComplaintPayload,
} from "../types/complaint.types";

const COMPLAINT_API = "/complaints";
const CUSTOMER_API = "/customers";

interface BackendCustomer {
  _id: string;
  customerName: string;
  phone: any;
}

// interface BackendComplaint extends Omit<Complaint, "id" | "customer"> {
//   _id: string;
//   customerId?: string | BackendCustomer;
//   parentComplaintId?:
//     | string
//     | {
//         _id: string;
//         complaintNumber: string;
//         complaintType?: string;
//         status?: string;
//       }
//     | null;
// }

interface BackendParentComplaint {
  _id: string;
  complaintNumber: string;
  complaintType?: string;
  status?: string;
}

// interface BackendComplaint extends Omit<
//   Complaint,
//   "id" | "customer" | "customerId" | "parentComplaintId"
// > {
//   _id: string;
//   customerId?: string | BackendCustomer;
//   parentComplaintId?: string | BackendParentComplaint | null;
// }

interface BackendComplaint extends Omit<
  Complaint,
  "id" | "customer" | "customerId" | "parentComplaintId" | "allocatedDealerId"
> {
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

  allocatedDealerId?: string | any | null;
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

export interface CategoryDropdownOption {
  _id: string;
  id?: string;
  product_id: number;
  product_name?: string;
  category: string;
  description: string;
  categoryDescription?: string;
  status?: string;
}
const normalizeCustomer = (customer?: BackendCustomer | null): any | null => {
  if (!customer) {
    return null;
  }

  return {
    ...customer,
    id: customer._id,
    customerName: customer.customerName,
    phone: customer.phone,
  };
};

/*
|--------------------------------------------------------------------------
| Normalize Complaint
|--------------------------------------------------------------------------
*/

const normalizeComplaint = (complaint: any): Complaint => {
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

const normalizeHistoryItem = (complaint: BackendComplaint): any => {
  const allocatedDealer =
    complaint.allocatedDealerId &&
    typeof complaint.allocatedDealerId === "object"
      ? complaint.allocatedDealerId
      : null;

  return {
    id: complaint._id,
    complaintNumber: complaint.complaintNumber,
    createdAt: complaint.createdAt,
    category: complaint.category,
    complaintType: complaint.complaintType,
    productName: complaint.productName,

    technicianName:
      allocatedDealer?.technicianName ?? complaint.technicianName ?? "-",

    technicianNumber: allocatedDealer?.mobileNumber ?? "-",

    faultReported: complaint.faultReported,
    status: complaint.status,
    priority: complaint.priority,
    isWarranty: complaint.isWarranty,
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
): Promise<any> => {
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

export const lookupCustomerByPhone = async (cleanedPhone: string) => {
  const response = await api.get(
    // `/complaints/customer/${phone}`,
    `${CUSTOMER_API}/lookup/${cleanedPhone}`
  );

  const data = response.data;

  return {
    ...data,

    customer: data.customer
      ? {
          ...data.customer,

          id: data.customer._id || data.customer.id,
        }
      : null,

    complaintHistory: (data.complaintHistory || []).map(
      (item: any) => ({
        /*
        |--------------------------------------------------------------------------
        | IDs
        |--------------------------------------------------------------------------
        */

        id: item._id || item.id,
        _id: item._id || item.id,

        complaintNumber: item.complaintNumber,

        /*
        |--------------------------------------------------------------------------
        | Dates
        |--------------------------------------------------------------------------
        */

        createdAt:
          item.createdAt ||
          item.complaintDateTime,

        complaintDateTime:
          item.complaintDateTime,

        /*
        |--------------------------------------------------------------------------
        | Brand
        |--------------------------------------------------------------------------
        */

        brandId: item.brandId,
        brand: item.brand || "",

        /*
        |--------------------------------------------------------------------------
        | Product
        |--------------------------------------------------------------------------
        */

        productId: item.productId,

        productName: item.productName || "",

        productCode: item.productCode || "",

        productDescription:
          item.productDescription || "",

        /*
        |--------------------------------------------------------------------------
        | Product Type
        |--------------------------------------------------------------------------
        */

        productTypeId: item.productTypeId,

        productType: item.productType || "",

        /*
        |--------------------------------------------------------------------------
        | Category
        |--------------------------------------------------------------------------
        */

        categoryId: item.categoryId,

        category: item.category || "",

        /*
        |--------------------------------------------------------------------------
        | Complaint Details
        |--------------------------------------------------------------------------
        */

        units: item.units ?? 1,

        quoteAmount: item.quoteAmount ?? 0,

        faultReported:
          item.faultReported || "",

        priority:
          item.priority || "MEDIUM",

        complaintType:
          item.complaintType || "REGULAR",

        repeatComplaintNumber:
          item.repeatComplaintNumber || "",

        adName:
          item.adName || "",

        subject:
          item.subject || "",

        description:
          item.description || "",

        additionalInfo:
          item.additionalInfo || [],

        status: item.status,

        /*
        |--------------------------------------------------------------------------
        | Dealer
        |--------------------------------------------------------------------------
        */

        allocatedDealerId:
          item.allocatedDealerId || null,

        dealerName:
          item.allocatedDealerId
            ?.technicianFirmName || "",

        technicianName:
          item.allocatedDealerId
            ?.technicianName || "",

        technicianNumber:
          item.allocatedDealerId
            ?.mobileNumber || "",

        /*
        |--------------------------------------------------------------------------
        | Warranty
        |--------------------------------------------------------------------------
        */

        isWarranty:
          item.isWarranty === true,

        warrantyEndDate:
          item.warrantyEndDate || null,

        /*
        |--------------------------------------------------------------------------
        | Parent
        |--------------------------------------------------------------------------
        */

        parentComplaintId:
          item.parentComplaintId || null,
      }),
    ),
  };
};

// export const lookupCustomerByPhone = async (
//   phone: string,
// ): Promise<CustomerLookupResponse> => {
//   const cleanedPhone = phone.trim();
//   const response = await api.get(`${CUSTOMER_API}/lookup/${cleanedPhone}`);
//   const customer = normalizeCustomer(response.data?.customer);
//   const complaintHistory = (response.data?.complaintHistory || []).map(
//     (complaint: BackendComplaint) => normalizeHistoryItem(complaint),
//   );

//   return {
//     customer,
//     complaintHistory,
//   };
// };

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
  _id: string;
  id?: string;
  product_id: number;
  product_name: string;
  status?: string;
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

export const searchCategories = async ({
  productId,
  search = "",
}: {
  productId: number;
  search?: string;
}): Promise<CategoryDropdownOption[]> => {
  const response = await api.get("/categories/dropdown", {
    params: {
      product_id: productId,
      search,
    },
  });

  return response.data?.data || [];
};

export const suspendComplaint = async (
  id: string,
  reason?: string,
): Promise<string> => {
  const response = await api.patch(`${COMPLAINT_API}/${id}/suspend`, {
    reason: reason || "",
  });
  return response.data?.message || "Complaint suspended successfully";
};

export interface EligibleDealer {
  _id: string;

  dealerCode: string;
  technicianCode: string;

  technicianFirmName: string;
  technicianName: string;

  mobileNumber: string;
  alternativeNumber?: string;

  email?: string;

  rating: number;
  status: string;

  cityId?: number;
  city?: string;

  matchedService?: {
    productId: number;
    productName: string;

    categoryId?: string;
    categoryName?: string;

    description?: string;
    rate?: number;
  };
}

export interface EligibleDealerResponse {
  success: boolean;

  filters: {
    cityId: number;
    city: string;

    productId: number;
    productName: string;

    categoryId?: string;
    category: string;
  };

  total: number;

  data: EligibleDealer[];
}

export const getEligibleDealers = async (
  complaintId: string,
) => {
  const response =
    await api.get<EligibleDealerResponse>(
      `/complaints/${complaintId}/eligible-dealers`,
    );

  return response.data;
};

export interface AssignDealerPayload {
  dealerId: string;
}

export const assignDealerToComplaint = async (
  complaintId: string,
  dealerId: string,
) => {
  const response = await api.patch(
    `/complaints/${complaintId}/assign-dealer`,
    {
      dealerId,
    },
  );

  return response.data;
};