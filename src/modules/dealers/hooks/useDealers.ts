import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  getDealers,
  getDealerById,
  type DealerFilters,
} from "../services/dealerApi";

import type { Dealer } from "../types/dealer.types";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* =========================================
   DEALER LIST
========================================= */

export function useDealers(filters: DealerFilters) {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | Request ID
  |--------------------------------------------------------------------------
  |
  | Har API call ko unique ID milegi.
  | Sirf latest request response UI update karega.
  |
  */

  const requestRef = useRef(0);

  const fetchDealers = useCallback(async () => {
    const requestId = ++requestRef.current;

    try {
      setLoading(true);

      const response = await getDealers(filters);

      /*
      |--------------------------------------------------------------------------
      | Ignore stale response
      |--------------------------------------------------------------------------
      */

      if (requestId !== requestRef.current) {
        return;
      }

      setDealers(response.data ?? []);

      setPagination(
        response.pagination ?? {
          page: filters.page ?? 1,
          limit: filters.limit ?? 10,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (error) {
      /*
      |--------------------------------------------------------------------------
      | Ignore error from old request
      |--------------------------------------------------------------------------
      */

      if (requestId !== requestRef.current) {
        return;
      }

      console.error("Failed to fetch dealers:", error);

      setDealers([]);

      setPagination({
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        total: 0,
        totalPages: 0,
      });
    } finally {
      /*
      |--------------------------------------------------------------------------
      | Only latest request can stop loading
      |--------------------------------------------------------------------------
      */

      if (requestId === requestRef.current) {
        setLoading(false);
      }
    }
  }, [
    filters.page,
    filters.limit,
    filters.search,
    filters.status,
    filters.cityId,
    filters.categoryId,
    filters.productId,
  ]);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  return {
    dealers,
    loading,
    pagination,
    refetch: fetchDealers,
  };
}

/* =========================================
   DEALER DETAILS
========================================= */

export function useDealerDetails(id?: string) {
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(false);

  console.log(id);
  const fetchDealer = useCallback(async () => {
    if (!id) {
      setDealer(null);
      return;
    }

    try {
      setLoading(true);

      const data = await getDealerById(id);

      setDealer(data);
    } catch (error) {
      console.error("Failed to fetch dealer details:", error);

      toast.error("Failed to load dealer details");

      setDealer(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDealer();
  }, [fetchDealer]);

  return {
    dealer,
    loading,
    refetch: fetchDealer,
  };
}
