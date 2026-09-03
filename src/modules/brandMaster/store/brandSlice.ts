import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "../services/brandApi";

import type {
  BrandFormData,
  BrandState,
} from "../types/brand.types";

const initialState: BrandState = {
  brands: [],
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchBrands = createAsyncThunk(
  "brand/fetchBrands",
  async (_, thunkAPI) => {
    try {
      return await getBrands();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch brands"
      );
    }
  }
);

export const createBrandAction = createAsyncThunk(
  "brand/createBrand",
  async (data: BrandFormData, thunkAPI) => {
    try {
      return await createBrand(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to create brand"
      );
    }
  }
);

export const updateBrandAction = createAsyncThunk(
  "brand/updateBrand",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: BrandFormData;
    },
    thunkAPI
  ) => {
    try {
      return await updateBrand(id, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to update brand"
      );
    }
  }
);

export const deleteBrandAction = createAsyncThunk(
  "brand/deleteBrand",
  async (id: string, thunkAPI) => {
    try {
      return await deleteBrand(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to delete brand"
      );
    }
  }
);

const brandSlice = createSlice({
  name: "brand",

  initialState,

  reducers: {
    clearBrandError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })

      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createBrandAction.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createBrandAction.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.brands.unshift(action.payload);
      })

      .addCase(createBrandAction.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateBrandAction.fulfilled, (state, action) => {
        const index = state.brands.findIndex(
          (brand) => brand.id === action.payload.id
        );

        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })

      .addCase(deleteBrandAction.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => brand.id !== action.payload
        );
      });
  },
});

export const {
  clearBrandError,
} = brandSlice.actions;

export default brandSlice.reducer;