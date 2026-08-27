import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  RoleStatus,
} from "../types/accessControl.types";

interface AccessControlState {
  search: string;

  status:
    | RoleStatus
    | "ALL";
}

const initialState: AccessControlState =
  {
    search: "",
    status: "ALL",
  };

const accessControlSlice =
  createSlice({
    name:
      "accessControl",

    initialState,

    reducers: {
      setRoleSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.search =
          action.payload;
      },

      setRoleStatus: (
        state,
        action: PayloadAction<
          RoleStatus | "ALL"
        >
      ) => {
        state.status =
          action.payload;
      },

      clearRoleFilters: (
        state
      ) => {
        state.search = "";
        state.status =
          "ALL";
      },
    },
  });

export const {
  setRoleSearch,
  setRoleStatus,
  clearRoleFilters,
} =
  accessControlSlice.actions;

export default accessControlSlice.reducer;