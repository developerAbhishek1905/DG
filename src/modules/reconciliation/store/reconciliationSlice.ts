import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  ReconciliationStatus,
} from "../types/reconciliation.types";

interface ReconciliationState {
  search: string;

  status:
    | ReconciliationStatus
    | "ALL";

  dateFrom: string;

  dateTo: string;

  selectedReconciliationId:
    | string
    | null;
}

const initialState: ReconciliationState = {
  search: "",
  status: "ALL",
  dateFrom: "",
  dateTo: "",
  selectedReconciliationId: null,
};

const reconciliationSlice =
  createSlice({
    name: "reconciliation",

    initialState,

    reducers: {
      setReconciliationSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.search =
          action.payload;
      },

      setReconciliationStatus: (
        state,
        action: PayloadAction<
          ReconciliationStatus | "ALL"
        >
      ) => {
        state.status =
          action.payload;
      },

      setReconciliationDateFrom: (
        state,
        action: PayloadAction<string>
      ) => {
        state.dateFrom =
          action.payload;
      },

      setReconciliationDateTo: (
        state,
        action: PayloadAction<string>
      ) => {
        state.dateTo =
          action.payload;
      },

      setSelectedReconciliation: (
        state,
        action: PayloadAction<
          string | null
        >
      ) => {
        state.selectedReconciliationId =
          action.payload;
      },

      clearReconciliationFilters: (
        state
      ) => {
        state.search = "";
        state.status = "ALL";
        state.dateFrom = "";
        state.dateTo = "";
      },
    },
  });

export const {
  setReconciliationSearch,
  setReconciliationStatus,
  setReconciliationDateFrom,
  setReconciliationDateTo,
  setSelectedReconciliation,
  clearReconciliationFilters,
} = reconciliationSlice.actions;

export default reconciliationSlice.reducer;