// import {
//   createAsyncThunk,
//   createSlice, type
//   PayloadAction,
// } from "@reduxjs/toolkit";

// import { dealerApi } from "../services/dealerApi";

// import type {
//   Dealer,
//   DealerFilters,
//   DealerFormData,
//   DealerStats,
// } from "../types/dealer.types";

// interface DealerState {
//   dealers: Dealer[];

//   selectedDealer: Dealer | null;

//   stats: DealerStats | null;

//   loading: boolean;

//   error: string | null;

//   filters: DealerFilters;

//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// const initialState: DealerState = {
//   dealers: [],

//   selectedDealer: null,

//   stats: null,

//   loading: false,

//   error: null,

//   filters: {
//     page: 1,
//     limit: 10,
//     search: "",
//     status: "",
//   },

//   pagination: {
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   },
// };

// /* GET DEALERS */

// export const fetchDealers = createAsyncThunk(
//   "dealers/fetchDealers",
//   async (filters: DealerFilters | undefined, { rejectWithValue }) => {
//     try {
//       return await dealerApi.getDealers(filters);
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message ||
//           "Failed to fetch dealers"
//       );
//     }
//   }
// );

// /* GET SINGLE DEALER */

// export const fetchDealerById = createAsyncThunk(
//   "dealers/fetchDealerById",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       return await dealerApi.getDealerById(id);
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message ||
//           "Failed to fetch dealer"
//       );
//     }
//   }
// );

// /* CREATE DEALER */

// export const createDealer = createAsyncThunk(
//   "dealers/createDealer",
//   async (data: DealerFormData, { rejectWithValue }) => {
//     try {
//       return await dealerApi.createDealer(data);
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message ||
//           "Failed to create dealer"
//       );
//     }
//   }
// );

// /* UPDATE DEALER */

// export const updateDealer = createAsyncThunk(
//   "dealers/updateDealer",
//   async (
//     { id, data }: { id: string; data: DealerFormData },
//     { rejectWithValue }
//   ) => {
//     try {
//       return await dealerApi.updateDealer(id, data);
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message ||
//           "Failed to update dealer"
//       );
//     }
//   }
// );

// /* DELETE DEALER */

// export const deleteDealer = createAsyncThunk(
//   "dealers/deleteDealer",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await dealerApi.deleteDealer(id);

//       return id;
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message ||
//           "Failed to delete dealer"
//       );
//     }
//   }
// );

// /* STATS */

// export const fetchDealerStats = createAsyncThunk(
//   "dealers/fetchStats",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await dealerApi.getDealerStats();
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message ||
//           "Failed to fetch dealer stats"
//       );
//     }
//   }
// );

// const dealerSlice = createSlice({
//   name: "dealers",

//   initialState,

//   reducers: {
//     setFilters: (
//       state,
//       action: PayloadAction<DealerFilters>
//     ) => {
//       state.filters = {
//         ...state.filters,
//         ...action.payload,
//       };
//     },

//     clearSelectedDealer: (state) => {
//       state.selectedDealer = null;
//     },

//     clearError: (state) => {
//       state.error = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       /* FETCH */

//       .addCase(fetchDealers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(fetchDealers.fulfilled, (state, action) => {
//         state.loading = false;

//         state.dealers = action.payload.dealers;

//         state.pagination = action.payload.pagination;
//       })

//       .addCase(fetchDealers.rejected, (state, action) => {
//         state.loading = false;

//         state.error =
//           action.payload as string;
//       })

//       /* SINGLE */

//       .addCase(fetchDealerById.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(fetchDealerById.fulfilled, (state, action) => {
//         state.loading = false;

//         state.selectedDealer = action.payload;
//       })

//       .addCase(fetchDealerById.rejected, (state, action) => {
//         state.loading = false;

//         state.error =
//           action.payload as string;
//       })

//       /* CREATE */

//       .addCase(createDealer.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(createDealer.fulfilled, (state, action) => {
//         state.loading = false;

//         state.dealers.unshift(action.payload);
//       })

//       .addCase(createDealer.rejected, (state, action) => {
//         state.loading = false;

//         state.error =
//           action.payload as string;
//       })

//       /* UPDATE */

//       .addCase(updateDealer.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(updateDealer.fulfilled, (state, action) => {
//         state.loading = false;

//         state.selectedDealer = action.payload;

//         const index = state.dealers.findIndex(
//           (dealer) =>
//             dealer._id === action.payload._id
//         );

//         if (index !== -1) {
//           state.dealers[index] = action.payload;
//         }
//       })

//       .addCase(updateDealer.rejected, (state, action) => {
//         state.loading = false;

//         state.error =
//           action.payload as string;
//       })

//       /* DELETE */

//       .addCase(deleteDealer.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(deleteDealer.fulfilled, (state, action) => {
//         state.loading = false;

//         state.dealers = state.dealers.filter(
//           (dealer) =>
//             dealer._id !== action.payload
//         );
//       })

//       .addCase(deleteDealer.rejected, (state, action) => {
//         state.loading = false;

//         state.error =
//           action.payload as string;
//       })

//       /* STATS */

//       .addCase(fetchDealerStats.fulfilled, (state, action) => {
//         state.stats = action.payload;
//       });
//   },
// });

// export const {
//   setFilters,
//   clearSelectedDealer,
//   clearError,
// } = dealerSlice.actions;

// export default dealerSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DealerStatus } from "../types/dealer.types";

interface DealerState {
  search: string;
  status: DealerStatus | "ALL";
  city: string;
}

const initialState: DealerState = {
  search: "",
  status: "ALL",
  city: "ALL",
};

const dealerSlice = createSlice({
  name: "dealers",
  initialState,
  reducers: {
    setDealerSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setDealerStatus: (
      state,
      action: PayloadAction<DealerStatus | "ALL">
    ) => {
      state.status = action.payload;
    },

    setDealerCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },

    clearDealerFilters: (state) => {
      state.search = "";
      state.status = "ALL";
      state.city = "ALL";
    },
  },
});

export const {
  setDealerSearch,
  setDealerStatus,
  setDealerCity,
  clearDealerFilters,
} = dealerSlice.actions;

export default dealerSlice.reducer;