// import {
//   createAsyncThunk,
//   createSlice,
//   type PayloadAction,
// } from "@reduxjs/toolkit";

// import {
//   createCategory,
//   getCategories,
//   getCategoryById,
//   toggleCategoryStatus,
//   updateCategory,
// } from "../services/categoryApi";

// import type {
//   CategoryFilters,
//   CategoryFormData,
//   CategoryState,
// } from "../types/category.types";

// const initialState: CategoryState = {
//   categories: [],
//   selectedCategory: null,
//   loading: false,
//   actionLoading: false,
//   error: null,

//   filters: {
//     search: "",
//     status: "",
//   },
// };

// export const fetchCategories = createAsyncThunk(
//   "category/fetchCategories",
//   async (_, thunkAPI) => {
//     try {
//       return await getCategories();
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   },
// );

// export const fetchCategoryById = createAsyncThunk(
//   "category/fetchCategoryById",
//   async (id: string, thunkAPI) => {
//     try {
//       const result = await getCategoryById(id);

//       if (!result) {
//         return thunkAPI.rejectWithValue("Category not found");
//       }

//       return result;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   },
// );

// export const createCategoryAction = createAsyncThunk(
//   "category/createCategory",
//   async (data: CategoryFormData, thunkAPI) => {
//     try {
//       return await createCategory(data);
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   },
// );

// export const updateCategoryAction = createAsyncThunk(
//   "category/updateCategory",
//   async (
//     {
//       id,
//       data,
//     }: {
//       id: string;
//       data: CategoryFormData;
//     },
//     thunkAPI,
//   ) => {
//     try {
//       return await updateCategory(id, data);
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   },
// );

// export const toggleCategoryStatusAction = createAsyncThunk(
//   "category/toggleStatus",
//   async (id: string, thunkAPI) => {
//     try {
//       return await toggleCategoryStatus(id);
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   },
// );

// const categorySlice = createSlice({
//   name: "category",

//   initialState,

//   reducers: {
//     setCategoryFilters: (
//       state,
//       action: PayloadAction<Partial<CategoryFilters>>,
//     ) => {
//       state.filters = {
//         ...state.filters,
//         ...action.payload,
//       };
//     },

//     resetCategoryFilters: (state) => {
//       state.filters = {
//         search: "",
//         status: "",
//       };
//     },

//     clearSelectedCategory: (state) => {
//       state.selectedCategory = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.loading = false;

//         state.categories = action.payload;
//       })

//       .addCase(fetchCategories.rejected, (state, action) => {
//         state.loading = false;

//         state.error = action.payload as string;
//       })

//       .addCase(fetchCategoryById.fulfilled, (state, action) => {
//         state.selectedCategory = action.payload;
//       })

//       .addCase(createCategoryAction.pending, (state) => {
//         state.actionLoading = true;
//       })

//       .addCase(createCategoryAction.fulfilled, (state, action) => {
//         state.actionLoading = false;

//         state.categories.unshift(action.payload);
//       })

//       .addCase(createCategoryAction.rejected, (state, action) => {
//         state.actionLoading = false;

//         state.error = action.payload as string;
//       })

//       .addCase(updateCategoryAction.fulfilled, (state, action) => {
//         const index = state.categories.findIndex(
//           (item) => item.id === action.payload.id,
//         );

//         if (index !== -1) {
//           state.categories[index] = action.payload;
//         }

//         state.selectedCategory = action.payload;

//         state.actionLoading = false;
//       })

//       .addCase(toggleCategoryStatusAction.fulfilled, (state, action) => {
//         const index = state.categories.findIndex(
//           (item) => item.id === action.payload.id,
//         );

//         if (index !== -1) {
//           state.categories[index] = action.payload;
//         }
//       });
//   },
// });

// export const {
//   setCategoryFilters,
//   resetCategoryFilters,
//   clearSelectedCategory,
// } = categorySlice.actions;

