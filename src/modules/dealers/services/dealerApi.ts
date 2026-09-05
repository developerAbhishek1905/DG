import api from "../../../services/api/axios";
import type { Dealer, DealerFormData } from "../types/dealer.types";

const DEALER_API = "/dealers";

export interface CategoryDropdown {
  id: string;
  groupCategoryCode: string;
  category: string;
  categoryDescription: string;
}

export interface ProductDropdownOption {
  id?: string;
  product_id: number;
  product_name: string;
}

export interface CategoryDropdownOption {
  id: string;

  product_id?: number;

  category?: string;

  categoryDescription?: string;

  groupCategoryCode?: string;
}


export const mockDealers: Dealer[] = [
  {
    id: "1",
    dealerCode: "DLR-001",
    name: "ABC Service Center",
    ownerName: "Amit Sharma",
    email: "abcservice@example.com",
    phone: "9876543210",

    city: "Indore",
    state: "Madhya Pradesh",
    address: "Vijay Nagar, Indore",
    pincode: "452010",

    supportedProducts: ["Air Conditioner", "Washing Machine", "Refrigerator"],

    capacity: {
      total: 30,
      used: 18,
    },

    status: "ACTIVE",

    performance: {
      totalComplaints: 420,
      completedComplaints: 370,
      pendingComplaints: 25,
      cancelledComplaints: 25,
      cancellationRate: 5.95,
      slaCompliance: 94,
      averageResponseTime: 18,
      feedbackScore: 4.6,
      performanceScore: 92,
    },

    rates: {
      visit: 300,
      service: 700,
      installation: 900,
      uninstallation: 600,
      other: 400,
    },

    createdAt: "2026-05-01T10:00:00",
    updatedAt: "2026-08-20T10:00:00",
  },

  {
    id: "2",
    dealerCode: "DLR-002",
    name: "Reliable Electronics",
    ownerName: "Suresh Verma",
    email: "reliable@example.com",
    phone: "9898989898",

    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "MP Nagar, Bhopal",
    pincode: "462011",

    supportedProducts: ["Television", "Air Conditioner", "Refrigerator"],

    capacity: {
      total: 25,
      used: 23,
    },

    status: "ACTIVE",

    performance: {
      totalComplaints: 310,
      completedComplaints: 260,
      pendingComplaints: 30,
      cancelledComplaints: 20,
      cancellationRate: 6.45,
      slaCompliance: 89,
      averageResponseTime: 26,
      feedbackScore: 4.2,
      performanceScore: 84,
    },

    rates: {
      visit: 250,
      service: 650,
      installation: 850,
      uninstallation: 550,
      other: 350,
    },

    createdAt: "2026-04-15T09:00:00",
    updatedAt: "2026-08-18T13:00:00",
  },

  {
    id: "3",
    dealerCode: "DLR-003",
    name: "FastFix Appliances",
    ownerName: "Rakesh Jain",
    email: "fastfix@example.com",
    phone: "9112233445",

    city: "Indore",
    state: "Madhya Pradesh",
    address: "Palasia, Indore",
    pincode: "452001",

    supportedProducts: ["Washing Machine", "Microwave", "Air Conditioner"],

    capacity: {
      total: 20,
      used: 8,
    },

    status: "ACTIVE",

    performance: {
      totalComplaints: 215,
      completedComplaints: 190,
      pendingComplaints: 15,
      cancelledComplaints: 10,
      cancellationRate: 4.65,
      slaCompliance: 97,
      averageResponseTime: 14,
      feedbackScore: 4.8,
      performanceScore: 95,
    },

    rates: {
      visit: 320,
      service: 720,
      installation: 950,
      uninstallation: 650,
      other: 420,
    },

    createdAt: "2026-03-12T09:00:00",
    updatedAt: "2026-08-22T14:00:00",
  },

  {
    id: "4",
    dealerCode: "DLR-004",
    name: "Smart Care Services",
    ownerName: "Deepak Mehta",
    email: "smartcare@example.com",
    phone: "9000011111",

    city: "Ujjain",
    state: "Madhya Pradesh",
    address: "Freeganj, Ujjain",
    pincode: "456010",

    supportedProducts: ["Air Conditioner", "Refrigerator"],

    capacity: {
      total: 15,
      used: 6,
    },

    status: "INACTIVE",

    performance: {
      totalComplaints: 180,
      completedComplaints: 145,
      pendingComplaints: 15,
      cancelledComplaints: 20,
      cancellationRate: 11.11,
      slaCompliance: 78,
      averageResponseTime: 35,
      feedbackScore: 3.8,
      performanceScore: 67,
    },

    rates: {
      visit: 280,
      service: 600,
      installation: 800,
      uninstallation: 500,
      other: 300,
    },

    createdAt: "2026-01-20T09:00:00",
    updatedAt: "2026-07-10T10:00:00",
  },
];

let dealers = [...mockDealers];

const buildDealerFormData = (data: DealerFormData): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // undefined / null values skip
    if (value === undefined || value === null) {
      return;
    }

    // File
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    // FileList
    if (value instanceof FileList) {
      Array.from(value).forEach((file) => {
        formData.append(key, file);
      });
      return;
    }

    // Arrays / Objects
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // boolean / number / string
    formData.append(key, String(value));
  });

  return formData;
};

export const getDealers = async (
  filters?: DealerFilters,
): Promise<Dealer[]> => {
  const response = await api.get(DEALER_API, {
    params: {
      search: filters?.search || undefined,
      status: filters?.status || undefined,
    },
  });

  return response.data.data ?? response.data;
};

export const getDealerById = async (id: string): Promise<Dealer> => {
  const response = await api.get(`${DEALER_API}/${id}`);

  return response.data.data ?? response.data;
};

export const createDealer = async (data: DealerFormData): Promise<Dealer> => {
  const formData = buildDealerFormData(data);

  const response = await api.post(DEALER_API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data ?? response.data;
};

export const updateDealer = async (
  id: string,
  data: Partial<DealerFormData>,
): Promise<Dealer> => {
  const formData = buildDealerFormData(data as DealerFormData);

  const response = await api.put(`${DEALER_API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data ?? response.data;
};

export const deleteDealer = async (id: string): Promise<boolean> => {
  await api.delete(`${DEALER_API}/${id}`);

  return true;
};

/* ===================================================== */
/* PRODUCTS */
/* ===================================================== */

export const searchProducts = async (
  search = "",
): Promise<ProductDropdownOption[]> => {
  const response = await api.get(
    "/products/dropdown",
    {
      params: {
        search,
      },
    },
  );

  return (
    response.data?.data?.products ??
    response.data?.data ??
    []
  );
};

/* ===================================================== */
/* CATEGORIES / SERVICES */
/* ===================================================== */

export const searchProductCategories = async ({
  productId,
  search = "",
}: {
  productId: number;
  search?: string;
}): Promise<CategoryDropdownOption[]> => {
  const response = await api.get(
    "/categories/dropdown",
    {
      params: {
        product_id: productId,
        search,
      },
    },
  );

  return (
    response.data?.data?.categories ??
    response.data?.data ??
    []
  );
};


