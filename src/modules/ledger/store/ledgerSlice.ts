import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  LedgerTransactionStatus,
  LedgerTransactionType,
} from "../types/ledger.types";

interface LedgerState {
  search: string;

  transactionType:
    | LedgerTransactionType
    | "ALL";

  status:
    | LedgerTransactionStatus
    | "ALL";

  dateFrom: string;

  dateTo: string;

  selectedDealerId:
    | string
    | null;

  selectedTransactionId:
    | string
    | null;
}

const initialState: LedgerState = {
  search: "",

  transactionType: "ALL",

  status: "ALL",

  dateFrom: "",

  dateTo: "",

  selectedDealerId: null,

  selectedTransactionId: null,
};

const ledgerSlice = createSlice({
  name: "ledger",

  initialState,

  reducers: {
    setLedgerSearch: (
      state,
      action: PayloadAction<string>
    ) => {
      state.search =
        action.payload;
    },

    setLedgerTransactionType: (
      state,
      action: PayloadAction<
        LedgerTransactionType | "ALL"
      >
    ) => {
      state.transactionType =
        action.payload;
    },

    setLedgerStatus: (
      state,
      action: PayloadAction<
        LedgerTransactionStatus | "ALL"
      >
    ) => {
      state.status =
        action.payload;
    },

    setLedgerDateFrom: (
      state,
      action: PayloadAction<string>
    ) => {
      state.dateFrom =
        action.payload;
    },

    setLedgerDateTo: (
      state,
      action: PayloadAction<string>
    ) => {
      state.dateTo =
        action.payload;
    },

    setSelectedLedgerDealer: (
      state,
      action: PayloadAction<
        string | null
      >
    ) => {
      state.selectedDealerId =
        action.payload;
    },

    setSelectedTransaction: (
      state,
      action: PayloadAction<
        string | null
      >
    ) => {
      state.selectedTransactionId =
        action.payload;
    },

    clearLedgerFilters: (
      state
    ) => {
      state.search = "";
      state.transactionType =
        "ALL";
      state.status = "ALL";
      state.dateFrom = "";
      state.dateTo = "";
    },
  },
});

export const {
  setLedgerSearch,
  setLedgerTransactionType,
  setLedgerStatus,
  setLedgerDateFrom,
  setLedgerDateTo,
  setSelectedLedgerDealer,
  setSelectedTransaction,
  clearLedgerFilters,
} = ledgerSlice.actions;

export default ledgerSlice.reducer;