import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  CancellationReasonType,
  CancellationStatus,
  VerificationStatus,
} from "../types/cancellation.types";

interface CancellationState {
  search: string;

  status:
    | CancellationStatus
    | "ALL";

  reason:
    | CancellationReasonType
    | "ALL";

  verification:
    | VerificationStatus
    | "ALL";

  selectedCancellationId:
    | string
    | null;

  approveModalOpen: boolean;

  rejectModalOpen: boolean;

  reassignModalOpen: boolean;
}

const initialState: CancellationState = {
  search: "",

  status: "ALL",

  reason: "ALL",

  verification: "ALL",

  selectedCancellationId: null,

  approveModalOpen: false,

  rejectModalOpen: false,

  reassignModalOpen: false,
};

const cancellationSlice =
  createSlice({
    name: "cancellations",

    initialState,

    reducers: {
      setCancellationSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.search =
          action.payload;
      },

      setCancellationStatus: (
        state,
        action: PayloadAction<
          | CancellationStatus
          | "ALL"
        >
      ) => {
        state.status =
          action.payload;
      },

      setCancellationReason: (
        state,
        action: PayloadAction<
          | CancellationReasonType
          | "ALL"
        >
      ) => {
        state.reason =
          action.payload;
      },

      setCancellationVerification: (
        state,
        action: PayloadAction<
          | VerificationStatus
          | "ALL"
        >
      ) => {
        state.verification =
          action.payload;
      },

      openApproveCancellationModal: (
        state,
        action: PayloadAction<string>
      ) => {
        state.selectedCancellationId =
          action.payload;

        state.approveModalOpen =
          true;
      },

      closeApproveCancellationModal: (
        state
      ) => {
        state.approveModalOpen =
          false;

        state.selectedCancellationId =
          null;
      },

      openRejectCancellationModal: (
        state,
        action: PayloadAction<string>
      ) => {
        state.selectedCancellationId =
          action.payload;

        state.rejectModalOpen =
          true;
      },

      closeRejectCancellationModal: (
        state
      ) => {
        state.rejectModalOpen =
          false;

        state.selectedCancellationId =
          null;
      },

      openReassignCancellationModal: (
        state,
        action: PayloadAction<string>
      ) => {
        state.selectedCancellationId =
          action.payload;

        state.reassignModalOpen =
          true;
      },

      closeReassignCancellationModal: (
        state
      ) => {
        state.reassignModalOpen =
          false;

        state.selectedCancellationId =
          null;
      },

      clearCancellationFilters: (
        state
      ) => {
        state.search = "";

        state.status = "ALL";

        state.reason = "ALL";

        state.verification =
          "ALL";
      },
    },
  });

export const {
  setCancellationSearch,
  setCancellationStatus,
  setCancellationReason,
  setCancellationVerification,

  openApproveCancellationModal,
  closeApproveCancellationModal,

  openRejectCancellationModal,
  closeRejectCancellationModal,

  openReassignCancellationModal,
  closeReassignCancellationModal,

  clearCancellationFilters,
} = cancellationSlice.actions;

export default cancellationSlice.reducer;