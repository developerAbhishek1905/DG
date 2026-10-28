import api from "../../../services/api/axios";

import type {
  ProductOption,
  RateFormValues,
  RateListItem,
  RateListPagination,
  RateListParams,
} from "../types/rateList.types";

const RATE_API = "/rate-list";

export const getRateList = async (
  params: RateListParams,
): Promise<{ data: RateListItem[]; pagination: RateListPagination }> => {
  const response = await api.get(RATE_API, {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.search ? { search: params.search } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.productId ? { productId: params.productId } : {}),
    },
  });

  return {
    data: response.data.data ?? [],
    pagination: response.data.pagination,
  };
};

export const createRateListItem = async (
  data: RateFormValues,
): Promise<RateListItem> => {
  const response = await api.post(RATE_API, data);
  return response.data.data;
};

export const updateRateListItem = async (
  id: string,
  data: Partial<RateFormValues>,
): Promise<RateListItem> => {
  const response = await api.put(`${RATE_API}/${id}`, data);
  return response.data.data;
};

export const toggleRateListStatus = async (id: string): Promise<RateListItem> => {
  const response = await api.patch(`${RATE_API}/${id}/status`);
  return response.data.data;
};

export const deleteRateListItem = async (id: string): Promise<void> => {
  await api.delete(`${RATE_API}/${id}`);
};

type RawProduct = {
  product_id?: number | string;
  product_name?: string;
  status?: string;
};

const toOptions = (list: RawProduct[]): ProductOption[] =>
  list
    .filter((p) => p.product_id !== undefined && p.product_name)
    .map((p) => ({
      product_id: Number(p.product_id),
      product_name: String(p.product_name),
    }));

/**
 * Products for the dropdown. Uses the dropdown endpoint and, if that fails or
 * returns nothing, falls back to the normal product list.
 */
export const getProductOptions = async (
  search = "",
): Promise<ProductOption[]> => {
  try {
    const response = await api.get("/products/dropdown", {
      params: { search },
    });

    const options = toOptions(response.data?.data ?? []);
    if (options.length > 0) return options;
  } catch {
    // fall through to the list endpoint
  }

  const response = await api.get("/products", {
    params: { limit: 100, ...(search ? { search } : {}) },
  });

  const payload = response.data?.data;
  const list: RawProduct[] = Array.isArray(payload)
    ? payload
    : (payload?.products ?? payload?.items ?? []);

  return toOptions(list).filter(
    (p, i, arr) => arr.findIndex((x) => x.product_id === p.product_id) === i,
  );
};

/** Active Closure Master entries of one product. */
export const getClosureOptions = async (
  productId: number,
): Promise<RateListItem[]> => {
  const result = await getRateList({
    page: 1,
    limit: 100,
    status: "ACTIVE",
    productId: String(productId),
  });

  return result.data;
};
