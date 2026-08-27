import {
  createAsyncThunk,
  createSlice, type
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  createCategory,
  getCategories,
  getCategoryById,
  toggleCategoryStatus,
  updateCategory,
} from "../services/categoryApi";

import type {
  CategoryFilters,
  CategoryFormData,
  CategoryState,
} from "../types/category.types";

const initialState: CategoryState =
  {
    categories: [],
    selectedCategory: null,
    loading: false,
    actionLoading: false,
    error: null,

    filters: {
      search: "",
      status: "",
    },
  };

export const fetchCategories =
  createAsyncThunk(
    "category/fetchCategories",
    async (
      _,
      thunkAPI
    ) => {
      try {
        return await getCategories();
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message
        );
      }
    }
  );

export const fetchCategoryById =
  createAsyncThunk(
    "category/fetchCategoryById",
    async (
      id: string,
      thunkAPI
    ) => {
      try {
        const result =
          await getCategoryById(
            id
          );

        if (!result) {
          return thunkAPI.rejectWithValue(
            "Category not found"
          );
        }

        return result;
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message
        );
      }
    }
  );

export const createCategoryAction =
  createAsyncThunk(
    "category/createCategory",
    async (
      data: CategoryFormData,
      thunkAPI
    ) => {
      try {
        return await createCategory(
          data
        );
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message
        );
      }
    }
  );

export const updateCategoryAction =
  createAsyncThunk(
    "category/updateCategory",
    async (
      {
        id,
        data,
      }: {
        id: string;
        data: CategoryFormData;
      },
      thunkAPI
    ) => {
      try {
        return await updateCategory(
          id,
          data
        );
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message
        );
      }
    }
  );

export const toggleCategoryStatusAction =
  createAsyncThunk(
    "category/toggleStatus",
    async (
      id: string,
      thunkAPI
    ) => {
      try {
        return await toggleCategoryStatus(
          id
        );
      } catch (
        error: any
      ) {
        return thunkAPI.rejectWithValue(
          error.message
        );
      }
    }
  );

const categorySlice =
  createSlice({
    name: "category",

    initialState,

    reducers: {
      setCategoryFilters: (
        state,
        action: PayloadAction<
          Partial<CategoryFilters>
        >
      ) => {
        state.filters = {
          ...state.filters,
          ...action.payload,
        };
      },

      resetCategoryFilters: (
        state
      ) => {
        state.filters = {
          search: "",
          status: "",
        };
      },

      clearSelectedCategory: (
        state
      ) => {
        state.selectedCategory =
          null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder
        .addCase(
          fetchCategories.pending,
          (state) => {
            state.loading =
              true;
          }
        )

        .addCase(
          fetchCategories.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.categories =
              action.payload;
          }
        )

        .addCase(
          fetchCategories.rejected,
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
          fetchCategoryById.fulfilled,
          (
            state,
            action
          ) => {
            state.selectedCategory =
              action.payload;
          }
        )

        .addCase(
          createCategoryAction.pending,
          (state) => {
            state.actionLoading =
              true;
          }
        )

        .addCase(
          createCategoryAction.fulfilled,
          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            state.categories.unshift(
              action.payload
            );
          }
        )

        .addCase(
          createCategoryAction.rejected,
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
          updateCategoryAction.fulfilled,
          (
            state,
            action
          ) => {
            const index =
              state.categories.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.categories[index] =
                action.payload;
            }

            state.selectedCategory =
              action.payload;

            state.actionLoading =
              false;
          }
        )

        .addCase(
          toggleCategoryStatusAction.fulfilled,
          (
            state,
            action
          ) => {
            const index =
              state.categories.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.categories[index] =
                action.payload;
            }
          }
        );
    },
  });

export const {
  setCategoryFilters,
  resetCategoryFilters,
  clearSelectedCategory,
} = categorySlice.actions;

export default categorySlice.reducer;