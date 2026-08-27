import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  VerificationPriority,
  VerificationSLAStatus,
  VerificationStatus,
} from "../types/verification.types";

interface VerificationState {
  search: string;

  status:
    | VerificationStatus
    | "ALL";

  priority:
    | VerificationPriority
    | "ALL";

  slaStatus:
    | VerificationSLAStatus
    | "ALL";

  closureType: string;

  selectedVerificationId:
    | string
    | null;

  verifyModalOpen: boolean;

  rejectModalOpen: boolean;

  correctionModalOpen: boolean;
}

const initialState: VerificationState = {
  search: "",

  status: "ALL",

  priority: "ALL",

  slaStatus: "ALL",

  closureType: "ALL",

  selectedVerificationId: null,

  verifyModalOpen: false,

  rejectModalOpen: false,

  correctionModalOpen: false,
};

const verificationSlice =
  createSlice({
    name: "verification",

    initialState,

    reducers: {
      setVerificationSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.search =
          action.payload;
      },

      setVerificationStatus: (
        state,
        action: PayloadAction<
          VerificationStatus | "ALL"
        >
      ) => {
        state.status =
          action.payload;
      },

      setVerificationPriority: (
        state,
        action: PayloadAction<
          VerificationPriority | "ALL"
        >
      ) => {
        state.priority =
          action.payload;
      },

      setVerificationSLAStatus: (
        state,
        action: PayloadAction<
          VerificationSLAStatus | "ALL"
        >
      ) => {
        state.slaStatus =
          action.payload;
      },

      setVerificationClosureType: (
        state,
        action: PayloadAction<string>
      ) => {
        state.closureType =
          action.payload;
      },

      openVerifyModal: (
        state,
        action: PayloadAction<string>
      ) => {
        state.selectedVerificationId =
          action.payload;

        state.verifyModalOpen =
          true;
      },

      closeVerifyModal: (
        state
      ) => {
        state.verifyModalOpen =
          false;

        state.selectedVerificationId =
          null;
      },

      openRejectVerificationModal: (
        state,
        action: PayloadAction<string>
      ) => {
        state.selectedVerificationId =
          action.payload;

        state.rejectModalOpen =
          true;
      },

      closeRejectVerificationModal: (
        state
      ) => {
        state.rejectModalOpen =
          false;

        state.selectedVerificationId =
          null;
      },

      openCorrectionModal: (
        state,
        action: PayloadAction<string>
      ) => {
        state.selectedVerificationId =
          action.payload;

        state.correctionModalOpen =
          true;
      },

      closeCorrectionModal: (
        state
      ) => {
        state.correctionModalOpen =
          false;

        state.selectedVerificationId =
          null;
      },

      clearVerificationFilters: (
        state
      ) => {
        state.search = "";
        state.status = "ALL";
        state.priority = "ALL";
        state.slaStatus = "ALL";
        state.closureType = "ALL";
      },
    },
  });

export const {
  setVerificationSearch,
  setVerificationStatus,
  setVerificationPriority,
  setVerificationSLAStatus,
  setVerificationClosureType,

  openVerifyModal,
  closeVerifyModal,

  openRejectVerificationModal,
  closeRejectVerificationModal,

  openCorrectionModal,
  closeCorrectionModal,

  clearVerificationFilters,
} = verificationSlice.actions;

export default verificationSlice.reducer;