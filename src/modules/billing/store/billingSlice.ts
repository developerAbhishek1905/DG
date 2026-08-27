import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  BillingStatus,
  RateType,
} from "../types/billing.types";

interface BillingState {
  search: string;

  status:
    | BillingStatus
    | "ALL";

  type:
    | RateType
    | "ALL";

  dealerId: string;

  selectedBillId:
    | string
    | null;

  rateSearch: string;
}

const initialState: BillingState = {
  search: "",

  status: "ALL",

  type: "ALL",

  dealerId: "ALL",

  selectedBillId: null,

  rateSearch: "",
};

const billingSlice =
  createSlice({
    name: "billing",

    initialState,

    reducers: {
      setBillingSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.search =
          action.payload;
      },

      setBillingStatus: (
        state,
        action: PayloadAction<
          BillingStatus | "ALL"
        >
      ) => {
        state.status =
          action.payload;
      },

      setBillingType: (
        state,
        action: PayloadAction<
          RateType | "ALL"
        >
      ) => {
        state.type =
          action.payload;
      },

      setBillingDealer: (
        state,
        action: PayloadAction<string>
      ) => {
        state.dealerId =
          action.payload;
      },

      setSelectedBillId: (
        state,
        action: PayloadAction<
          string | null
        >
      ) => {
        state.selectedBillId =
          action.payload;
      },

      setRateSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.rateSearch =
          action.payload;
      },

      clearBillingFilters: (
        state
      ) => {
        state.search = "";
        state.status = "ALL";
        state.type = "ALL";
        state.dealerId =
          "ALL";
      },
    },
  });

export const {
  setBillingSearch,
  setBillingStatus,
  setBillingType,
  setBillingDealer,
  setSelectedBillId,
  setRateSearch,
  clearBillingFilters,
} = billingSlice.actions;

export default billingSlice.reducer;