import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  PendingReason,
  PendingStatus,
  SLAStatus,
} from "../types/pending.types";

interface PendingState {
  search: string;

  reason:
    | PendingReason
    | "ALL";

  slaStatus:
    | SLAStatus
    | "ALL";

  status:
    | PendingStatus
    | "ALL";

  selectedPendingId:
    | string
    | null;

  reasonModalOpen: boolean;
}

const initialState: PendingState = {
  search: "",

  reason: "ALL",

  slaStatus: "ALL",

  status: "ALL",

  selectedPendingId: null,

  reasonModalOpen: false,
};

const pendingSlice =
  createSlice({
    name: "pending",

    initialState,

    reducers: {
      setPendingSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.search =
          action.payload;
      },

      setPendingReason: (
        state,
        action: PayloadAction<
          PendingReason | "ALL"
        >
      ) => {
        state.reason =
          action.payload;
      },

      setPendingSLAStatus: (
        state,
        action: PayloadAction<
          SLAStatus | "ALL"
        >
      ) => {
        state.slaStatus =
          action.payload;
      },

      setPendingStatus: (
        state,
        action: PayloadAction<
          PendingStatus | "ALL"
        >
      ) => {
        state.status =
          action.payload;
      },

      openPendingReasonModal: (
        state,
        action: PayloadAction<
          string | null | undefined
        >
      ) => {
        state.selectedPendingId =
          action.payload ??
          null;

        state.reasonModalOpen =
          true;
      },

      closePendingReasonModal: (
        state
      ) => {
        state.reasonModalOpen =
          false;

        state.selectedPendingId =
          null;
      },

      clearPendingFilters: (
        state
      ) => {
        state.search = "";
        state.reason = "ALL";
        state.slaStatus =
          "ALL";
        state.status = "ALL";
      },
    },
  });

export const {
  setPendingSearch,
  setPendingReason,
  setPendingSLAStatus,
  setPendingStatus,
  openPendingReasonModal,
  closePendingReasonModal,
  clearPendingFilters,
} = pendingSlice.actions;

export default pendingSlice.reducer;