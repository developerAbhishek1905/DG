import {
  useEffect,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import BillingRulesForm from "../components/BillingRulesForm";
import SettingsSidebar from "../components/SettingsSidebar";

import {
  fetchSettings,
  saveBillingSettings,
} from "../store/settingsSlice";

import type {
  BillingSettings,
} from "../types/settings.types";

export default function BillingSettingsPage() {
  const dispatch =
    useAppDispatch();

  const {
    billing,
    loading,
    saving,
  } =
    useAppSelector(
      (state) =>
        state.settings
    );

  useEffect(() => {
    if (!billing) {
      dispatch(
        fetchSettings()
      );
    }
  }, [
    dispatch,
    billing,
  ]);

  const handleSubmit =
    async (
      data: BillingSettings
    ) => {
      await dispatch(
        saveBillingSettings(
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
            Billing Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Configure bill generation, approvals, tax and ledger behavior.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          {loading ||
          !billing ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Loading settings...
            </p>
          ) : (
            <BillingRulesForm
              settings={
                billing
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