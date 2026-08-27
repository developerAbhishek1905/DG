import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  UserStatus,
} from "../types/user.types";

interface UserState {
  search: string;

  status: UserStatus | "ALL";

  roleId: string;
}

const initialState: UserState = {
  search: "",
  status: "ALL",
  roleId: "ALL",
};

const userSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    setUserSearch: (
      state,
      action: PayloadAction<string>
    ) => {
      state.search = action.payload;
    },

    setUserStatus: (
      state,
      action: PayloadAction<
        UserStatus | "ALL"
      >
    ) => {
      state.status = action.payload;
    },

    setUserRole: (
      state,
      action: PayloadAction<string>
    ) => {
      state.roleId = action.payload;
    },

    clearUserFilters: (state) => {
      state.search = "";
      state.status = "ALL";
      state.roleId = "ALL";
    },
  },
});

export const {
  setUserSearch,
  setUserStatus,
  setUserRole,
  clearUserFilters,
} = userSlice.actions;

export default userSlice.reducer;