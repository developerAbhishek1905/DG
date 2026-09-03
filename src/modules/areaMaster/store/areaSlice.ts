import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

// import {
//   createArea,
//   getAreaById,
//   getAreas,
//   toggleAreaStatus,
//   updateArea,
// } from "../services/areaApi";

// import type {
//   AreaFilters,
//   AreaFormData,
//   AreaState,
// } from "../types/area.types";

const initialState: AreaState = {
  areas: [],

  selectedArea: null,

  loading: false,

  actionLoading: false,

  error: null,

  filters: {
    search: "",
    city: "",
    state: "",
    status: "",
  },
};

export const fetchAreas =
  createAsyncThunk(
    "area/fetchAreas",
    async (
      _,
      thunkAPI
    ) => {
      try {
        return await getAreas();
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Failed to fetch areas"
        );
      }
    }
  );

export const fetchAreaById =
  createAsyncThunk(
    "area/fetchAreaById",
    async (
      id: string,
      thunkAPI
    ) => {
      try {
        const area =
          await getAreaById(
            id
          );

        if (!area) {
          return thunkAPI.rejectWithValue(
            "Area not found"
          );
        }

        return area;
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Failed to fetch area"
        );
      }
    }
  );

export const createAreaAction =
  createAsyncThunk(
    "area/createArea",
    async (
      data: AreaFormData,
      thunkAPI
    ) => {
      try {
        return await createArea(
          data
        );
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Failed to create area"
        );
      }
    }
  );

export const updateAreaAction =
  createAsyncThunk(
    "area/updateArea",
    async (
      {
        id,
        data,
      }: {
        id: string;
        data: AreaFormData;
      },
      thunkAPI
    ) => {
      try {
        return await updateArea(
          id,
          data
        );
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Failed to update area"
        );
      }
    }
  );

export const toggleAreaStatusAction =
  createAsyncThunk(
    "area/toggleStatus",
    async (
      id: string,
      thunkAPI
    ) => {
      try {
        return await toggleAreaStatus(
          id
        );
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Failed to update status"
        );
      }
    }
  );

const areaSlice =
  createSlice({
    name: "area",

    initialState,

    reducers: {
      setAreaFilters: (
        state,
        action: PayloadAction<
          Partial<AreaFilters>
        >
      ) => {
        state.filters = {
          ...state.filters,
          ...action.payload,
        };
      },

      resetAreaFilters: (
        state
      ) => {
        state.filters = {
          search: "",
          city: "",
          state: "",
          status: "",
        };
      },

      clearSelectedArea: (
        state
      ) => {
        state.selectedArea =
          null;
      },

      clearAreaError: (
        state
      ) => {
        state.error =
          null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder
        .addCase(
          fetchAreas.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchAreas.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.areas =
              action.payload;
          }
        )

        .addCase(
          fetchAreas.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload as string;
          }
        )

        .addCase(
          fetchAreaById.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchAreaById.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.selectedArea =
              action.payload;
          }
        )

        .addCase(
          fetchAreaById.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload as string;
          }
        )

        .addCase(
          createAreaAction.pending,
          (state) => {
            state.actionLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          createAreaAction.fulfilled,
          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            state.areas.unshift(
              action.payload
            );
          }
        )

        .addCase(
          createAreaAction.rejected,
          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            state.error =
              action.payload as string;
          }
        )

        .addCase(
          updateAreaAction.pending,
          (state) => {
            state.actionLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          updateAreaAction.fulfilled,
          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            state.selectedArea =
              action.payload;

            const index =
              state.areas.findIndex(
                (area) =>
                  area.id ===
                  action.payload.id
              );

            if (
              index !== -1
            ) {
              state.areas[index] =
                action.payload;
            }
          }
        )

        .addCase(
          updateAreaAction.rejected,
          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            state.error =
              action.payload as string;
          }
        )

        .addCase(
          toggleAreaStatusAction
            .fulfilled,
          (
            state,
            action
          ) => {
            const index =
              state.areas.findIndex(
                (area) =>
                  area.id ===
                  action.payload.id
              );

            if (
              index !== -1
            ) {
              state.areas[index] =
                action.payload;
            }
          }
        );
    },
  });

export const {
  setAreaFilters,
  resetAreaFilters,
  clearSelectedArea,
  clearAreaError,
} = areaSlice.actions;

export default areaSlice.reducer;