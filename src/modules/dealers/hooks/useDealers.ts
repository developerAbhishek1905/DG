// import { useCallback, useEffect, useState } from "react";

// import { getDealerById, getDealers, deleteDealer } from "../services/dealerApi";

// import {
//   setDealerSearch,
//   setDealerStatus,
//   setDealerCity,
//   clearDealerFilters,
// } from "../store/dealerSlice";

// import type { Dealer } from "../types/dealer.types";

// export function useDealers() {
//   const [dealers, setDealers] = useState<Dealer[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadDealers = useCallback(async () => {
//     try {
//       setLoading(true);

//       const data = await getDealers();

//       setDealers(data);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadDealers();
//   }, [loadDealers]);

//   return {
//     dealers,
//     loading,
//     refetch: loadDealers,
//   };
// }

// export function useDealerDetails(id?: string) {
//   const [dealer, setDealer] = useState<Dealer | null>(null);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) {
//       setDealer(null);
//       setLoading(false);
//       return;
//     }

//     const loadDealer = async () => {
//       try {
//         setLoading(true);

//         const data = await getDealerById(id);

//         setDealer(data ?? null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDealer();
//   }, [id]);

//   return {
//     dealer,
//     loading,
//   };
// }

import { useCallback, useEffect, useState } from "react";
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

  const fetchDealers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getDealers(filters);

      setDealers(response.data ?? []);

      setPagination(
        response.pagination ?? {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (error) {
      console.error("Failed to fetch dealers:", error);

      toast.error("Failed to load dealers");

      setDealers([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.page,
    filters.limit,
    filters.search,
    filters.status,
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


  console.log(id)
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