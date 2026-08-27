import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  getAuditLogById,
  getAuditLogs,
} from "../services/auditLogApi";

import type {
  AuditAction,
  AuditLogState,
  AuditModule,
} from "../types/auditLog.types";
import type {
  AuditLog,
} from "../types/auditLog.types";

const initialState: AuditLogState = {
  logs: [],

  loading: false,

  error: null,

  selectedLog: null,

  filters: {
    search: "",

    action: "ALL",

    module: "ALL",

    userId: "ALL",

    dateFrom: "",

    dateTo: "",
  },
};

export const fetchAuditLogs =
  createAsyncThunk(
    "auditLogs/fetchAuditLogs",

    async () => {
      return await getAuditLogs();
    }
  );

export const fetchAuditLogDetails =
  createAsyncThunk(
    "auditLogs/fetchAuditLogDetails",

    async (id: string) => {
      return await getAuditLogById(
        id
      );
    }
  );

const auditLogSlice =
  createSlice({
    name: "auditLogs",

    initialState,

    reducers: {
      setAuditSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.filters.search =
          action.payload;
      },

      setAuditAction: (
        state,
        action: PayloadAction<
          AuditAction | "ALL"
        >
      ) => {
        state.filters.action =
          action.payload;
      },

      setAuditModule: (
        state,
        action: PayloadAction<
          AuditModule | "ALL"
        >
      ) => {
        state.filters.module =
          action.payload;
      },

      setAuditUser: (
        state,
        action: PayloadAction<string>
      ) => {
        state.filters.userId =
          action.payload;
      },

      setAuditDateFrom: (
        state,
        action: PayloadAction<string>
      ) => {
        state.filters.dateFrom =
          action.payload;
      },

      setAuditDateTo: (
        state,
        action: PayloadAction<string>
      ) => {
        state.filters.dateTo =
          action.payload;
      },

      resetAuditFilters: (
        state
      ) => {
        state.filters = {
          search: "",
          action: "ALL",
          module: "ALL",
          userId: "ALL",
          dateFrom: "",
          dateTo: "",
        };
      },

setSelectedAuditLog: (
  state,
  action: PayloadAction<AuditLog | null>
) => {
  state.selectedLog =
    action.payload;
},

      clearSelectedAuditLog: (
        state
      ) => {
        state.selectedLog =
          null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        // GET LOGS

        .addCase(
          fetchAuditLogs.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchAuditLogs.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.logs =
              action.payload;
          }
        )

        .addCase(
          fetchAuditLogs.rejected,
          (state) => {
            state.loading = false;

            state.error =
              "Unable to load audit logs.";
          }
        )

        // GET DETAILS

        .addCase(
          fetchAuditLogDetails.fulfilled,
          (
            state,
            action
          ) => {
            state.selectedLog =
              action.payload;
          }
        );
    },
  });

export const {
  setAuditSearch,
  setAuditAction,
  setAuditModule,
  setAuditUser,
  setAuditDateFrom,
  setAuditDateTo,
  resetAuditFilters,
  setSelectedAuditLog,
  clearSelectedAuditLog,
} =
  auditLogSlice.actions;

export default auditLogSlice.reducer;