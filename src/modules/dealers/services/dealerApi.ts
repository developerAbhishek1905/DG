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

export interface DealerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

const buildDealerFormData = (data: DealerFormData) => {
  const formData = new FormData();

  /* =========================
     BASIC VALUES
  ========================= */

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    /*
     * Nested objects handled separately.
     */
    if (
      [
        "businessAddress",
        "residentialAddress",
        "productServices",
        "combinedCapacity",
        "individualCapacities",

        "aadhaarFrontFile",
        "aadhaarBackFile",
        "panFrontFile",
        "panBackFile",
        "drivingLicenceFrontFile",
        "drivingLicenceBackFile",
        "documentUpload",
      ].includes(key)
    ) {
      return;
    }

    formData.append(key, String(value));
  });

  /* =========================
     NESTED OBJECTS
  ========================= */

  formData.append("businessAddress", JSON.stringify(data.businessAddress));

  formData.append(
    "residentialAddress",
    JSON.stringify(data.residentialAddress),
  );

  formData.append(
    "productServices",
    JSON.stringify(data.productServices ?? []),
  );

  formData.append(
    "combinedCapacity",
    JSON.stringify(
      data.combinedCapacity ?? {
        products: [],
        capacity: 0,
      },
    ),
  );

  formData.append(
    "individualCapacities",
    JSON.stringify(data.individualCapacities ?? []),
  );

  /* =========================
     DOCUMENTS
  ========================= */

  if (data.aadhaarFrontFile?.[0]) {
    formData.append("aadhaarFrontFile", data.aadhaarFrontFile[0]);
  }

  if (data.aadhaarBackFile?.[0]) {
    formData.append("aadhaarBackFile", data.aadhaarBackFile[0]);
  }

  if (data.panFrontFile?.[0]) {
    formData.append("panFrontFile", data.panFrontFile[0]);
  }

  if (data.panBackFile?.[0]) {
    formData.append("panBackFile", data.panBackFile[0]);
  }

  if (data.drivingLicenceFrontFile?.[0]) {
    formData.append("drivingLicenceFrontFile", data.drivingLicenceFrontFile[0]);
  }

  if (data.drivingLicenceBackFile?.[0]) {
    formData.append("drivingLicenceBackFile", data.drivingLicenceBackFile[0]);
  }

  if (data.documentUpload) {
    Array.from(data.documentUpload).forEach((file) => {
      formData.append("documentUpload", file);
    });
  }

  return formData;
};

export const createDealer = async (data: DealerFormData): Promise<Dealer> => {
  const formData = buildDealerFormData(data);

  const response = await api.post(DEALER_API, formData);

  return response.data.data;
};

export const updateDealer = async (
  id: string,
  data: DealerFormData,
): Promise<Dealer> => {
  const formData = buildDealerFormData(data);

  const response = await api.put(`${DEALER_API}/${id}`, formData);

  return response.data.data;
};

export const getDealers = async (filters: DealerFilters = {}) => {
  const response = await api.get(DEALER_API, {
    params: filters,
  });

  return response.data;
};

export const getDealerById = async (id: string): Promise<Dealer> => {
  const response = await api.get(`${DEALER_API}/${id}`);

  return response.data.data;
};

export const deleteDealer = async (id: string) => {
  const response = await api.delete(`${DEALER_API}/${id}`);

  return response.data;
};

export const updateDealerStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
) => {
  const response = await api.patch(`${DEALER_API}/${id}/status`, {
    status,
  });

  return response.data.data;
};

/* ===================================================== */
/* PRODUCTS */
/* ===================================================== */

export const searchProducts = async (
  search = "",
): Promise<ProductDropdownOption[]> => {
  const response = await api.get("/products/dropdown", {
    params: {
      search,
    },
  });

  return response.data?.data?.products ?? response.data?.data ?? [];
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
  const response = await api.get("/categories/dropdown", {
    params: {
      product_id: productId,
      search,
    },
  });

  return response.data?.data?.categories ?? response.data?.data ?? [];
};
