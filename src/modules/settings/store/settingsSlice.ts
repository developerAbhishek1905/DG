import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getBillingSettings,
  getCancellationReasons,
  getNotificationSettings,
  getPendingReasons,
  getPermissionSettings,
  getSLASettings,
  getStatusSettings,
  updateBillingSettings,
  updateNotificationSettings,
  updatePermissionSettings,
  updateSLASettings,
} from "../services/settingsApi";

import type {
  BillingSettings,
  NotificationSettings,
  PermissionSetting,
  SettingsState,
  SLASettings,
} from "../types/settings.types";

const initialState: SettingsState = {
  sla: null,

  notifications: null,

  billing: null,

  statuses: [],

  cancellationReasons: [],

  pendingReasons: [],

  permissions: [],

  loading: false,

  saving: false,

  error: null,
};

export const fetchSettings =
  createAsyncThunk(
    "settings/fetchSettings",
    async () => {
      const [
        sla,
        notifications,
        billing,
        statuses,
        cancellationReasons,
        pendingReasons,
        permissions,
      ] =
        await Promise.all([
          getSLASettings(),
          getNotificationSettings(),
          getBillingSettings(),
          getStatusSettings(),
          getCancellationReasons(),
          getPendingReasons(),
          getPermissionSettings(),
        ]);

      return {
        sla,
        notifications,
        billing,
        statuses,
        cancellationReasons,
        pendingReasons,
        permissions,
      };
    }
  );

export const saveSLASettings =
  createAsyncThunk(
    "settings/saveSLA",

    async (
      data: SLASettings
    ) => {
      return await updateSLASettings(
        data
      );
    }
  );

export const saveNotificationSettings =
  createAsyncThunk(
    "settings/saveNotifications",

    async (
      data: NotificationSettings
    ) => {
      return await updateNotificationSettings(
        data
      );
    }
  );

export const saveBillingSettings =
  createAsyncThunk(
    "settings/saveBilling",

    async (
      data: BillingSettings
    ) => {
      return await updateBillingSettings(
        data
      );
    }
  );

export const savePermissionSettings =
  createAsyncThunk(
    "settings/savePermissions",

    async (
      data: PermissionSetting[]
    ) => {
      return await updatePermissionSettings(
        data
      );
    }
  );

const settingsSlice =
  createSlice({
    name: "settings",

    initialState,

    reducers: {},

    extraReducers: (
      builder
    ) => {
      builder

        .addCase(
          fetchSettings.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchSettings.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.sla =
              action.payload.sla;

            state.notifications =
              action.payload.notifications;

            state.billing =
              action.payload.billing;

            state.statuses =
              action.payload.statuses;

            state.cancellationReasons =
              action.payload.cancellationReasons;

            state.pendingReasons =
              action.payload.pendingReasons;

            state.permissions =
              action.payload.permissions;
          }
        )

        .addCase(
          fetchSettings.rejected,
          (state) => {
            state.loading = false;

            state.error =
              "Unable to load settings.";
          }
        )

        .addCase(
          saveSLASettings.pending,
          (state) => {
            state.saving = true;
          }
        )

        .addCase(
          saveSLASettings.fulfilled,
          (
            state,
            action
          ) => {
            state.saving = false;

            state.sla =
              action.payload;
          }
        )

        .addCase(
          saveNotificationSettings.pending,
          (state) => {
            state.saving = true;
          }
        )

        .addCase(
          saveNotificationSettings.fulfilled,
          (
            state,
            action
          ) => {
            state.saving = false;

            state.notifications =
              action.payload;
          }
        )

        .addCase(
          saveBillingSettings.pending,
          (state) => {
            state.saving = true;
          }
        )

        .addCase(
          saveBillingSettings.fulfilled,
          (
            state,
            action
          ) => {
            state.saving = false;

            state.billing =
              action.payload;
          }
        )

        .addCase(
          savePermissionSettings.pending,
          (state) => {
            state.saving = true;
          }
        )

        .addCase(
          savePermissionSettings.fulfilled,
          (
            state,
            action
          ) => {
            state.saving = false;

            state.permissions =
              action.payload;
          }
        );
    },
  });

export default settingsSlice.reducer;