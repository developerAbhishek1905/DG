import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  Complaint,
  ComplaintStatus,
} from "../types/complaint.types";

interface ComplaintState {
  selectedComplaint: Complaint | null;
  selectedStatus: ComplaintStatus | "ALL";
  search: string;
}

const initialState: ComplaintState = {
  selectedComplaint: null,
  selectedStatus: "ALL",
  search: "",
};

const complaintSlice = createSlice({
  name: "complaints",

  initialState,

  reducers: {
    setSelectedComplaint: (
      state,
      action: PayloadAction<Complaint | null>
    ) => {
      state.selectedComplaint = action.payload;
    },

    setSelectedStatus: (
      state,
      action: PayloadAction<ComplaintStatus | "ALL">
    ) => {
      state.selectedStatus = action.payload;
    },

    setComplaintSearch: (
      state,
      action: PayloadAction<string>
    ) => {
      state.search = action.payload;
    },

    clearComplaintFilters: (state) => {
      state.selectedStatus = "ALL";
      state.search = "";
    },
  },
});

export const {
  setSelectedComplaint,
  setSelectedStatus,
  setComplaintSearch,
  clearComplaintFilters,
} = complaintSlice.actions;

export default complaintSlice.reducer;
