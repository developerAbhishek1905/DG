import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  ClosureStatus,
  ClosureType,
} from "../types/closure.types";

interface ClosureState {
  selectedClosureType:
    | ClosureType
    | null;

  search: string;

  status:
    | ClosureStatus
    | "ALL";

  type:
    | ClosureType
    | "ALL";

  selectedClosureId:
    | string
    | null;
}

const initialState: ClosureState = {
  selectedClosureType: null,

  search: "",

  status: "ALL",

  type: "ALL",

  selectedClosureId: null,
};

const closureSlice = createSlice({
  name: "closures",

  initialState,

  reducers: {
    setClosureType: (
      state,
      action: PayloadAction<
        ClosureType | null
      >
    ) => {
      state.selectedClosureType =
        action.payload;
    },

    setClosureSearch: (
      state,
      action: PayloadAction<string>
    ) => {
      state.search =
        action.payload;
    },

    setClosureStatus: (
      state,
      action: PayloadAction<
        ClosureStatus | "ALL"
      >
    ) => {
      state.status =
        action.payload;
    },

    setClosureHistoryType: (
      state,
      action: PayloadAction<
        ClosureType | "ALL"
      >
    ) => {
      state.type =
        action.payload;
    },

    setSelectedClosureId: (
      state,
      action: PayloadAction<
        string | null
      >
    ) => {
      state.selectedClosureId =
        action.payload;
    },

    clearClosureFilters: (
      state
    ) => {
      state.search = "";
      state.status = "ALL";
      state.type = "ALL";
    },

    resetClosureState: (
      state
    ) => {
      state.selectedClosureType =
        null;

      state.selectedClosureId =
        null;
    },
  },
});

export const {
  setClosureType,
  setClosureSearch,
  setClosureStatus,
  setClosureHistoryType,
  setSelectedClosureId,
  clearClosureFilters,
  resetClosureState,
} = closureSlice.actions;

export default closureSlice.reducer;