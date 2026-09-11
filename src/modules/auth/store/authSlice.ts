import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState, AuthUser } from "../types/auth.types";

const storedToken = localStorage.getItem("token");

const storedUser = localStorage.getItem("user");

let parsedUser: AuthUser | null = null;

if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");

    localStorage.removeItem("token");
  }
}

const initialState: AuthState = {
  user: parsedUser,

  token: storedToken,

  isAuthenticated: Boolean(storedToken && parsedUser),

  loading: false,

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
      }>,
    ) => {
      
      state.loading = false;

      state.user = action.payload.user;

      state.token = action.payload.token;

      state.isAuthenticated = true;

      state.error = null;
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;

      state.error = action.payload;

      state.isAuthenticated = false;
    },

    logoutSuccess: (state) => {
      state.user = null;

      state.token = null;

      state.isAuthenticated = false;

      state.loading = false;

      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
