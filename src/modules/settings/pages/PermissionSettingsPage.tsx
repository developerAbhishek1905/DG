import {
  useEffect,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import PermissionMatrix from "../components/PermissionMatrix";
import SettingsSidebar from "../components/SettingsSidebar";

import {
  fetchSettings,
  savePermissionSettings,
} from "../store/settingsSlice";

import type {
  PermissionSetting,
} from "../types/settings.types";

export default function PermissionSettingsPage() {
  const dispatch =
    useAppDispatch();

  const {
    permissions,
    loading,
    saving,
  } =
    useAppSelector(
      (state) =>
        state.settings
    );

  const [
    localPermissions,
    setLocalPermissions,
  ] =
    useState<
      PermissionSetting[]
    >([]);

  useEffect(() => {
    if (
      !permissions.length
    ) {
      dispatch(
        fetchSettings()
      );
    }
  }, [
    dispatch,
    permissions.length,
  ]);

  useEffect(() => {
    setLocalPermissions(
      permissions.map(
        (item) => ({
          ...item,
        })
      )
    );
  }, [permissions]);

  const handleSave =
    async () => {
      await dispatch(
        savePermissionSettings(
          localPermissions
        )
      );
    };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <SettingsSidebar />

      <div>
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Permission Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Configure globally available permissions and default behavior.
            </p>
          </div>

          <button
            onClick={
              handleSave
            }
            disabled={
              saving
            }
            className="h-fit rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Loading permissions...
            </p>
          ) : (
            <PermissionMatrix
              permissions={
                localPermissions
              }
              onChange={
                setLocalPermissions
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}