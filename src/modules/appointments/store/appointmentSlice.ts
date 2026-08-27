import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  AppointmentStatus,
  AppointmentType,
} from "../types/appointment.types";

interface AppointmentState {
  search: string;

  status:
    | AppointmentStatus
    | "ALL";

  type:
    | AppointmentType
    | "ALL";

  date: string;

  selectedAppointmentId:
    | string
    | null;

  rescheduleModalOpen: boolean;
}

const initialState: AppointmentState = {
  search: "",

  status: "ALL",

  type: "ALL",

  date: "",

  selectedAppointmentId: null,

  rescheduleModalOpen: false,
};

const appointmentSlice =
  createSlice({
    name: "appointments",

    initialState,

    reducers: {
      setAppointmentSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.search =
          action.payload;
      },

      setAppointmentStatus: (
        state,
        action: PayloadAction<
          AppointmentStatus | "ALL"
        >
      ) => {
        state.status =
          action.payload;
      },

      setAppointmentType: (
        state,
        action: PayloadAction<
          AppointmentType | "ALL"
        >
      ) => {
        state.type =
          action.payload;
      },

      setAppointmentDate: (
        state,
        action: PayloadAction<string>
      ) => {
        state.date =
          action.payload;
      },

      openRescheduleModal: (
        state,
        action: PayloadAction<string>
      ) => {
        state.selectedAppointmentId =
          action.payload;

        state.rescheduleModalOpen =
          true;
      },

      closeRescheduleModal: (
        state
      ) => {
        state.selectedAppointmentId =
          null;

        state.rescheduleModalOpen =
          false;
      },

      clearAppointmentFilters: (
        state
      ) => {
        state.search = "";
        state.status = "ALL";
        state.type = "ALL";
        state.date = "";
      },
    },
  });

export const {
  setAppointmentSearch,
  setAppointmentStatus,
  setAppointmentType,
  setAppointmentDate,
  openRescheduleModal,
  closeRescheduleModal,
  clearAppointmentFilters,
} =
  appointmentSlice.actions;

export default appointmentSlice.reducer;