// export default categorySlice.reducer;


import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  createCategory,
  deleteCategory,
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

const initialState: CategoryState = {
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

// ============================================
// GET ALL CATEGORIES
// ============================================

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      return await getCategories();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch categories",
      );
    }
  },
);

// ============================================
// GET CATEGORY BY ID
// ============================================

export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (id: string, thunkAPI) => {
    try {
      const result = await getCategoryById(id);

      if (!result) {
        return thunkAPI.rejectWithValue("Category not found");
      }

      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch category",
      );
    }
  },
);

// ============================================
// CREATE CATEGORY
// ============================================

export const createCategoryAction = createAsyncThunk(
  "category/createCategory",
  async (data: CategoryFormData, thunkAPI) => {
    try {
      return await createCategory(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create category",
      );
    }
  },
);

// ============================================
// UPDATE CATEGORY
// ============================================

export const updateCategoryAction = createAsyncThunk(
  "category/updateCategory",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: CategoryFormData;
    },
    thunkAPI,
  ) => {
    try {
      return await updateCategory(id, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update category",
      );
    }
  },
);

// ============================================
// TOGGLE CATEGORY STATUS
// ============================================

export const toggleCategoryStatusAction = createAsyncThunk(
  "category/toggleStatus",
  async (
    {
      id,
      currentStatus,
    }: {
      id: string;
      currentStatus: "ACTIVE" | "INACTIVE";
    },
    thunkAPI,
  ) => {
    try {
      return await toggleCategoryStatus(id, currentStatus);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update category status",
      );
    }
  },
);

// ============================================
// DELETE CATEGORY
// ============================================

export const deleteCategoryAction = createAsyncThunk(
  "category/deleteCategory",
  async (id: string, thunkAPI) => {
    try {
      await deleteCategory(id);

      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete category",
      );
    }
  },
);

// ============================================
// SLICE
// ============================================

const categorySlice = createSlice({
  name: "category",

  initialState,

  reducers: {
    setCategoryFilters: (
      state,
      action: PayloadAction<Partial<CategoryFilters>>,
    ) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetCategoryFilters: (state) => {
      state.filters = {
        search: "",
        status: "",
      };
    },

    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },

    clearCategoryError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ========================================
      // FETCH ALL
      // ========================================

      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ========================================
      // FETCH BY ID
      // ========================================

      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })

      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ========================================
      // CREATE
      // ========================================

      .addCase(createCategoryAction.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createCategoryAction.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.categories.unshift(action.payload);
      })

      .addCase(createCategoryAction.rejected, (state, action) => {
        state.actionLoading = false;

        state.error = action.payload as string;
      })

      // ========================================
      // UPDATE
      // ========================================

      .addCase(updateCategoryAction.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateCategoryAction.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.categories.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }

        state.selectedCategory = action.payload;
      })

      .addCase(updateCategoryAction.rejected, (state, action) => {
        state.actionLoading = false;

        state.error = action.payload as string;
      })

      // ========================================
      // TOGGLE STATUS
      // ========================================

      .addCase(toggleCategoryStatusAction.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(toggleCategoryStatusAction.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.categories.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }

        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = action.payload;
        }
      })

      .addCase(toggleCategoryStatusAction.rejected, (state, action) => {
        state.actionLoading = false;

        state.error = action.payload as string;
      })

      // ========================================
      // DELETE
      // ========================================

      .addCase(deleteCategoryAction.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(deleteCategoryAction.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.categories = state.categories.filter(
          (item) => item.id !== action.payload,
        );

        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
      })

      .addCase(deleteCategoryAction.rejected, (state, action) => {
        state.actionLoading = false;

        state.error = action.payload as string;
      });
  },
});

export const {
  setCategoryFilters,
  resetCategoryFilters,
  clearSelectedCategory,
  clearCategoryError,
} = categorySlice.actions;

export default categorySlice.reducer;