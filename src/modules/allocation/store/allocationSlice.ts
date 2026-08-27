import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface AllocationState {
  search: string;

  city: string;

  eligibility: "ALL" | "ELIGIBLE" | "NOT_ELIGIBLE";

  selectedDealerId: string | null;

  reassignModalOpen: boolean;
}

const initialState: AllocationState = {
  search: "",
  city: "ALL",
  eligibility: "ALL",
  selectedDealerId: null,
  reassignModalOpen: false,
};

const allocationSlice = createSlice({
  name: "allocation",

  initialState,

  reducers: {
    setAllocationSearch: (
      state,
      action: PayloadAction<string>
    ) => {
      state.search = action.payload;
    },

    setAllocationCity: (
      state,
      action: PayloadAction<string>
    ) => {
      state.city = action.payload;
    },

    setAllocationEligibility: (
      state,
      action: PayloadAction<
        "ALL" | "ELIGIBLE" | "NOT_ELIGIBLE"
      >
    ) => {
      state.eligibility = action.payload;
    },

    setSelectedDealerId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.selectedDealerId = action.payload;
    },

    openReassignModal: (
      state,
      action: PayloadAction<string | null | undefined>
    ) => {
      state.selectedDealerId =
        action.payload ?? null;

      state.reassignModalOpen = true;
    },

    closeReassignModal: (state) => {
      state.reassignModalOpen = false;
    },

    clearAllocationFilters: (state) => {
      state.search = "";
      state.city = "ALL";
      state.eligibility = "ALL";
    },

    resetAllocationState: (state) => {
      state.search = "";
      state.city = "ALL";
      state.eligibility = "ALL";
      state.selectedDealerId = null;
      state.reassignModalOpen = false;
    },
  },
});

export const {
  setAllocationSearch,
  setAllocationCity,
  setAllocationEligibility,
  setSelectedDealerId,
  openReassignModal,
  closeReassignModal,
  clearAllocationFilters,
  resetAllocationState,
} = allocationSlice.actions;

export default allocationSlice.reducer;