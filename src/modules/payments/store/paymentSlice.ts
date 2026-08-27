import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  PaymentMethod,
  PaymentStatus,
} from "../types/payment.types";

interface PaymentState {
  search: string;

  status:
    | PaymentStatus
    | "ALL";

  method:
    | PaymentMethod
    | "ALL";

  dealerId: string;

  dateFrom: string;

  dateTo: string;

  selectedPaymentId:
    | string
    | null;
}

const initialState: PaymentState = {
  search: "",

  status: "ALL",

  method: "ALL",

  dealerId: "ALL",

  dateFrom: "",

  dateTo: "",

  selectedPaymentId: null,
};

const paymentSlice =
  createSlice({
    name: "payments",

    initialState,

    reducers: {
      setPaymentSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.search =
          action.payload;
      },

      setPaymentStatus: (
        state,
        action: PayloadAction<
          PaymentStatus | "ALL"
        >
      ) => {
        state.status =
          action.payload;
      },

      setPaymentMethod: (
        state,
        action: PayloadAction<
          PaymentMethod | "ALL"
        >
      ) => {
        state.method =
          action.payload;
      },

      setPaymentDealer: (
        state,
        action: PayloadAction<string>
      ) => {
        state.dealerId =
          action.payload;
      },

      setPaymentDateFrom: (
        state,
        action: PayloadAction<string>
      ) => {
        state.dateFrom =
          action.payload;
      },

      setPaymentDateTo: (
        state,
        action: PayloadAction<string>
      ) => {
        state.dateTo =
          action.payload;
      },

      setSelectedPayment: (
        state,
        action: PayloadAction<
          string | null
        >
      ) => {
        state.selectedPaymentId =
          action.payload;
      },

      clearPaymentFilters: (
        state
      ) => {
        state.search = "";
        state.status = "ALL";
        state.method = "ALL";
        state.dealerId =
          "ALL";
        state.dateFrom = "";
        state.dateTo = "";
      },
    },
  });

export const {
  setPaymentSearch,
  setPaymentStatus,
  setPaymentMethod,
  setPaymentDealer,
  setPaymentDateFrom,
  setPaymentDateTo,
  setSelectedPayment,
  clearPaymentFilters,
} = paymentSlice.actions;

export default paymentSlice.reducer;