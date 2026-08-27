import {
  useEffect,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import NotificationRulesForm from "../components/NotificationRulesForm";
import SettingsSidebar from "../components/SettingsSidebar";

import {
  fetchSettings,
  saveNotificationSettings,
} from "../store/settingsSlice";

import type {
  NotificationSettings,
} from "../types/settings.types";

export default function NotificationSettingsPage() {
  const dispatch =
    useAppDispatch();

  const {
    notifications,
    loading,
    saving,
  } =
    useAppSelector(
      (state) =>
        state.settings
    );

  useEffect(() => {
    if (
      !notifications
    ) {
      dispatch(
        fetchSettings()
      );
    }
  }, [
    dispatch,
    notifications,
  ]);

  const handleSubmit =
    async (
      data: NotificationSettings
    ) => {
      await dispatch(
        saveNotificationSettings(
          data
        )
      );
    };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <SettingsSidebar />

      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Notification Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Configure system notification events and channels.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          {loading ||
          !notifications ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Loading settings...
            </p>
          ) : (
            <NotificationRulesForm
              settings={
                notifications
              }
              saving={
                saving
              }
              onSubmit={
                handleSubmit
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}