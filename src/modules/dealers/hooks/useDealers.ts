// import { useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import type { AppDispatch, RootState } from "../../../app/store";

// import {
//   fetchDealerById,
//   fetchDealerStats,
//   fetchDealers,
//   deleteDealer,
//   setFilters,
// } from "../store/dealerSlice";

// import type { DealerFilters } from "../types/dealer.types";

// export const useDealers = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const {
//     dealers,
//     selectedDealer,
//     stats,
//     loading,
//     error,
//     filters,
//     pagination,
//   } = useSelector(
//     (state: RootState) => state.dealers
//   );

//   const loadDealers = useCallback(
//     (newFilters?: DealerFilters) => {
//       const finalFilters = {
//         ...filters,
//         ...newFilters,
//       };

//       dispatch(setFilters(finalFilters));

//       dispatch(fetchDealers(finalFilters));
//     },
//     [dispatch, filters]
//   );

//   const loadDealer = useCallback(
//     (id: string) => {
//       dispatch(fetchDealerById(id));
//     },
//     [dispatch]
//   );

//   const loadStats = useCallback(() => {
//     dispatch(fetchDealerStats());
//   }, [dispatch]);

//   const removeDealer = useCallback(
//     (id: string) => {
//       dispatch(deleteDealer(id));
//     },
//     [dispatch]
//   );

//   return {
//     dealers,
//     selectedDealer,
//     stats,
//     loading,
//     error,
//     filters,
//     pagination,

//     loadDealers,
//     loadDealer,
//     loadStats,
//     removeDealer,
//   };
// };

import { useCallback, useEffect, useState } from "react";

import {
  getDealerById,
  getDealers,
  deleteDealer,
} from "../services/dealerApi";

import {
  setDealerSearch,
  setDealerStatus,
  setDealerCity,
  clearDealerFilters,
} from "../store/dealerSlice";

import type { Dealer } from "../types/dealer.types";

export function useDealers() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDealers = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getDealers();

      setDealers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDealers();
  }, [loadDealers]);

  return {
    dealers,
    loading,
    refetch: loadDealers,
  };
}

export function useDealerDetails(id?: string) {
  const [dealer, setDealer] =
    useState<Dealer | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!id) {
      setDealer(null);
      setLoading(false);
      return;
    }

    const loadDealer = async () => {
      try {
        setLoading(true);

        const data =
          await getDealerById(id);

        setDealer(data ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadDealer();
  }, [id]);

  return {
    dealer,
    loading,
  };
}