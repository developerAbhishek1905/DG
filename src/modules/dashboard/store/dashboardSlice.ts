import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface DashboardState {
  period:
    | "TODAY"
    | "7_DAYS"
    | "30_DAYS"
    | "THIS_MONTH";

  dealerId: string;

  city: string;
}

const initialState: DashboardState = {
  period: "7_DAYS",

  dealerId: "ALL",

  city: "ALL",
};

const dashboardSlice =
  createSlice({
    name: "dashboard",

    initialState,

    reducers: {
      setDashboardPeriod: (
        state,
        action: PayloadAction<
          DashboardState["period"]
        >
      ) => {
        state.period =
          action.payload;
      },

      setDashboardDealer: (
        state,
        action: PayloadAction<string>
      ) => {
        state.dealerId =
          action.payload;
      },

      setDashboardCity: (
        state,
        action: PayloadAction<string>
      ) => {
        state.city =
          action.payload;
      },

      resetDashboardFilters: (
        state
      ) => {
        state.period =
          "7_DAYS";

        state.dealerId =
          "ALL";

        state.city =
          "ALL";
      },
    },
  });

export const {
  setDashboardPeriod,
  setDashboardDealer,
  setDashboardCity,
  resetDashboardFilters,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;