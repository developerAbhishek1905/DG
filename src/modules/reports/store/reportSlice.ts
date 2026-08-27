import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  ReportFiltersData,
  ReportPeriod,
} from "../types/report.types";

interface ReportState {
  filters: ReportFiltersData;
}

const initialFilters: ReportFiltersData = {
  search: "",
  period: "30_DAYS",
  dateFrom: "",
  dateTo: "",
  status: "ALL",
  dealerId: "ALL",
  city: "ALL",
};

const initialState: ReportState = {
  filters: initialFilters,
};

const reportSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    setReportSearch: (
      state,
      action: PayloadAction<string>
    ) => {
      state.filters.search = action.payload;
    },

    setReportPeriod: (
      state,
      action: PayloadAction<ReportPeriod>
    ) => {
      state.filters.period = action.payload;
    },

    setReportDateFrom: (
      state,
      action: PayloadAction<string>
    ) => {
      state.filters.dateFrom = action.payload;
    },

    setReportDateTo: (
      state,
      action: PayloadAction<string>
    ) => {
      state.filters.dateTo = action.payload;
    },

    setReportStatus: (
      state,
      action: PayloadAction<string>
    ) => {
      state.filters.status = action.payload;
    },

    setReportDealer: (
      state,
      action: PayloadAction<string>
    ) => {
      state.filters.dealerId = action.payload;
    },

    setReportCity: (
      state,
      action: PayloadAction<string>
    ) => {
      state.filters.city = action.payload;
    },

    resetReportFilters: (state) => {
      state.filters = {
        ...initialFilters,
      };
    },
  },
});

export const {
  setReportSearch,
  setReportPeriod,
  setReportDateFrom,
  setReportDateTo,
  setReportStatus,
  setReportDealer,
  setReportCity,
  resetReportFilters,
} = reportSlice.actions;

export default reportSlice.reducer;