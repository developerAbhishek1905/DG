import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createItem,
  getItemById,
  getItems,
  updateItem,
} from "../services/itemApi";

import type {
  ItemFormData,
  ItemState,
} from "../types/item.types";

const initialState: ItemState =
  {
    items: [],

    selectedItem: null,

    loading: false,

    actionLoading: false,

    error: null,
  };

export const fetchItems =
  createAsyncThunk(
    "item/fetchItems",
    async () =>
      await getItems()
  );

export const fetchItemById =
  createAsyncThunk(
    "item/fetchItemById",
    async (
      id: string
    ) =>
      await getItemById(
        id
      )
  );

export const createItemAction =
  createAsyncThunk(
    "item/createItem",
    async (
      data: ItemFormData
    ) =>
      await createItem(
        data
      )
  );

export const updateItemAction =
  createAsyncThunk(
    "item/updateItem",
    async ({
      id,
      data,
    }: {
      id: string;
      data: ItemFormData;
    }) =>
      await updateItem(
        id,
        data
      )
  );

const itemSlice =
  createSlice({
    name: "item",

    initialState,

    reducers: {
      clearSelectedItem: (
        state
      ) => {
        state.selectedItem =
          null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder
        .addCase(
          fetchItems.pending,
          (state) => {
            state.loading =
              true;
          }
        )

        .addCase(
          fetchItems.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.items =
              action.payload;
          }
        )

        .addCase(
          fetchItemById.fulfilled,
          (
            state,
            action
          ) => {
            state.selectedItem =
              action.payload ??
              null;
          }
        )

        .addCase(
          createItemAction.fulfilled,
          (
            state,
            action
          ) => {
            state.items.unshift(
              action.payload
            );
          }
        )

        .addCase(
          updateItemAction.fulfilled,
          (
            state,
            action
          ) => {
            const index =
              state.items.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.items[index] =
                action.payload;
            }

            state.selectedItem =
              action.payload;
          }
        );
    },
  });

export const {
  clearSelectedItem,
} = itemSlice.actions;

export default itemSlice.reducer;