import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  clearNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationApi";

import type {
  Notification,
  NotificationState,
  NotificationType,
} from "../types/notification.types";

const initialState: NotificationState = {
  notifications: [],

  loading: false,

  error: null,

  filters: {
    search: "",

    type: "ALL",

    status: "ALL",
  },
};

export const fetchNotifications =
  createAsyncThunk(
    "notifications/fetchNotifications",

    async () => {
      return await getNotifications();
    }
  );

export const readNotification =
  createAsyncThunk(
    "notifications/readNotification",

    async (id: string) => {
      return await markNotificationRead(
        id
      );
    }
  );

export const readAllNotifications =
  createAsyncThunk(
    "notifications/readAllNotifications",

    async () => {
      await markAllNotificationsRead();

      return true;
    }
  );

export const removeNotification =
  createAsyncThunk(
    "notifications/removeNotification",

    async (id: string) => {
      await deleteNotification(
        id
      );

      return id;
    }
  );

export const removeAllNotifications =
  createAsyncThunk(
    "notifications/removeAllNotifications",

    async () => {
      await clearNotifications();

      return true;
    }
  );

const notificationSlice =
  createSlice({
    name: "notifications",

    initialState,

    reducers: {
      setNotificationSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.filters.search =
          action.payload;
      },

      setNotificationType: (
        state,
        action: PayloadAction<
          NotificationType | "ALL"
        >
      ) => {
        state.filters.type =
          action.payload;
      },

      setNotificationStatus: (
        state,
        action: PayloadAction<
          "ALL" | "READ" | "UNREAD"
        >
      ) => {
        state.filters.status =
          action.payload;
      },

      resetNotificationFilters: (
        state
      ) => {
        state.filters = {
          search: "",
          type: "ALL",
          status: "ALL",
        };
      },

      /**
       * Later useful for WebSocket/SSE notifications.
       */
      addNotification: (
        state,
        action: PayloadAction<Notification>
      ) => {
        state.notifications.unshift(
          action.payload
        );
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        // FETCH

        .addCase(
          fetchNotifications.pending,
          (state) => {
            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          fetchNotifications.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.notifications =
              action.payload.notifications;
          }
        )

        .addCase(
          fetchNotifications.rejected,
          (state) => {
            state.loading = false;

            state.error =
              "Unable to load notifications.";
          }
        )

        // READ ONE

        .addCase(
          readNotification.fulfilled,
          (
            state,
            action
          ) => {
            const index =
              state.notifications.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.notifications[
                index
              ] =
                action.payload;
            }
          }
        )

        // READ ALL

        .addCase(
          readAllNotifications.fulfilled,
          (state) => {
            state.notifications.forEach(
              (
                notification
              ) => {
                notification.isRead =
                  true;
              }
            );
          }
        )

        // DELETE ONE

        .addCase(
          removeNotification.fulfilled,
          (
            state,
            action
          ) => {
            state.notifications =
              state.notifications.filter(
                (item) =>
                  item.id !==
                  action.payload
              );
          }
        )

        // CLEAR

        .addCase(
          removeAllNotifications.fulfilled,
          (state) => {
            state.notifications =
              [];
          }
        );
    },
  });

export const {
  setNotificationSearch,
  setNotificationType,
  setNotificationStatus,
  resetNotificationFilters,
  addNotification,
} =
  notificationSlice.actions;

export default notificationSlice.reducer;